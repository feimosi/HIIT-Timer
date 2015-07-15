var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        length: {
            warmup: 0,
            highIntensity: 20,
            lowIntensity: 10,
            cooldown: 0
        },
        sets: 10
    }
});
