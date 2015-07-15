var Backbone = require('backbone');
var $ = require('jquery');
var Timer = require('./models/Timer');
var SetupTimerView = require('./views/SetupTimerView');

var timer = new Timer();
var setupTimerView = new SetupTimerView({
    model: timer
});

$(document).ready(function() {
    console.log(setupTimerView.model.toJSON());
    setupTimerView.render();
});
