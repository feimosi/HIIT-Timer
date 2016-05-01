var backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var eventBus = require('../EventBus');

module.exports = backbone.View.extend({
    el: '#timer-container',
    events: {
        'click .start-pause-button': '_startPauseButtonHandler',
        'click .restart-button': '_restartButtonHandler',
        'click .return-button': '_returnButtonHandler'
    },

    initialize: function() {
        eventBus.on('button:return', this.hide.bind(this));
        eventBus.on('button:submit', this.show.bind(this));
        eventBus.on('timer:nextSet', this.refreshDisplayedSet.bind(this));
        eventBus.on('timer:next', this.refreshDisplayedStatus.bind(this));
        this.$el.hide();
    },

    show: function() {
        this.$el.show();
        this.refreshDisplayedTime();
        this.refreshDisplayedSet();
        this.refreshDisplayedStatus();
    },

    hide: function() {
        this.$el.hide();
    },

    render: function() {
        var template = _.template($('#timer-template').html());
        this.$el.html(template(this.model.toJSON()));
    },

    updateDisplayedTimeOnIntervals: function updateDisplayedTimeOnIntervals(_this) {
        _this.refreshDisplayedTime();
        if (_this.model.isRunning()) {
            setTimeout(function() {
                updateDisplayedTimeOnIntervals(_this);
            }, 500);
        }
    },

    refreshDisplayedTime: function() {
        this.$el.find('#timer-time').html(this._convertSecondsToString(this.model.getElapsedTime()));
        this.$el.find('#elapsed-time').html(this._convertSecondsToString(this.model.getTotalElapsedTime()));
        this.$el.find('#remaining-time').html(this._convertSecondsToString(this.model.getTotalTimeLeft()));
    },

    refreshDisplayedSet: function() {
        this.$el.find('#sets').html(this.model.getCurrentSet() + '/' + this.model.getSetsCount());
    },

    refreshDisplayedStatus: function() {
        this.$el.find('#timer-status').html(this.model.getPartAlias(this.model.getCurrentPart()));
    },

    _startPauseButtonHandler: function() {
        event.preventDefault();
        if (this.model.isRunning()) {
            eventBus.trigger('button:pause');
            this._changeButtonLabel('.start-pause-button', 'Continue');
        } else if (this.model.getCurrentPart() === '') {
            eventBus.trigger('button:start');
            this._changeButtonLabel('.start-pause-button', 'Pause');
        } else {
            eventBus.trigger('button:continue');
            this._changeButtonLabel('.start-pause-button', 'Pause');
        }
        this.updateDisplayedTimeOnIntervals(this);
    },

    _restartButtonHandler: function() {
        event.preventDefault();
        eventBus.trigger('button:restart');
        this._changeButtonLabel('.start-pause-button', 'Start');
    },

    _returnButtonHandler: function() {
        event.preventDefault();
        eventBus.trigger('button:return');
    },

    _changeButtonLabel: function(selector, label) {
        this.$el.find(selector).text(label);
    },

    _convertSecondsToString: function(seconds) {
        var minutesPart = parseInt(seconds / 60);
        var secondsPart = seconds % 60;
        return ('0' + minutesPart).slice(-2) + ':' + ('0' + secondsPart).slice(-2);
    }

});
