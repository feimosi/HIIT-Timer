var backbone = require('backbone');
var _ = require('underscore');

var eventBus = _.extend({}, backbone.Events);

eventBus.on('all', function(eventName){
    console.log('EventBus >> ', Array.prototype.join.call(arguments, ' | '));
});

module.exports = eventBus;
