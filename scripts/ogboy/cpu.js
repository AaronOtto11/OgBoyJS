(function() {
    var registers = require("./registers");
    var rom = require("./ROM");
    var memory= require("./mmu");


    const reg = {
        A: 0,
        //F: 1,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        H: 5,
        L: 6
    //  SP: 0, dont believe this is needed
    //   PC: 1 dont believe this is needed either

    }
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
    CPU.prototype.step = function() {
        switch (registers.getPC) {
            case 0xCB:  //prefix timeeeeee
               
            
            
                break;


            case 0x00:
            case 0x40:
            case 0x49:
            case 0x52:
            case 0x5B:
            case 0x64:
            case 0x6D:
            case 0x7F:
            case 0xD3:
            case 0xDB:
            case 0xDD:
            case 0xE3:
            case 0xE4:
            case 0xEB:
            case 0xEC:
            case 0xED:
            case 0xF4:
            case 0xFC:
            case 0xFD:
            //these are no-op/ ld a,a...ect instructions
                //there would be a clock number here
                break;





        }

    };   



    module.exports = CPU;
})();