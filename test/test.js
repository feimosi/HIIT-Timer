var Timer = require('../app/js/models/Timer');
var should = require('chai').should();

/*jshint -W030 */

describe('Timer model', function() {

    beforeEach(function() {
        this.timer = new Timer();
    });

    it('should be a constructor function', function() {
        Timer.should.be.a('function');
        this.timer.constructor.should.be.equal(Timer);
    });

});

describe('Timer after initialization', function() {

    beforeEach(function() {
        this.timer = new Timer();
    });

    it('should contain all the necessary properties', function() {
        var timer = this.timer.toJSON();
        timer.should.have.property('alias');
        timer.should.have.property('next');
        timer.should.have.property('length');
        timer.should.have.property('sets');
        timer.should.have.property('current');
        timer.should.have.property('currentTime');
        timer.should.have.property('currentSet');
        timer.should.have.property('running');
    });

    it('should be created with initial values', function() {
        this.timer.getCurrentTime().should.be.equal(0);
        this.timer.getCurrentSet().should.be.equal(1);
        this.timer.isRunning().should.be.false;
    });

    it('should be created with custom sets count', function() {
        this.timer = new Timer({
            sets: 5
        });
        this.timer.getSetsCount().should.be.equal(5);
    });

});

describe('Timer during usage', function() {

    beforeEach(function() {
        this.timer = new Timer();
    });

    it('should be reset on stop', function() {
        var setsCount = this.timer.getSetsCount();
        this.timer.stop();
        this.timer.getCurrentTime().should.be.equal(0);
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

    it('should time pass after 1 second on start', function(done) {
        var timer = this.timer;
        timer.start();
        setTimeout(function() {
            timer.getCurrentTime().should.be.greaterThan(0);
            done();
        }, 1000);
    });

    it('should step to the next part', function() {
        this.timer.next();
        this.timer.getCurrentPart().should.be.equal('highIntensity');
    });

    it('should return correct time left on next part', function() {
        this.timer.next();
        this.timer.getTimeLeft().should.be.equal(this.timer.getPartLength('highIntensity'));
    });

});
