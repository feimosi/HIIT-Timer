var backbone = require('backbone');
var TimerJS = require('timer.js');
var eventBus = require('../EventBus.js');

module.exports = backbone.Model.extend({
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
            onend: this.next.bind(this)
        });
        eventBus.on('button:start', this.start, this);
        eventBus.on('button:pause', this.pause, this);
        eventBus.on('button:return', this.stop, this);
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
        eventBus.trigger('timer:start');
    },

    pause: function() {
        this.clock.pause();
        this.set('running', false);
        eventBus.trigger('timer:pause');
    },

    continue: function() {
        this.clock.start();
        this.set('running', true);
        eventBus.trigger('timer:continue');
    },

    stop: function() {
        this.clock.stop();
        this.set('current', '');
        this.set('currentSet', 1);
        this.set('running', false);
        eventBus.trigger('timer:stop');
    },

    next: function() {
        this.set('current', this.getNextPart());
        this.set('running', true);
        this.clock.stop().start(this.getCurrentPartLength());
        eventBus.trigger('timer:next', this.getCurrentPartLength());
    }
});
