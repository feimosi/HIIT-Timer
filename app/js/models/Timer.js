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
            '': 'warmup',
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
        current: '',
        currentSet: 1,
        running: false
    },

    initialize: function() {
        this.clock = new TimerJS({
            onend: this.next
        });
    },

    getNextPart: function() {
        return this.get('next')[this.get('current')];
    },

    getPartLength: function(partName) {
        return this.get('length')[partName];
    },

    getCurrentPartLength: function() {
        return this.get('current') ? this.getPartLength(this.get('current')) : 0;
    },

    getSetsCount: function() {
        return this.get('sets');
    },

    getCurrentPart: function() {
        return this.get('current');
    },

    getElapsedTime: function() {
        return this.getCurrentPartLength() - this.clock.getDuration();
    },

    getCurrentSet: function() {
        return this.get('currentSet');
    },

    isRunning: function() {
        return this.get('running');
    },

    getTimeLeft: function() {
        return this.clock.getDuration();
    },

    start: function() {
        if(this.get('current') === '') {
            this.next();
        } else {
            this.clock.start(this.getCurrentPartLength());
            this.set('running', true);
        }
    },

    pause: function() {
        this.clock.pause();
        this.set('running', false);
    },

    continue: function() {
        this.clock.start();
        this.set('running', true);
    },

    stop: function() {
        this.clock.stop();
        this.set('current', '');
        this.set('currentSet', 1);
        this.set('running', false);
    },

    next: function() {
        this.set('current', this.getNextPart());
        this.set('running', true);
        this.clock.stop().start(this.getCurrentPartLength());
    }
});
