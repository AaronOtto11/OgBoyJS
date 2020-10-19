(function() {


    var bios;
    var rom;
    var vRam;
    var exRam;
    var workingRam; 
    var ioReg;
    var highRam;
    var sprites; // not sure if needed here
    var isStartup; 
    var passedCPU= require("./CPU");;
    



    function MMU(cpu,game) { // memory is byte addressable as far as I'm aware so storing by byte seems like the best option
    //could make one large array but this will be easier to debug hopefully 
        this.passedCPU=cpu;
        this.isStartup=true;
        this.bios= Uint8Array(0x0100);
        this.rom = null;//maybe a call to a read rom
        this.vRam = Uint8Array(0x2000); // possibly needs to go into video
        this.exRam = Uint8Array(0x2000);
        this.workingRam = Uint8Array(0x2000);
        this.ioReg = Uint8Array(0x0080);
        this.highRam = Uint8Array(0x007F);
        this.sprites= Uint8Array(0x00A0);
    
        }
    


    MMU.prototype.loadROM = function(data) {

    };

    MMU.prototype.decodeAddr = function(addr) {

        // switch statement then either bitmask or subtract to get the accurate place in the correct array
        if(isStartup)
        {
            return MMU.bios[addr];
        }
        else if (passedCPU.registers.getPC()==0x0100)    // bios solution was inspirired by imrannazar
        {
            isStartup=false;
        }

        //easier to read is I do a bitmask after 
        // but this requires more switch statements
        // will have to do bitmask first because of this

        


    };




    //implement the opcodes
    //question is do I make the map/switch statement here or in gameboy


    module.exports = MMU;
})();