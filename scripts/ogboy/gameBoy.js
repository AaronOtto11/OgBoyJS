(function() {
    var CPU = require("./cpu");
    var ROM = require("./ROM");


    function gameBoy() {
        //start code based of Alex Dickerson's NES project to provide a good starting point while learning javaScript
        this.cpu = new CPU();
        }
    


    gameBoy.prototype.loadROM = function(data) {
        this.cpu.loadROM(data);
        this.reset();
    };

    gameBoy.prototype.step = function() {
        this.cpu.step();
    };

    gameBoy.prototype.reset = function() {
        this.cpu.reset();
    };

    module.exports = gameBoy;
})();