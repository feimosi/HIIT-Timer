var should = require('should');
var Timer = require('../app/js/models/Timer');

describe("Application", function() {

    it("Timer should be a constructor function", function () {
        Timer.should.be.type(typeof Function);
    });
    it("Timer object should contain all the defaults", function () {
        var timer = new Timer().toJSON();
        should(timer).have.property('length');
        should(timer).have.property('sets');
        should(timer).have.property('current');
        should(timer).have.property('currentSet');
        should(timer).have.property('currentTime');
    });

});
