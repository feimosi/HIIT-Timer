var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({
    el: '#setup-container',

    initilize: function() {

    },
    render: function() {
        var template = _.template($('#setup-timer-template').html());
        this.$el.html(template(this.model.toJSON()));
    }
});
