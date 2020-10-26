(function() {
    var registers = require("./registers");
    var rom = require("./ROM");
    var memory= require("./mmu");



    function CPU() {
        this.registers = new Registers();
        this.memory = new MMU(this,game);

        }
    


    CPU.prototype.loadROM = function(data) {

        // send this down to MMU
        this.memory.loadROM(data);

    };

    //implement the opcodes
    //question is do I make the map/switch statement here or in gameboy


    module.exports = CPU;
})();