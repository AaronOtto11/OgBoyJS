(function() {
    var CPU = require("./cpu");
    var ROM = require("./ROM");


    function gameBoy() {
        //start code based of Alex Dickerson's NES project to provide a good starting point while learning javaScript
        this.cpu = new CPU(this);
        this.rom = null;
        }
    


    gameBoy.prototype.loadROM = function(data) {
        this.ROM = new ROM(this);
        this.ROM.load(data);
        this.reset();
    };

    gameBoy.prototype.runOneCycle = function() {
        this.cpu.runOneCycle();
    };

    gameBoy.prototype.reset = function() {
        this.cpu.reset();
    };

    module.exports = gameBoy;
})();