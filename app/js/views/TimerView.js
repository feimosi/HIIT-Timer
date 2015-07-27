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
        eventBus.on('button:return', this.hide.bind(this));
        eventBus.on('button:submit', this.show.bind(this));
        this.$el.hide();
    },
    show: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.hide();
    },
    render: function() {
        var template = _.template($('#timer-template').html());
        this.$el.html(template(this.model.toJSON()));
    },
    startPauseButtonClick: function() {
        event.preventDefault();
        if(this.model.isRunning()) {
            eventBus.trigger('button:pause');
        } else if(this.model.getCurrentPart() === ''){
            eventBus.trigger('button:start');
            this.refreshDisplayedTime(this);
        } else {
            eventBus.trigger('button:continue');
        }
    },
    restartButtonClick: function() {
        event.preventDefault();
        eventBus.trigger('button:restart');
    },
    returnButtonClick: function() {
        event.preventDefault();
        eventBus.trigger('button:return');
    },
    refreshDisplayedTime: function(_this) {
        // TODO: Refresh remaining time too
        _this.$el.find('#timer-time').html(_this.convertSecondsToString(_this.model.getElapsedTime()));
        _this.$el.find('#elapsed-time').html(_this.convertSecondsToString(_this.model.getTotalElapsedTime()));
        if(_this.model.isRunning()) {
            setTimeout(function() {
                _this.refreshDisplayedTime(_this);
            }, 100);
        }
    },
    convertSecondsToString: function(seconds) {
        var minutesPart = parseInt(seconds / 60);
        var secondsPart = seconds % 60;
        return ('0' + minutesPart).slice(-2) + ':' + ('0' + secondsPart).slice(-2);
    }
});
