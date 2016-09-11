//----------------------------------------------------------------------------
function isAtEnd(e) {
  return e.scrollHeight - e.scrollTop === e.clientHeight;
}

//----------------------------------------------------------------------------
function updateScroll(e) {
  if (!e) {
    return;
  }
  if (this.scrollEnabled) {
    e.scrollTop = e.scrollHeight;
  }
}

//------------------------------------------------------------------------------
export default function autoScroll(target) {
  const componentDidMount = (target.componentDidMount)
    ? ::target.componentDidMount
    : null;

  target.scrollEnabled = true;

  target.componentDidMount = () => {
    target.updateScroll = updateScroll.bind(target, target.refs.root);
    target.refs.root.addEventListener('scroll', () => {
      target.scrollEnabled = isAtEnd(target.refs.root);
    });
    if (componentDidMount) {
      componentDidMount();
    }
  };
}
