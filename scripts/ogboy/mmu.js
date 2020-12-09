(function() {


    var bios;
    var rom = require("./rom");
   // var vRam;
    var exRam;
    var workingRam; 
    var ioReg;
    var highRam;
    var sprites; // not sure if needed here
    var isStartup; 
    var PPU= require("./ppu");
    



    function MMU(graphics) { // memory is byte addressable as far as I'm aware so storing by byte seems like the best option
        //could make one large array but this will be easier to debug hopefully 
       // this.isStartup=true;
        this.bios= Uint8Array(0x0100);
        this.rom = null;//this needs to be its own class 
        this.exRam = Uint8Array(0x2000);
        this.workingRam = Uint8Array(0x2000);
        this.ioReg = Uint8Array(0x0080);
        this.highRam = Uint8Array(0x007F);
        this.ppu=graphics;
    
        };
    


        MMU.prototype.loadROM = function(game) {

            //needs to be a call to load into the rom class
            //rom class will be a class that handles the Memory Banks
            this.rom = new ROM(game);

        };

        MMU.prototype.readAddr = function(addr) {

            //mmu decode solution was inspirired by imrannazar
            //probably slower than his but no bitmasking 
            
            switch (true) {      //since they are checked in order then you can order by what gets called more often and gain speed if needed
                case (addr<0x8000): 

                    //trying to access cartridge rom
                    return rom.getROM(addr);
                    //this will be handled by rom class's mbc
                    break;
                case (addr<0xA000):
                    //vram
                    return this.ppu.vRam[addr-0x8000]; //this should start the address spae at 0 to access the correct area in the array
                    
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
                    if(addr<0xFE9F){
                    return this.ppu.sprites[addr-0xFE00]; //this should start the address spae at 0 to access the correct area in the array
                    }
                    break;
                    
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

                //trying to access cartridge rom
                this.rom.writeRom(addr,data);
                //this will be handled by rom class's mbc
                break;
            case (addr<0xA000):
                //vram
                this.ppu.vRam[addr-0x8000]= data; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<0xC000):
                //exRam
                exRam[addr-0xA000] =  data; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<0xE000):
                //wram
                wRam[addr-0xC000] = data; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<0xFE00):
                //shadow wram
                //don't need to emulate
                break;
            case (addr<0xFF00):
                //sprites
                if(addr<0xFE9F){
                this.ppu.sprites[addr-0xFE00]= data; //this should start the address spae at 0 to access the correct area in the array
                }
                break;
            case (addr<0xFF80):
                //io
                ioReg[addr-0xFF00] = data; //this should start the address spae at 0 to access the correct area in the array
                break;
            case (addr<=0xFFFF):
                //high ram
                highRam[addr-0xFF80]= data; //this should start the address spae at 0 to access the correct area in the array
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