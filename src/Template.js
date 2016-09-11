const valueMatcher = /\s*\{(.*)\}\s*/i;
const evaluators = Object.create(null);

function Template(templateElement) {
  this.templateElement = ('object' === typeof templateElement)
    ? templateElement
    : document.querySelector(templateElement);
  if (!this.templateElement) {
    throw new Error('Template not found');
  }
}

Template.prototype = {
  _evaluateValue: function(text, data) {
    const m = valueMatcher.exec(text);
    if (m) {
      const expression = m[1];
      const evaluator = evaluators[expression]
        || (evaluators[expression] = new Function('return (' + expression + ')'));
      return {r: evaluator.call(data)};
    }
    return null;
  },

  _renderElementNode: function(node, data) {
    for (var i = 0; i < node.attributes.length; i++) {
      var attrib = node.attributes[i];
      if (attrib.specified) {
        const result = this._evaluateValue(attrib.value, data);
        if (result) {
          attrib.value = result.r;
        }
      }
    }
  },

  _renderTextNode: function(node, data) {
    const text = node.textContent;
    const result = this._evaluateValue(node.textContent, data);
    if (!result) {
      return;
    }
    const rendered = result.r;

    // Small optimization for common case textNode -> text:
    // Avoid removing old / adding new node for non-object-items.
    if ('object' === typeof rendered) {
      const parentNode = node.parentNode;
      parentNode.removeChild(node);
      this._appendChild(parentNode, rendered);
    }
    else {
      node.textContent = rendered;
    }
  },

  _appendChild: function(parentNode, data) {
    if ('object' === typeof data) {
      // object: Can be:
      if (data instanceof Array) {
        // Array: Do for each.
        data.forEach(function(item) {
          this._appendChild(parentNode, item);
        }.bind(this));
      }
      else if (data instanceof Node) {
        // DOM-Node: Just append.
        parentNode.appendChild(data);
      }
      else {
        // Some native object: To string
        parentNode.appendChild(document.createTextNode(data.toString()));
      }
    }
    else {
      // set as text
      parentNode.appendChild(document.createTextNode(data));
    }
  },

  render: function(data) {
    //var node = this.templateElement.cloneNode(true);
    var rootNode = document.importNode(this.templateElement, true);
    rootNode.normalize();

    const nodeIterator = document.createNodeIterator(
      rootNode, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);

    for (
      var node = nodeIterator.nextNode();
      node;
      node = nodeIterator.nextNode()) {
      if (node instanceof Element) {
        this._renderElementNode(node, data);
      }
      else if (node instanceof Text) {
        this._renderTextNode(node, data);
      }
    }

    return rootNode;
  }
};

module.exports = Template;
