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

        if ((num1 + num2)>255)
        {
             this.registers.CarryFlag(1);
             return true;
 
        }
        this.registers.setCarryFlag(0);
        return false;
 
 
     };

     CPU.prototype.isSixteenCarryAdd= function(num1,num2){

        if ((num1 + num2)>65535)
        {
             this.registers.CarryFlag(1);
             return true;
 
        }
        this.registers.setCarryFlag(0);
        return false;
 
 
     };

     CPU.prototype.isEightCarrySub= function(num1,num2){

        if ((num1 + num2)<0)
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
           retNum=(num1+num2)&0x0FFFF;
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
                this.registers.advancePC(1);
                return 4
            /*
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

                break;

                    */




           // 16 bit immediate load 
            case 0x01: //bc
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.writeSixteenReg(reg.B,immediate); 
                this.registers.advancePC(3); //3 bytes
                return 12; //how many cycles this took

            case 0x11: //DE
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.writeSixteenReg(reg.D,immediate); 
                this.registers.advancePC(3); //3 bytes
                return 12; //how many cycles this took

            case 0x21: //HL
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.writeSixteenReg(reg.H,immediate); 
                this.registers.advancePC(3); //3 bytes
                return 12; //how many cycles this took

            case 0x31: //SP
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.setStackPointer(immediate); 
                this.registers.advancePC(3); //3 bytes
                return 12; //how many cycles this took




            //load to memory address



            //A reg
            case 0x02:  //BC
                this.memory.writeAddr(this.registers.readSixteenReg(reg.B),this.registers.getReg(reg.A));  
                this.registers.advancePC(1); //1 byte
                return 8; //how many cycles this took 

            case 0x12: //DE
                this.memory.writeAddr(this.registers.readSixteenReg(reg.D),this.registers.getReg(reg.A));  
                this.registers.advancePC(1); //1 byte
                return 8; //how many cycles this took 

            case 0x22: //HL+
                this.memory.writeAddr(this.registers.readSixteenReg(reg.H)+1,this.registers.getReg(reg.A));  
                this.registers.advancePC(1); //1 byte
                return 8; //how many cycles this took
                
                
            case 0x32: //HL-
                this.memory.writeAddr(this.registers.readSixteenReg(reg.H)-1,this.registers.getReg(reg.A));  
                this.registers.advancePC(1); //1 byte
                return 8; //how many cycles this took 

            case 0x77: //HL
                this.memory.writeAddr(this.registers.readSixteenReg(reg.H)-1,this.registers.getReg(reg.A));  
                this.registers.advancePC(1); //1 byte
                return 8; //how many cycles this took 




            
            //inc 16
            case 0x03: //inc BC
                this.registers.writeSixteenReg(reg.B,this.registers.readSixteenReg(reg.B)+1);
                this.registers.advancePC(1);
                return 8;

            case 0x13: //inc DE
                this.registers.writeSixteenReg(reg.D,this.registers.readSixteenReg(reg.D)+1);
                this.registers.advancePC(1);
                return 8;

            case 0x23: //inc HL
                this.registers.writeSixteenReg(reg.H,this.registers.readSixteenReg(reg.H)+1);
                this.registers.advancePC(1);
                return 8;

            case 0x33: //inc SP
                this.registers.setStackPointer(reg.B,this.registers.getStackPointer()+1);
                this.registers.advancePC(1);
                return 8;


            // 8 bit incs

            case 0x04: //inc B
                this.isHalfCarry(this.registers.getReg(reg.B),1);
                if(this.registers.getReg(reg.B)+1<255) // might not need this
                {
                    this.registers.writeReg(reg.B,this.registers.getReg(reg.B)+1); 

                }
                else
                {
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

            case 0x14: //inc D
                this.isHalfCarry(this.registers.getReg(reg.D),1);
                if(this.registers.getReg(reg.D)+1<255) // might not need this
                {
                    this.registers.writeReg(reg.D,this.registers.getReg(reg.D)+1); 

                }
                else
                {
                this.registers.writeReg(reg.D,this.registers.getReg(reg.D)&0x0FF); // if this doesn't work then use the other commented out line
                //have to do this because no set data type in JS
                //  this.registers.setCarryFlag(1); carry flag not set on inc
                }
                if (this.registers.getReg(reg.D)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                this.registers.setNegativeFlag(0);
                this.registers.advancePC(1);
                return 4;

            case 0x24: //inc H
                this.isHalfCarry(this.registers.getReg(reg.H),1);
                if(this.registers.getReg(reg.H)+1<255) // might not need this
                {
                    this.registers.writeReg(reg.H,this.registers.getReg(reg.H)+1); 

                }
                else
                {
                this.registers.writeReg(reg.H,this.registers.getReg(reg.H)&0x0FF); // if this doesn't work then use the other commented out line
                //have to do this because no set data type in JS
                //  this.registers.setCarryFlag(1); carry flag not set on inc
                }
                if (this.registers.getReg(reg.H)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                this.registers.setNegativeFlag(0);
                this.registers.advancePC(1);
                return 4;

            case 0x34: //inc reference HL
                var addr=this.registers.readSixteenReg(reg.H);
                var reference=this.memory.readAddr(addr);
                this.isHalfCarry(reference,1);
                if(reference+1<255) // might not need this
                {
                    this.memory.writeAddr(addr,reference+1); 

                }
                else
                {
                    this.memory.writeAddr(addr,((reference+1)&0x0FF)); // if this doesn't work then use the other commented out line
                    //have to do this because no set data type in JS
                    //  this.registers.setCarryFlag(1); carry flag not set on inc
                }
                if (this.memory.readAddr(addr)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                this.registers.setNegativeFlag(0);
                this.registers.advancePC(1);
                return 12;




            //8 bit dec

                

            case 0x05: //dec B
            this.isHalfCarry(this.registers.getReg(reg.B),-1);
            if(this.registers.getReg(reg.B)-1<255) // might not need this
            {
                this.registers.writeReg(reg.B,this.registers.getReg(reg.B)-1); 

            }
            else
            {
                this.registers.writeReg(reg.B,this.registers.getReg(reg.B)&0x0FF); // if this doesn't work then use the other commented out line
                //have to do this because no set data type in JS
                //  this.registers.setCarryFlag(1); carry flag not set on inc
            }
            if (this.registers.getReg(reg.B)==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.setNegativeFlag(1);
            this.registers.advancePC(1);
            return 4;

        case 0x15: //inc D
            this.isHalfCarry(this.registers.getReg(reg.D),-1);
            if(this.registers.getReg(reg.D)+1<255) // might not need this
            {
                this.registers.writeReg(reg.D,this.registers.getReg(reg.D)-1); 

            }
            else
            {
            this.registers.writeReg(reg.D,this.registers.getReg(reg.D)&0x0FF); // if this doesn't work then use the other commented out line
            //have to do this because no set data type in JS
            //  this.registers.setCarryFlag(1); carry flag not set on inc
            }
            if (this.registers.getReg(reg.D)==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.setNegativeFlag(1);
            this.registers.advancePC(1);
            return 4;

        case 0x25: //inc H
            this.isHalfCarry(this.registers.getReg(reg.H),-1);
            if(this.registers.getReg(reg.H)-1<255) // might not need this
            {
                this.registers.writeReg(reg.H,this.registers.getReg(reg.H)-1); 

            }
            else
            {
            this.registers.writeReg(reg.H,this.registers.getReg(reg.H)&0x0FF); // if this doesn't work then use the other commented out line
            //have to do this because no set data type in JS
            //  this.registers.setCarryFlag(1); carry flag not set on inc
            }
            if (this.registers.getReg(reg.H)==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.setNegativeFlag(1);
            this.registers.advancePC(1);
            return 4;

        case 0x35: //inc reference HL
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.isHalfCarry(reference,-1);
            if(reference+1<255) // might not need this
            {
                this.memory.writeAddr(addr,reference+1); 

            }
            else
            {
                this.memory.writeAddr(addr,((reference-1)&0x0FF)); // if this doesn't work then use the other commented out line
                //have to do this because no set data type in JS
                //  this.registers.setCarryFlag(1); carry flag not set on inc
            }
            if (this.memory.readAddr(addr)==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.setNegativeFlag(1);
            this.registers.advancePC(1);
            return 12;
            

            //ld immediate 8 

            case 0x06: //ld B
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.B,immediate);
                this.registers.advancePC(2);
                return 8;

            case 0x16: //ld D, immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.D,immediate);
                this.registers.advancePC(2);
                return 8;


            case 0x26: //ld H, immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.H,immediate);
                this.registers.advancePC(2);
                return 8;

            case 0x36: //reference (HL)
                var addr=this.registers.readSixteenReg(reg.H);
                var reference=this.memory.readAddr(addr);
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.B,immediate);
                this.registers.advancePC(2);
                return 12;






            
            
            case 0x07: //rlca
                //0x80
                this.registers.setCarryFlag(0);
                this.registers.setNegativeFlag(0);
                this.registers.setHalfCarryFlag(0);
                if(this.registers.getReg(reg.A)&0x80==80)
                {
                    this.registers.setCarryFlag(1);
                    this.registers.writeReg(reg.B,((this.registers.getReg(reg.B)<<1)&0x0FF)|0x01);
                    this.registers.advancePC(1);
                    return 4;

                }
                this.registers.writeReg(reg.A,this.registers.getReg(reg.B)<<1);
                this.registers.setCarryFlag(0);
                this.registers.advancePC(1);
                return 4;


            case 0x17: // rla
                //0x80
                if(this.registers.getReg(reg.A)&0x80==0x80)
                {
                    this.registers.setCarryFlag(1);
                    if(this.registers.getCarryFlag()==1)
                    {
                        this.registers.writeReg(reg.A,((this.registers.getReg(reg.B)<<1)&0x0FF)|0x01);
                        this.registers.advancePC(1);
                        return 4;
                    }
                    this.registers.writeReg(reg.A,((this.registers.getReg(reg.B)<<1)&0x0FF));
                    this.registers.advancePC(1);
                    return 4;

                }
                this.registers.setCarryFlag(0);
                if(this.registers.getCarryFlag()==1)
                {
                    this.registers.writeReg(reg.A,((this.registers.getReg(reg.B)<<1)&0x0FF)|0x01);
                    this.registers.advancePC(1);
                    return 4;
                }
                this.registers.writeReg(reg.A,this.registers.getReg(reg.B)<<1);
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



            // ref to 8-bit reg A

                
            case 0x0A: //bc
                var addr=this.registers.readSixteenReg(reg.B);
                var reference=this.memory.readAddr(addr);
                this.registers.writeReg(reg.A,reference);
                this.registers.advancePC(1);
                return 8;


            case 0x1A: //de
                var addr=this.registers.readSixteenReg(reg.D);
                var reference=this.memory.readAddr(addr);
                this.registers.writeReg(reg.A,reference);
                this.registers.advancePC(1);
                return 8;


            case 0x2A: //hl+
                var addr=this.registers.readSixteenReg(reg.H);
                var reference=this.memory.readAddr(addr)+1;
                this.registers.writeReg(reg.A,reference);
                this.registers.advancePC(1);
                return 8;

            case 0x3A: //HL-
                var addr=this.registers.readSixteenReg(reg.H);
                var reference=this.memory.readAddr(addr)-1;
                this.registers.writeReg(reg.A,reference);
                this.registers.advancePC(1);
                return 8;

            case 0x7E: //HL
                var addr=this.registers.readSixteenReg(reg.H);
                var reference=this.memory.readAddr(addr);
                this.registers.writeReg(reg.A,reference);
                this.registers.advancePC(1);
                return 8;




            //DEC 16
            case 0x0B: //BC
                this.registers.writeSixteenReg(reg.B,this.registers.readSixteenReg(reg.B)-1);
                this.registers.advancePC(1);
                return 8;

            case 0x1B: //DE
                this.registers.writeSixteenReg(reg.D,this.registers.readSixteenReg(reg.D)-1);
                this.registers.advancePC(1);
                return 8;

            case 0x2B: //HL
                this.registers.writeSixteenReg(reg.H,this.registers.readSixteenReg(reg.H)-1);
                this.registers.advancePC(1);
                return 8;

            case 0x3B: //SP
                this.registers.setStackPointer(reg.B,this.registers.getStackPointer()-1);
                this.registers.advancePC(1);
                return 8;




            

            











        }

    };   



    module.exports = CPU;
})();