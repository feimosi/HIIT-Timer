var Timer = require('../app/js/models/Timer');
var should = require('chai').should();
var sinon = require('sinon');

/*jshint -W030 */

describe('Timer model', function() {

    it('should be a constructor function', function() {
        var timer = new Timer();

        Timer.should.be.a('function');
        timer.constructor.should.be.equal(Timer);
    });

});

describe('Timer after initialization', function() {

    beforeEach(function() {
        this.timer = new Timer({
            sets: 8,
            length: {
                warmup: 5,
                highIntensity: 20,
                lowIntensity: 10,
                cooldown: 5
            }
        });
    });

    it('should contain all the necessary properties', function() {
        var timer = this.timer.toJSON();

        timer.should.have.property('alias');
        timer.should.have.property('next');
        timer.should.have.property('length');
        timer.should.have.property('sets');
        timer.should.have.property('current');
        timer.should.have.property('currentSet');
        timer.should.have.property('running');
    });

    it('should be created with initial values', function() {
        this.timer.getElapsedTime().should.be.equal(0);
        this.timer.getCurrentSet().should.be.equal(1);
        this.timer.isRunning().should.be.false;
    });

    it('should be created with custom values', function() {
        this.timer.getSetsCount().should.be.equal(8);
        this.timer.getPartLength('warmup').should.be.equal(5);
        this.timer.getPartLength('highIntensity').should.be.equal(20);
        this.timer.getPartLength('lowIntensity').should.be.equal(10);
        this.timer.getPartLength('cooldown').should.be.equal(5);
    });

});

describe('Timer during usage', function() {

    beforeEach(function() {
        this.timer = new Timer({
            length: {
                warmup: 5,
                highIntensity: 20,
                lowIntensity: 10,
                cooldown: 5
            }
        });
        this.timer.clock.fastForward = function(seconds) {
            this.sinon.elapsedTime += seconds;
        };
        var returnOnlyThis = function() {
            return this;
        };

        sinon.stub(this.timer.clock, "stop", returnOnlyThis);
        sinon.stub(this.timer.clock, "pause", returnOnlyThis);
        sinon.stub(this.timer.clock, "start", function(time) {
            this.sinon = {};
            this.sinon.time = time;
            this.sinon.elapsedTime = 0;
        }.bind(this.timer.clock));
        sinon.stub(this.timer.clock, "getDuration", function() {
            return this.sinon ? this.sinon.time - this.sinon.elapsedTime : 0;
        }.bind(this.timer.clock));
    });

    it('should be reset on stop', function() {
        var setsCount = this.timer.getSetsCount();
        this.timer.stop();

        this.timer.getCurrentPartLength().should.be.equal(0);
        this.timer.getElapsedTime().should.be.equal(0);
        this.timer.getCurrentSet().should.be.equal(1);
        this.timer.isRunning().should.be.false;
        this.timer.getSetsCount().should.be.equal(setsCount);
    });

    it('should be running on start', function() {
        this.timer.start();

        this.timer.isRunning().should.be.true;
    });

    it('should not be running on pause', function() {
        this.timer.start();
        this.timer.pause();

        this.timer.isRunning().should.be.false;
    });

    it('should be running on continue', function() {
        this.timer.start();
        this.timer.pause();
        this.timer.continue();

        this.timer.isRunning().should.be.true;
    });

    it('should current and next part be correct', function() {
        this.timer.start();

        this.timer.getCurrentPart().should.be.equal('warmup');
        this.timer.getNextPart().should.be.equal('highIntensity');
    });

    it('should time pass after 1 second on start', function() {
        this.timer.start();
        this.timer.clock.fastForward(1);

        this.timer.getCurrentPartLength().should.be.equal(5);
        this.timer.getElapsedTime().should.be.equal(1);
    });

    it('should passed time be correct on pause', function() {
        this.timer.start();
        this.timer.clock.fastForward(2);
        this.timer.pause();

        this.timer.getElapsedTime().should.be.equal(2);
    });

    it('should step to the next part', function() {
        this.timer.start();
        this.timer.next();

        this.timer.getCurrentPart().should.be.equal('highIntensity');
    });

    it('should return correct time left on next part', function() {
        this.timer.start();
        this.timer.next();

        this.timer.getCurrentPart().should.be.equal('highIntensity');
        this.timer.getCurrentPartLength().should.be.equal(20);
        this.timer.getTimeLeft().should.be.equal(this.timer.getPartLength('highIntensity'));
    });

});
