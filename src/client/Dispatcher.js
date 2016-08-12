//------------------------------------------------------------------------------
// Helper: return a postpone function for this environment.
// The postpone function checks if something is already waiting to run
// (`_isRunning === true`).
// If not, it sets `_isRunning` and postpones the call to fn via `nextTick`,
// `setTimout` or similar. It can be called safely multiple times, without
// postponing a new call.
const _createPostpone = (fn) => {
  var _isRunning = false;

  // The function actually called. Calls fn and resets the running flag.
  const _tickFn = () => {
    fn();
    // It's important that the flag is reset AFTER fn ran.
    // Otherwise a new timer event would be generated if postpone is called from
    // within fn (happens when a message handler posts another message).
    _isRunning = false;
  }

  if ('object' === typeof process && '[object process]' === process.toString() && process.nextTick) {
    return () => {
      if (_isRunning) {
        return;
      }
      _isRunning = true;
      process.nextTick(_tickFn);
    };
  }

  return () => {
    if (_isRunning) {
      return;
    }
    _isRunning = true;
    setTimeout(_tickFn, 0);
  };
}

//==============================================================================
// QueueEntry class. Simple list entry.
class QueueEntry {
  constructor (data, previous) {
    if (previous) {
      previous.next = this;
    }
    this.next = null;
    this.data = data;
  }
}

//==============================================================================
// Queue class. Simple singly linked list.
class Queue {
  constructor() {
    this._head = this._tail = null;
    this._length = 0;  // ro
  }

  //----------------------------------------------------------------------------
  // queue (push tail) an entry
  queue(data) {
    this._tail = new QueueEntry(data, this._tail);
    this._head = this._head || this._tail;
    ++this._length;
  }

  //----------------------------------------------------------------------------
  // dequeue (pop head) entry
  dequeue() {
    if (!this._head) {
      return null;
    }
    --this._length;
    var entry = this._head;
    this._head = this._head.next;
    entry.next = null;
    return entry.data;
  }
}

//==============================================================================
// HandlerSet class
// Holds all handlers for a certain action.
class HandlerSet {
  constructor() {
    this.handler = new Set();
  }

  //------------------------------------------------------------------------------
  // method add
  add(handler) {
    if (this.handler.has(handler)) {
      return;
    }
    this.handler.add(handler);
  }

  //------------------------------------------------------------------------------
  // method remove
  remove(handler) {
    this.handler.delete(handler);
  }

  //------------------------------------------------------------------------------
  // method invoke
  invoke(args) {
    // The handler function is invoked with as many arguments as were passed to
    // `send()` or `post()`, where the first argument (action) becomes the last
    // for the call.
    for (let handler of this.handler) {
      let ret = handler(...args);
      // remove the handler when explicitly false is returned
      if (false === ret) {
        this.handler.delete(handler);
      }
    }
  };

}

//==============================================================================
// HandlerMap class
// Holds a map action => HandlerSet.
class HandlerMap {
  constructor() {
    this.handlerSets = new Map();
  }

  //------------------------------------------------------------------------------
  // method add
  add(handler, action) {
    var handlerSet = this.handlerSets.get(action);
    if (!handlerSet) {
      handlerSet = new HandlerSet();
      this.handlerSets.set(action, handlerSet);
    }
    handlerSet.add(handler);
  }

  //------------------------------------------------------------------------------
  // method remove
  remove(handler, action) {
    var handlerSet = this.handlerSets.get(action);
    if (handlerSet) {
      handlerSet.remove(handler);
    }
  }

  //------------------------------------------------------------------------------
  // method dispatch
  dispatch(args) {
    var handlerSet = this.handlerSets.get(args[args.length-1]);
    if (handlerSet) {
      handlerSet.invoke(args);
    }
  }
}


//==============================================================================
// Function called from postponed. Executes the queue.
const _runQueue = function() {
  for (var args = this._messageQueue.dequeue(); args; args = this._messageQueue.dequeue()) {
    try {
      this._dispatch(args);
/*
      if (args._deferred) {
        args._deferred.resolve();
      }
*/
    }
    catch(e) {
/*
      if (args._deferred) {
        args._deferred.reject(e);
      }
*/
      throw e;
    }
  }
};

