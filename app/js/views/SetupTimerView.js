var backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var eventBus = require('../EventBus');

module.exports = backbone.View.extend({
    el: '#setup-container',
    events: {
        'click .submit-button': 'submitButtonClick'
    },

    initialize: function() {
        eventBus.on('button:submit', _.bind(function() {
            this.$el.hide();
        }, this));
        eventBus.on('button:return', _.bind(function() {
            this.$el.show();
        }, this));
    },

    render: function() {
        var template = _.template($('#setup-timer-template').html());
        this.$el.html(template(this.model.toJSON()));
    },

    submitButtonClick: function(event) {
        event.preventDefault();
        eventBus.trigger('button:submit');
    }

});
