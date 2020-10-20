(function() {


    var bios;
    var rom = require("./rom");
    var vRam;
    var exRam;
    var workingRam; 
    var ioReg;
    var highRam;
    var sprites; // not sure if needed here
    var isStartup; 
    var passedCPU= require("./CPU");
    



    function MMU(cpu,game) { // memory is byte addressable as far as I'm aware so storing by byte seems like the best option
        //could make one large array but this will be easier to debug hopefully 
        this.passedCPU=cpu;
        this.isStartup=true;
        this.bios= Uint8Array(0x0100);
        this.rom = null;//this needs to be its own class 
        this.vRam = Uint8Array(0x2000); // possibly needs to go into video
        this.exRam = Uint8Array(0x2000);
        this.workingRam = Uint8Array(0x2000);
        this.ioReg = Uint8Array(0x0080);
        this.highRam = Uint8Array(0x007F);
        this.sprites= Uint8Array(0x00A0);
    
        };
    


        MMU.prototype.loadROM = function(data) {

            //needs to be a call to load into the rom class
            //rom class will be a class that handles the Memory Banks


        };

        MMU.prototype.readAddr = function(addr) {

            //mmu decode solution was inspirired by imrannazar
            //probably slower than his but no bitmasking 
            
            switch (true) {      //since they are checked in order then you can order by what gets called more often and gain speed if needed
                case (addr<0x8000): 
                    if(isStartup)
                    {
                        return MMU.bios[addr];
                    }
                    else if (passedCPU.registers.getPC()==0x0100)    
                    {
                        isStartup=false;
                    } 
                    //trying to access cartridge rom
                    //this will be handled by rom class's mbc
                    break;
                case (addr<0xA000):
                    //vram
                    return vRam[addr-0x8000]; //this should start the address spae at 0 to access the correct area in the array
                    
                case (addr<0xC000):
                    //exRam
                    return exRam[addr-0xA000]; //this should start the address spae at 0 to access the correct area in the array
                    
                case (addr<0xE000):
                    //wram
                    return wRam[addr-0xC000]; //this should start the address spae at 0 to access the correct area in the array
                case (addr<0xFE00):
                    //shadow wram
                    //don't need to emulate
                    break;
                case (addr<0xFF00):
                    //sprites
                    return sprites[addr-0xFE00]; //this should start the address spae at 0 to access the correct area in the array
                    
                case (addr<0xFF80):
                    //io
                    return ioReg[addr-0xFF00]; //this should start the address spae at 0 to access the correct area in the array
                    
                case (addr<=0xFFFF):
                    //high ram
                    return highRam[addr-0xFF80]; //this should start the address spae at 0 to access the correct area in the array
        
            }

    };

    MMU.prototype.writeAddr = function(addr, data) {   //TODO


        switch (true) {      //since they are checked in order then you can order by what gets called more often and gain speed if needed
            case (addr<0x8000): 
                if(isStartup)
                {
                    break;
                }
                else if (passedCPU.registers.getPC()==0x0100)    
                {
                    isStartup=false;
                } 
                //trying to access cartridge rom
                //this will be handled by rom class's mbc
                break;
            case (addr<0xA000):
                //vram
                return vRam[addr-0x8000]; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<0xC000):
                //exRam
                return exRam[addr-0xA000]; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<0xE000):
                //wram
                return wRam[addr-0xC000]; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<0xFE00):
                //shadow wram
                //don't need to emulate
                break;
            case (addr<0xFF00):
                //sprites
                return sprites[addr-0xFE00]; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<0xFF80):
                //io
                return ioReg[addr-0xFF00]; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<=0xFFFF):
                //high ram
                return highRam[addr-0xFF80]; //this should start the address spae at 0 to access the correct area in the array
                break;

        }
    };


    MMU.prototype.readSixteenAddr = function(addr) { 
        var temp = 0;
        temp= this.readAddr(addr)<<8;
        temp= temp | this.readAddr(addr+1);

        return temp;

    };

    MMU.prototype.writeSixteenAddr = function(addr, data) {   
        //need to split the data
        var lo = data;
        var hi = data;
        this.writeAddr(addr+1,(lo & 0x00FF));
        hi = hi >>> 8; 
        this.writeAddr(addr,(hi & 0x00FF));
    };
  
 module.exports = MMU;
})();