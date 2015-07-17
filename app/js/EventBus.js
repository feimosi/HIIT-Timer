var Backbone = require('backbone');
var _ = require('underscore');

var EventBus = _.extend({}, Backbone.Events);

EventBus.on('all', function(eventName){
    console.log('>> EventBus >> ' + eventName);
});

module.exports = EventBus;
