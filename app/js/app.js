var Backbone = require('backbone');
var $ = require('jquery');
var Timer = require('./models/timer');

var timer = new Timer();

console.log(timer.toJSON());
