const $ = require('jquery');
const Template = require('Template');
//const io = require('socket.io-client');

const templates = {};

//==============================================================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('LOADED');

  const page = {
    title: 'Foo Title',
    renderResults: function() {
      return [templates['result'].render({
        title: "Result 1",
        body: "Body 1",
        status: "success"
      }), templates['result'].render({
        title: "Result 2",
        body: "Body 2",
        status: "danger"
      })];
    }
  };

  templates['page'] = new Template($('div[data-template-id="page"]').get(0));
  templates['result'] = new Template($('div[data-template-id="result"]').get(0));

  $('#app').get(0).appendChild(templates['page'].render(page));
}, false);
