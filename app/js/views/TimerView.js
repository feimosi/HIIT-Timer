var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var EventBus = require('../EventBus');

module.exports = Backbone.View.extend({
    el: '#timer-container',
    events: {
        'click .start-pause-button': 'startPauseButtonClick',
        'click .restart-button': 'restartButtonClick',
        'click .return-button': 'returnButtonClick'
    },

    initialize: function() {
        EventBus.on('timer:return', _.bind(function() {
            this.$el.hide();
        }, this));
        EventBus.on('timer:submit', _.bind(function() {
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
            EventBus.trigger('timer:pause');
        else {
            EventBus.trigger('timer:start');
        }
    },
    restartButtonClick: function() {
        event.preventDefault();
        EventBus.trigger('timer:restart');
    },
    returnButtonClick: function() {
        event.preventDefault();
        EventBus.trigger('timer:return');
    }
});
