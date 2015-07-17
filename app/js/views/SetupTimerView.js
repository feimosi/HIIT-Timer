var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var EventBus = require('../EventBus');

module.exports = Backbone.View.extend({
    el: '#setup-container',
    events: {
        'click .submit-button': 'submitButtonClick'
    },

    initialize: function() {
        EventBus.on('timer:submit', _.bind(function() {
            this.$el.hide();
        }, this));
        EventBus.on('timer:return', _.bind(function() {
            this.$el.show();
        }, this));
    },
    render: function() {
        var template = _.template($('#setup-timer-template').html());
        this.$el.html(template(this.model.toJSON()));
    },
    submitButtonClick: function(event) {
        event.preventDefault();
        EventBus.trigger('timer:submit');
    }
});
