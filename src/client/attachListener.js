import dispatcher from 'Dispatcher';

//------------------------------------------------------------------------------
export default function attachListener(target, listenerSrc = null) {
  const listener = listenerSrc || target.constructor.listener;
  const componentWillUnmount = target.componentWillUnmount || null;
  const bound = {};

  // prepare detaching
  target.componentWillUnmount = () => {
    Object.keys(bound).forEach(message => {
      dispatcher.off(message, bound[message]);
      delete bound[message];
    });
    if (componentWillUnmount) {
      componentWillUnmount.call(target);
    }
  };

  // bind and attach
  Object.keys(listener).forEach(message => {
    dispatcher.on(message, bound[message] = listener[message].bind(target));
  });
}
