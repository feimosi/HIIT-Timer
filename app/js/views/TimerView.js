var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var EventBus = require('../EventBus');

module.exports = Backbone.View.extend({
    el: '#timer-container',

    render: function() {
        var template = _.template($('#timer-template').html());
        this.$el.html(template(this.model.toJSON()));
    }
});
