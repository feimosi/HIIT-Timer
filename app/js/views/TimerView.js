var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({
    el: '#timer-container',

    render: function() {
        var template = _.template($('#timer-template').html());
        this.$el.html(template(this.model.toJSON()));
    }
});