//==============================================================================
// Dispatcher Implementation.
//==============================================================================
var DispatcherImplementation = {};

//------------------------------------------------------------------------------
// method on()
// Adds a handler for a certain action.
DispatcherImplementation.on = function(action, handler) {
  this._check(action);
  this._map.add(handler, action);
};

//------------------------------------------------------------------------------
// method off()
// Removes a handler for a certain action.
DispatcherImplementation.off = function(action, handler) {
  this._check(action);
  this._map.remove(handler, action);
};

//------------------------------------------------------------------------------
// method post()
// Sends an action asynchronously to all matching receivers.
DispatcherImplementation.post = function(action, ...args) {
  this._check(action);
  args.push(action);
//  args._deferred = defer();
  this._messageQueue.queue(args);
  this._postpone();
//  return args._deferred.promise;
};

//------------------------------------------------------------------------------
// method send()
// Sends an action synchronously to all matching receivers.
DispatcherImplementation.send = function(action, ...args) {
  this._check(action);
  args.push(action);
  this._dispatch(args);
};

//------------------------------------------------------------------------------
// method createAction()
// Creates a function that can be used with none or one arguments to send a
// certain action, i.e. without specifying the action `action`.
// In other words: It binds a send function to a certain action, and optional
// also to certain data.
// Useful for passing to promise.then() or as click handler for components.
// Thus the function returned takes one argument, which it uses as action data
// if the second argument to createAction() is undefined.
DispatcherImplementation.createAction = (...argsCreateAction) =>
  (...argsFn) => {
    this.send(...argsCreateAction.concat(argsFn));
  };


//------------------------------------------------------------------------------
// method isRegistered()
//
DispatcherImplementation.isRegistered = function(action) {
  return this._actions.has(action);
};

//------------------------------------------------------------------------------
// method register()
//
DispatcherImplementation.register = function(action) {
  var ret = this._actions.get(action);
  if (!ret) {
    ret = {
      fn: this.createAction(action)
    };
    ret.fn.on = this.on.bind(this, action);
    ret.fn.off = this.on.bind(this, action);
    this._actions.set(action, ret);
  }
  return ret.fn;
};

//==============================================================================
// The dispatcher is supposed to be used as a singleton, hence the constructor
// is hidden. However, if you feel like using multipe message loops, you can
// export the constructor instead of the one and only instance.
class Dispatcher {
  constructor() {
    var _privates = {
      _strict: false,
      _map: new HandlerMap(),
      _messageQueue: new Queue(),
      _actions: new Map()
    };

    // extend: for dispatcher extensions
    this.extend = (name, fn) => {
      if ('object' === typeof name) {
        // name is object with functions
        Object.keys(name).forEach(function(key) {
          this.extend(key, name[key]);
        }.bind(this));
      }
      else if (('function' === typeof name) && ('object' === typeof name.prototype)) {
        // name is assumed to be a constructor
        const pt = name.prototype;
        name.call(_privates);
        Object.keys(pt).forEach(function(key) {
          this.extend(key, pt[key]);
        }.bind(this));
      }
      else if (name && ('function' === typeof fn)) {
        // standard case: name and function
        this[name] = _privates[name] = fn.bind(_privates);
      }
      // ignore other values gracefully
      return this;
    }

    // Own prototype first
    this.extend(DispatcherImplementation);

    // proxy - can be used by extensions
    _privates._dispatch = (args) => {
      _privates._map.dispatch(args);
    };

    // strictmode check
    _privates._check = (action) => {
      if (this._strict && !this.isRegistered(action)) {
        throw new Error('Dispatcher: Action "' + action + '" not registered.');
      }
    };

    // init loop
    _privates._postpone = _createPostpone(_runQueue.bind(_privates));
  }
}

//==============================================================================
export default new Dispatcher();
