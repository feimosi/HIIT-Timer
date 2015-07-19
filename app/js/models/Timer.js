var Backbone = require('backbone');
var TimerJS = require('timer.js');

module.exports = Backbone.Model.extend({
    defaults: {
        alias: {
            warmup: 'Warmup',
            highIntensity: 'High Intensity',
            lowIntensity: 'Low Intensity',
            cooldown: 'Cooldown'
        },
        next: {
            warmup: 'highIntensity',
            highIntensity: 'lowIntensity',
            lowIntensity: 'cooldown',
            cooldown: 'warmup'
        },
        length: {
            warmup: 5,
            highIntensity: 20,
            lowIntensity: 10,
            cooldown: 5
        },
        sets: 10,
        current: 'warmup',
        currentTime: 0,
        currentSet: 1,
        running: false
    },

    initialize: function() {
        this.timer = new TimerJS();
    },

    getNextPart: function() {
        return this.get('next')[this.get('current')];
    },

    getPartLength: function(partName) {
        return this.get('length')[partName];
    },

    getCurrentPartLength: function() {
        return this.getPartLength(this.get('current'));
    },

    getSetsCount: function() {
        return this.get('sets');
    },

    getCurrentPart: function() {
        return this.get('current');
    },

    getCurrentTime: function() {
        if (this.isRunning())
            this.set('currentTime', this.getCurrentPartLength() - this.timer.getDuration());
        return this.get('currentTime');
    },

    getCurrentSet: function() {
        return this.get('currentSet');
    },

    isRunning: function() {
        return this.get('running');
    },

    getTimeLeft: function() {
        return this.getCurrentPartLength() - this.getCurrentTime();
    },

    start: function() {
        this.timer.start(this.getCurrentPartLength());
        this.set('running', true);
    },

    pause: function() {
        this.timer.pause();
        this.set('running', false);
    },

    continue: function() {
        this.timer.start();
        this.set('running', true);
    },

    stop: function() {
        this.timer.stop();
        this.set('currentTime', 0);
        this.set('currentSet', 1);
        this.set('running', false);
    },

    next: function() {
        this.set('current', this.getNextPart());
        this.timer.stop().start(this.getCurrentPartLength());
    }
});
