var backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var eventBus = require('../EventBus');

module.exports = backbone.View.extend({
    el: '#timer-container',
    events: {
        'click .start-pause-button': 'startPauseButtonClick',
        'click .restart-button': 'restartButtonClick',
        'click .return-button': 'returnButtonClick'
    },

    initialize: function() {
        eventBus.on('button:return', _.bind(function() {
            this.$el.hide();
        }, this));
        eventBus.on('button:submit', _.bind(function() {
            this.$el.show();
        }, this));
    },
    render: function() {
        var template = _.template($('#timer-template').html());
        this.$el.hide().html(template(this.model.toJSON()));
    },
    startPauseButtonClick: function() {
        event.preventDefault();
        if(this.model.isRunning())
            eventBus.trigger('button:pause');
        else {
            eventBus.trigger('button:start');
        }
    },
    restartButtonClick: function() {
        event.preventDefault();
        eventBus.trigger('button:restart');
    },
    returnButtonClick: function() {
        event.preventDefault();
        eventBus.trigger('button:return');
    }
});
