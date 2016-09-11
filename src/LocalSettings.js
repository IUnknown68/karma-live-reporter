import dispatcher from 'Dispatcher';
import { debounce } from 'lodash';
import { SETTINGS_CHANGED } from 'ui-messages';
const STORAGE_KEY = 'karma-live-reporter';

const SAVE_DEBOUNCE_MS = 1000;

const DEFAULTS = {
  browserList: {
    keepDisconnected: true
  }
};

const _settings = {};

const save = debounce(() => {
  console.info('Saving Settings');
  const settingStr = JSON.stringify(_settings);
  localStorage.setItem(STORAGE_KEY, settingStr);
}, SAVE_DEBOUNCE_MS);

function parsePath(path) {
  return (Array.isArray(path))
    ? path
    : path.split('.');
}

function getPath(args) {
  return args.reduce((p, c) => p.concat(parsePath(c)), []);
}

const reduceForSet = (p, c) => ('undefined' === typeof p[c])
  ? (p[c] = {})
  : p[c];

export function load() {
  const settingStr = localStorage.getItem(STORAGE_KEY);
  const settings = (settingStr)
    ? JSON.parse(settingStr)
    : DEFAULTS;
  Object.keys(_settings).forEach(propname => {
    delete _settings[propname];
  });
  Object.assign(_settings, settings);
  dispatcher.send(SETTINGS_CHANGED, '');
};

export function get(...args) {
  return getPath(args).reduce((p, c) => {
    return p && p[c];
  }, _settings);
};

export function set(...args) {
  const value = args.pop();
  const path = getPath(args);
  const valueName = path.pop();
  //let current = _settings;
  const current = path.reduce(reduceForSet, _settings);
  if (current[valueName] !== value) {
    current[valueName] = value;
    save();
    path.push(valueName);
    dispatcher.send(SETTINGS_CHANGED, path.join('.'), value);
  }
};

