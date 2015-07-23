var backbone = require('backbone');
var _ = require('underscore');

var eventBus = _.extend({}, backbone.Events);

eventBus.on('all', function(eventName){
    console.log('EventBus >> ', arguments);
});

module.exports = eventBus;
