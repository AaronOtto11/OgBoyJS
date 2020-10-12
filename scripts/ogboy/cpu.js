(function() {
    var Registers = require("./registers");
    var rom = require("./ROM");


    function CPU(game) {
        this.cpu = new Registers(this);
        this.rom = game; // might not have to do this

        }
    


    CPU.prototype.loadROM = function(data) {

    };

    //implement the opcodes
    //question is do I make the map/switch statement here or in gameboy


    module.exports = CPU;
})();