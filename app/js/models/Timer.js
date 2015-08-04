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
        running: false,
        totalElapsedTime: 0
    },

    initialize: function() {
        this.clock = new TimerJS({
            onend: this.next.bind(this)
        });
        eventBus.on('button:start', this.start, this);
        eventBus.on('button:pause', this.pause, this);
        eventBus.on('button:continue', this.continue, this);
        eventBus.on('button:restart', this.restart, this);
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
        return this.getCurrentPartLength() - this._getClockDuration();
    },

    getTotalElapsedTime: function() {
        return this.get('totalElapsedTime') + this.getElapsedTime();
    },

    getCurrentSet: function() {
        return this.get('currentSet');
    },

    isRunning: function() {
        return this.get('running');
    },

    getTimeLeft: function() {
        return this._getClockDuration();
    },

    start: function() {
        if (this.get('current') === '') {
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

    restart: function() {
        this.stop();
        this.start();
        eventBus.trigger('timer:restart');
    },

    next: function() {
        this.incrementSetIfApplicable();
        this.set('totalElapsedTime', this.get('totalElapsedTime') + this.getCurrentPartLength());
        this.set('current', this.getNextPart());
        this.set('running', true);
        this.clock.stop().start(this.getCurrentPartLength());
        if (this.getCurrentSet() > this.getSetsCount()) {
            this.stop();
            eventBus.trigger('timer:end');
        } else if (this.getCurrentPartLength() === 0) {
            this.next();
            return;
        } else {
            eventBus.trigger('timer:next', this.getCurrentPart());
        }
    },

    incrementSetIfApplicable: function() {
        if (this.getCurrentPart() === 'cooldown') {
            this.set('currentSet', this.getCurrentSet() + 1);
            eventBus.trigger('timer:nextSet', this.getCurrentSet() + '/' + this.getSetsCount());
        }
    },

    _getClockDuration: function() {
        return parseInt(this.clock.getDuration() / 1000);
    }

});
