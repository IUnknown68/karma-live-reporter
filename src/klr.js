import 'babel-polyfill';
import io from 'socket.io-client';

const exported = ('undefined' === typeof window)
  ? ('undefined' === typeof module)
    ? {}
    : module.exports
  : window.karmaLiveReporter = {};

exported.connect = io;
