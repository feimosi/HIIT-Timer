var Backbone = require('backbone');
var $ = require('jquery');
var EventBus = require('./EventBus');
var Timer = require('./models/Timer');
var SetupTimerView = require('./views/SetupTimerView');
var TimerView = require('./views/TimerView');

var timer = new Timer();
var setupTimerView = new SetupTimerView({
    model: timer
});
var timerView = new TimerView({
    model: timer
});

$(document).ready(function() {
    console.log(setupTimerView.model.toJSON());
    setupTimerView.render();
    timerView.render();
});
