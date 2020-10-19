(function() {
    var registers = require("./registers");
    var rom = require("./ROM");
    var memory= require("./mmu");



    function CPU(game) {
        this.registers = new Registers();
        this.rom = game; // might not have to do this
        this.memory = new MMU(this,game);

        }
    


    CPU.prototype.loadROM = function(data) {

        // send this down to MMU

    };

    //implement the opcodes
    //question is do I make the map/switch statement here or in gameboy


    module.exports = CPU;
})();