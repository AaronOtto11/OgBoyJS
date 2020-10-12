(function() {
    var Registers = require("./registers");
    var rom = require("./ROM");


    function CPU(game) {
        this.cpu = new Registers(this);
        rom = game;
        }
    


    gameBoy.prototype.loadROM = function(data) {

    };


    module.exports = CPU;
})();