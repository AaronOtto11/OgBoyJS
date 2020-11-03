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


    CPU.prototype.isHalfCarry= function(num1,num2){

       if ((((num1 & 0xf) + (num2 & 0xf)) & 0x10) == 0x10)
       {
            this.registers.setHalfCarryFlag(1);
            return true;

       }
       this.registers.setHalfCarryFlag(0);
       return false;


    };

    CPU.prototype.isEightCarryAdd= function(num1,num2){

        if (((num1 + num2) >255)
        {
             this.registers.CarryFlag(1);
             return true;
 
        }
        this.registers.setCarryFlag(0);
        return false;
 
 
     };

     CPU.prototype.isSixteenCarryAdd= function(num1,num2){

        if (((num1 + num2) >65535))
        {
             this.registers.CarryFlag(1);
             return true;
 
        }
        this.registers.setCarryFlag(0);
        return false;
 
 
     };

     CPU.prototype.isEightCarrySub= function(num1,num2){

        if (((num1 + num2) <0)
        {
             this.registers.CarryFlag(1);
             return true;
 
        }
        this.registers.setCarryFlag(0);
        return false;
 
 
     };

     CPU.prototype.isSixteenCarrySub= function(num1,num2){

        if (((num1 + num2) <0))
        {
             this.registers.CarryFlag(1);
             return true;
 
        }
        this.registers.setCarryFlag(0);
        return false;
 
 
     };

    CPU.prototype.eightAdd= function(num1,num2){
        var retNum = 0
        this.isHalfCarry(num1,num2);
        if(this.isEightCarryAdd(num1+num2))
        {
            retNum = num1+num2;
        }
        else
        {
           // this.registers.writeReg(reg.B,this.registers.getReg(reg.B)-255);  //if overflow happens makes sure it becomes 0
           retNum = (num1+num2)&0x0FF; // if this doesn't work then use the other commented out line
           //have to do this because no set data type in JS
          //  this.registers.setCarryFlag(1); carry flag not set on inc
        }
        if (retNum==0)
        {
            this.registers.setZeroFlag(1);
        }
        this.registers.setNegativeFlag(0);
        return retNum;
 
 
     };

     CPU.prototype.sixteenAdd= function(num1,num2){


        this.isHalfCarry(num1,num2);
        var retNum=0;
        if(this.isSixteenCarryAdd(num1,num2))
        {
           retNum= (num1+num2)&0x0FFFF;
        }
        else
        {
        
            retNum=num1+num2;

        }
        this.registers.setNegativeFlag(0);
        return retNum;
 
     };



    //implement the opcodes
    //question is do I make the map/switch statement here or in gameboy
    CPU.prototype.step = function() {
        switch (rom.getRom(registers.getPC())) {
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


            case 0x01: //load 16 to BC reg
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.writeSixteenReg(reg.B,immediate); 
                this.registers.advancePC(3); //3 bytes
                return 12; //how many cycles this took
            
            case 0x02: //load to memory address in BC, reg A
                this.memory.writeAddr(this.registers.readSixteenReg(reg.B),this.registers.getReg(reg.A));  
                this.registers.advancePC(1); //1 byte
                return 8; //how many cycles this took 

            case 0x03: //inc BC
                this.memory.writeSixteenReg(reg.B,this.registers.readSixteenReg(reg.B)+1);
                this.registers.advancePC(1);
                return 8;

            case 0x04: //inc B
                this.isHalfCarry(this.registers.getReg(reg.B),1);
                if(this.registers.getReg(reg.B)+1<255)
                {
                    this.registers.writeReg(reg.B,this.registers.getReg(reg.B)+1);
                }
                else
                {
                   // this.registers.writeReg(reg.B,this.registers.getReg(reg.B)-255);  //if overflow happens makes sure it becomes 0
                   this.registers.writeReg(reg.B,this.registers.getReg(reg.B)&0x0FF); // if this doesn't work then use the other commented out line
                   //have to do this because no set data type in JS
                  //  this.registers.setCarryFlag(1); carry flag not set on inc
                }
                if (this.registers.getReg(reg.B)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                this.registers.setNegativeFlag(0);
                this.registers.advancePC(1);
                return 4;

            case 0x05: //dec B
                this.registers.writeReg(reg.B,this.registers.getReg(reg.B)-1);
                if (this.registers.getReg(reg.B)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                this.registers.setNegativeFlag(1);                
                this.registers.advancePC(1);
                return 4;  
            
            case 0x06: //ld B, immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.B,immediate);
                this.registers.advancePC(2);
                return 8;
            
            case 0x07: // roll a
                //0x80
                if(this.registers.getReg(reg.A)&0x80)
                {
                    this.registers.setCarryFlag(1);
                    this.registers.writeReg(reg.B,((this.registers.getReg(reg.B)<<1)&0x0FF));
                    this.registers.advancePC(1);
                    return 4;

                }
                this.registers.setCarryFlag(0);
                this.registers.writeReg(reg.B,this.registers.getReg(reg.B)<<1);
                this.registers.advancePC(1);
                return 4;
            
            case 0x08: //load the stack pointer into memory 
                var immediate = this.rom.getSixteenRom(this.registers.getPC()+1);
                this.memory.writeSixteenAddr(immediate, this.registers.getStackPointer());
                this.registers.advancePC(3);
                return 20;



            // add HL, n 
            case 0x09: 
                
                var num2= this.readSixteenReg(reg.B);           
                var temp= this.sixteenAdd(reg.H,num2);
                this.registers.writeSixteenReg(reg.H,temp);
                this.registers.advancePC(1);
                return 8;

            case 0x19:
                var num2= this.readSixteenReg(reg.D);           
                var temp= this.sixteenAdd(reg.H,num2);
                this.registers.writeSixteenReg(reg.H,temp);
                this.registers.advancePC(1);
                return 8;
            case 0x29:
                var num2= this.readSixteenReg(reg.H);           
                var temp= this.sixteenAdd(reg.H,num2);
                this.registers.writeSixteenReg(reg.H,temp);
                this.registers.advancePC(1);
                return 8;
            case 0x39:
                var num2= this.getStackPointer();           
                var temp= this.sixteenAdd(reg.H,num2);
                this.registers.writeSixteenReg(reg.H,temp);
                this.registers.advancePC(1);
                return 8;











        }

    };   



    module.exports = CPU;
})();