import dispatcher from 'Dispatcher';
import { get } from 'LocalSettings';
import { BROWSERS_CHANGE } from 'messages';
import { BROWSERLIST_CHANGED, SETTINGS_CHANGED } from 'ui-messages';

const KEEP_DISCONNECTED = 'browserList.keepDisconnected';
const _browserMap = new Map();
let _browserArray = [];

function removeDisconnected() {
  for (let browser of _browserMap.values()) {
    if (!browser.connected) {
      _browserMap.delete(browser.id);
    }
  }
}

const isConnected = browser => browser.connected;
const isNotConnected = browser => !browser.connected;

function sendChanged() {
  dispatcher.send(BROWSERLIST_CHANGED, _browserArray);
}

function updateArray() {
  const values = Array.from(_browserMap.values());
  _browserArray = values
    .filter(isConnected)
    .concat(values.filter(isNotConnected));
}

function onBrowserChange(browsers) {
  // mark all existing as invalid
  for (let browser of _browserMap.values()) {
    browser.connected = false;
  }

  // add all existing browsers
  browsers.forEach(browser => {
    browser.connected = true;
    _browserMap.set(browser.id, browser);
  });

  // remove disconnected, if specified
  if (!get(KEEP_DISCONNECTED)) {
    removeDisconnected();
  }
  updateArray();
  sendChanged();
}

function onSettingsChanged(path, value) {
  if (KEEP_DISCONNECTED === path && !value) {
    removeDisconnected();
    updateArray();
    sendChanged();
  }
}

dispatcher.on(BROWSERS_CHANGE, onBrowserChange);
dispatcher.on(SETTINGS_CHANGED, onSettingsChanged);
