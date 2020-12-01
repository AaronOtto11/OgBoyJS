(function() {
    var registers = require("./registers");
    var rom = require("./ROM");
    var memory= require("./mmu");
    


    const reg = {
        A: 0,
        F: 1,
        B: 2,
        C: 3,
        D: 4,
        E: 5,
        H: 6,
        L: 7
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


    CPU.prototype.eightDec= function(whatReg){
        this.isHalfCarry(this.registers.getReg(whatReg),-1);
        if(this.registers.getReg(whatReg)-1<0) // might not need this
        {
            this.registers.writeReg(whatReg,this.registers.getReg(whatReg)-1); 

        }
        else
        {
            this.registers.writeReg(whatReg,this.registers.getReg(whatReg)&0x0FF); // if this doesn't work then use the other commented out line
            //have to do this because no set data type in JS
            //  this.registers.setCarryFlag(1); carry flag not set on inc
        }
        if (this.registers.getReg(whatReg)==0)
        {
            this.registers.setZeroFlag(1);
        }
        this.registers.setNegativeFlag(1);

    }

    CPU.prototype.eightInc= function(whatReg){
        this.isHalfCarry(this.registers.getReg(whatReg),1);
        if(this.registers.getReg(whatReg)+1<255) // might not need this
        {
            this.registers.writeReg(whatReg,this.registers.getReg(whatReg)+1); 

        }
        else
        {
           this.registers.writeReg(whatReg,this.registers.getReg(whatReg)&0x0FF); // if this doesn't work then use the other commented out line
           //have to do this because no set data type in JS
          //  this.registers.setCarryFlag(1); carry flag not set on inc
        }
        if (this.registers.getReg(whatReg)==0)
        {
            this.registers.setZeroFlag(1);
        }
        this.registers.setNegativeFlag(0);

    }

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
        if(this.isEightCarryAdd(num1,num2))
        {
            retNum = num1+num2;
        }
        else
        {
           
           retNum = (num1+num2)&&0x000000FF; 
        }
        if (retNum==0)
        {
            this.registers.setZeroFlag(1);
        }
        else
        {
            this.registers.setZeroFlag(0);
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


     CPU.prototype.eightSub= function(num1,num2){
        var retNum = 0
        this.isHalfCarry(num1,num2);
        if(this.isEightCarrySub(num1,num2))
        {
            retNum = (num1-num2)&0x000000FF;
        }
        else
        {
           retNum = (num1-num2); 

        }
        if (retNum==0)
        {
            this.registers.setZeroFlag(1);
        }
        else
        {
            this.registers.setZeroFlag(0);
        }
        this.registers.setNegativeFlag(1);
        return retNum;
 
 
     };

    CPU.prototype.sixteenSub= function(num1,num2){


        this.isHalfCarry(num1,num2);
        var retNum=0;
        if(this.isSixteenCarrySub(num1,num2))
        {
           retNum=(num1+num2)&0x0FFFF;
        }
        else
        {
        
            retNum=num1-num2;

        }
        this.registers.setNegativeFlag(0);
        return retNum;
 
     };

    CPU.prototype.rlc= function(whatReg){
        this.registers.setNegativeFlag(0);
        this.registers.setHalfCarryFlag(0);
        if(this.registers.getReg(whatReg)&0x80==0x80)
        {
            this.registers.setCarryFlag(1);
            this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)<<1)&0x0FF)|0x01);
            return;

        }
        this.registers.writeReg(whatReg,this.registers.getReg(whatReg)<<1);
        this.registers.setCarryFlag(0);
        return;



        }

    CPU.prototype.rl= function(whatReg){

        if(this.registers.getCarryFlag()==1)
        {
        
            if(this.registers.getReg(whatReg)&0x80==0x80)
            {
                this.registers.setCarryFlag(1);
                this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)<<1)&0x0FF)|0x01);
                return;

            }
            this.registers.setCarryFlag(0);
            this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)<<1)&0x0FF)|0x01);
            return;
        }
        else //carry flag is 0
        {
            if(this.registers.getReg(whatReg)&0x80==0x80)
            {
                this.registers.setCarryFlag(1);
                this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)<<1)&0x0FF)); //should set bit 0 to 0
                //it is already filled with a 0 
                return;

            }
            this.registers.setCarryFlag(0);
            this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)<<1)&0x0FF));
            return;



        }
     }

    CPU.prototype.rrc= function(whatReg){
        this.registers.setNegativeFlag(0);
        this.registers.setHalfCarryFlag(0);
        if(this.registers.getReg(whatReg)&0x01==0x01)
        {
            this.registers.setCarryFlag(1);
            this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)>>>1)&0x0FF)|0x80);
            return;

        }
        this.registers.writeReg(whatReg,this.registers.getReg(whatReg)>>>1);
        this.registers.setCarryFlag(0);
        return;


    }

    CPU.prototype.rr= function(whatReg){
        if(this.registers.getCarryFlag()==1)
        {
        
            if(this.registers.getReg(whatReg)&0x01==0x01)
            {
                this.registers.setCarryFlag(1);
                this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)>>>1)&0x0FF)|0x80);
                return;

            }
            this.registers.setCarryFlag(0);
            this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)>>>1)&0x0FF)|0x80);
            return;
        }
        else //carry flag is 0
        {
            if(this.registers.getReg(whatReg)&0x01==0x01)
            {
                this.registers.setCarryFlag(1);
                this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)>>>1)&0x0FF)); //should set bit 0 to 0
                //it is already filled with a 0 
                return;

            }
            this.registers.setCarryFlag(0);
            this.registers.writeReg(reg.A,((this.registers.getReg(reg.B)>>>1)&0x0FF));
            return;

        }



   }



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


            case 0xF8: //HL, SP+- immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1)
                if ((immediate & 0x80) > 0)
                {
                    immediate = immediate - 0x10;
                }  
                var added = this.sixteenAdd(this.registers.getStackPointer(),immediate);
                this.registers.writeSixteenReg(reg.H,added); 
                this.registers.advancePC(2); 
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
                this.eightInc(reg.B);
                this.registers.advancePC(1);
                return 4;

            case 0x14: //inc D
                this.eightInc(reg.D);
                this.registers.advancePC(1);
                return 4;

            case 0x24: //inc H
                this.eightInc(reg.H);
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


            case 0x0C: //inc C
                this.eightInc(reg.C);
                this.registers.advancePC(1);
                return 4;

            case 0x1C: //inc E
                this.eightInc(reg.E);
                this.registers.advancePC(1);
                return 4;

            case 0x2C: //inc L
                this.eightInc(reg.L);
                this.registers.advancePC(1);
                return 4;

                
            case 0x3C: //inc A
                this.eightInc(reg.A);
                this.registers.advancePC(1);
                return 4;





 //8 bit decs

        case 0x05: //dec B
            this.eightDec(reg.B);
            this.registers.advancePC(1);
            return 4;

        case 0x15: //dec D
            this.eightDec(reg.D);
            this.registers.advancePC(1);
            return 4;

        case 0x25: //dec H
            this.eightDec(reg.H);
            this.registers.advancePC(1);
            return 4;

        case 0x35: //dec reference HL
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.isHalfCarry(reference,-1);
            if(reference-1<0) // might not need this
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
            


        case 0x0D: //dec C
            this.eightDec(reg.C);
            this.registers.advancePC(1);
            return 4;

        case 0x1D: //dec E
            this.eightDec(reg.E);
            this.registers.advancePC(1);
            return 4;

        case 0x2D: //dec L
            this.eightDec(reg.L);
            this.registers.advancePC(1);
            return 4;


        case 0x3D: //dec A
            this.eightDec(reg.A);
            this.registers.advancePC(1);
            return 4;

       




            //ld immediate 8 

            case 0x06: //ld B, immediate 8
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

          
          
            case 0x0E: //ld C, immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.C,immediate);
                this.registers.advancePC(2);
                return 8;

            case 0x1E: //ld E, immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.E,immediate);
                this.registers.advancePC(2);
                return 8;


            case 0x2E: //ld L, immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.L,immediate);
                this.registers.advancePC(2);
                return 8;


            case 0x3E: //ld A, immediate 8
                var immediate = this.rom.getRom(registers.getPC()+1);
                this.registers.writeReg(reg.A,immediate);
                this.registers.advancePC(2);
                return 8;

            
            

//rolls 


            case 0x07: //rlca
                //0x80
                this.rlc(reg.A);
                this.registers.advancePC(1);
                return 4;


            case 0x17: // rla
                //0x80              
                this.rl(reg.A);
                this.registers.advancePC(1);
                return 4;

            case 0x0F: //rrca
            //0x01
                this.rrc(whatReg);
                this.registers.advancePC(1);
                return 4;


            case 0x1F: // rra
                this.rr(reg.A);
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

            case 0x20: // jump if zero flag equals 0
                if(this.registers.getZeroFlag()==0)
                {
                    var jumpDistance = this.rom.getRom(registers.getPC()+1);
                    if ((jumpDistance & 0x80) > 0)
                    {
                       jumpDistance = jumpDistance - 0x10;
                    }  
                    this.registers.advancePC(2);
                    this.registers.advancePC(jumpDistance);
                    return 12;
                }
                this.advancePC(2);
                return 8;

            case 0x30: // jump if carry flag equals 0
                if(this.registers.getCarryFlag()==0)
                {
                    var jumpDistance = this.rom.getRom(registers.getPC()+1);
                    if ((jumpDistance & 0x80) > 0)
                    {
                       jumpDistance = jumpDistance - 0x10;
                    }  
                    this.registers.advancePC(2);
                    this.registers.advancePC(jumpDistance);
                    return 12;
                }
                this.advancePC(2);
                return 8;


            case 0x28: // jump if zero flag equals 1
                if(this.registers.getZeroFlag()==1)
                {
                    var jumpDistance = this.rom.getRom(registers.getPC()+1);
                    if ((jumpDistance & 0x80) > 0)
                    {
                       jumpDistance = jumpDistance - 0x10;
                    }  
                    this.registers.advancePC(2);
                    this.registers.advancePC(jumpDistance);
                    return 12;
                }
                this.advancePC(2);
                return 8;

            case 0x38: // jump if carry flag equals 1
                if(this.registers.getCarryFlag()==1)
                {
                    var jumpDistance = this.rom.getRom(registers.getPC()+1);
                    if ((jumpDistance & 0x80) > 0)
                    {
                       jumpDistance = jumpDistance - 0x10;
                    }  
                    this.registers.advancePC(2);
                    this.registers.advancePC(jumpDistance);
                    return 12;
                }
                this.advancePC(2);
                return 8;


            case 0x18: // jump
                var jumpDistance = this.rom.getRom(registers.getPC()+1);
                if ((jumpDistance & 0x80) > 0)
                {
                   jumpDistance = jumpDistance - 0x10;
                }  
                this.registers.advancePC(2);
                this.registers.advancePC(jumpDistance);
                return 12;


            case 0x2F: //CPL
                var temp =registers.getReg(reg.A);
                temp=~temp & 0x0000000F;
                registers.writeReg(reg.A,temp);
                
 
            case 0x3F: //CPL
                var temp =registers.getCarryFlag();
                if(temp==0){
                    registers.setCarryFlag(1);

                }
                else{

                    registers.setCarryFlag(0);
                }
                

// 8 bit Register Loads

    // load into B
            case 0x41:
                this.registers.writeReg(reg.B,registers.getReg(reg.C));
                this.registers.advancePC(1);
                return 4;

            case 0x42:
                this.registers.writeReg(reg.B,registers.getReg(reg.D));
                this.registers.advancePC(1);
                return 4;

            case 0x43:
                this.registers.writeReg(reg.B,registers.getReg(reg.E));
                this.registers.advancePC(1);
                return 4;


            case 0x44:
                this.registers.writeReg(reg.B,registers.getReg(reg.H));
                this.registers.advancePC(1);
                return 4;

            case 0x45:
                this.registers.writeReg(reg.B,registers.getReg(reg.L));
                this.registers.advancePC(1);
                return 4;

            case 0x46:
                var addr=this.registers.readSixteenReg(reg.H);
                var reference=this.memory.readAddr(addr);
                this.registers.writeReg(reg.B,reference);
                this.registers.advancePC(1);
                return 8;

            case 0x47:
                this.registers.writeReg(reg.B,registers.getReg(reg.A));
                this.registers.advancePC(1);
                return 4;



        // load into C
        case 0x48:
            this.registers.writeReg(reg.C,registers.getReg(reg.B));
            this.registers.advancePC(1);
            return 4;

        case 0x4A:
            this.registers.writeReg(reg.C,registers.getReg(reg.D));
            this.registers.advancePC(1);
            return 4;

        case 0x4B:
            this.registers.writeReg(reg.C,registers.getReg(reg.E));
            this.registers.advancePC(1);
            return 4;


        case 0x4C:
            this.registers.writeReg(reg.C,registers.getReg(reg.H));
            this.registers.advancePC(1);
            return 4;

        case 0x4D:
            this.registers.writeReg(reg.C,registers.getReg(reg.L));
            this.registers.advancePC(1);
            return 4;

        case 0x4E:
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.registers.writeReg(reg.C,reference);
            this.registers.advancePC(1);
            return 8;

        case 0x4F:
            this.registers.writeReg(reg.C,registers.getReg(reg.A));
            this.registers.advancePC(1);
            return 4;



        // load into D
        case 0x50:
            this.registers.writeReg(reg.D,registers.getReg(reg.B));
            this.registers.advancePC(1);
            return 4;

        case 0x51:
            this.registers.writeReg(reg.D,registers.getReg(reg.C));
            this.registers.advancePC(1);
            return 4;

        case 0x53:
            this.registers.writeReg(reg.D,registers.getReg(reg.E));
            this.registers.advancePC(1);
            return 4;


        case 0x54:
            this.registers.writeReg(reg.D,registers.getReg(reg.H));
            this.registers.advancePC(1);
            return 4;

        case 0x55:
            this.registers.writeReg(reg.D,registers.getReg(reg.L));
            this.registers.advancePC(1);
            return 4;

        case 0x56:
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.registers.writeReg(reg.D,reference);
            this.registers.advancePC(1);
            return 8;

        case 0x57:
            this.registers.writeReg(reg.D,registers.getReg(reg.A));
            this.registers.advancePC(1);
            return 4;

            
        // load into E
        case 0x58:
            this.registers.writeReg(reg.E,registers.getReg(reg.B));
            this.registers.advancePC(1);
            return 4;

        case 0x59:
            this.registers.writeReg(reg.E,registers.getReg(reg.C));
            this.registers.advancePC(1);
            return 4;

        case 0x5A:
            this.registers.writeReg(reg.E,registers.getReg(reg.D));
            this.registers.advancePC(1);
            return 4;


        case 0x5C:
            this.registers.writeReg(reg.E,registers.getReg(reg.H));
            this.registers.advancePC(1);
            return 4;

        case 0x5D:
            this.registers.writeReg(reg.E,registers.getReg(reg.L));
            this.registers.advancePC(1);
            return 4;

        case 0x5E:
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.registers.writeReg(reg.E,reference);
            this.registers.advancePC(1);
            return 8;

        case 0x5F:
            this.registers.writeReg(reg.E,registers.getReg(reg.A));
            this.registers.advancePC(1);
            return 4;


        // load into H
        case 0x60:
            this.registers.writeReg(reg.H,registers.getReg(reg.B));
            this.registers.advancePC(1);
            return 4;

        case 0x61:
            this.registers.writeReg(reg.H,registers.getReg(reg.C));
            this.registers.advancePC(1);
            return 4;

        case 0x62:
            this.registers.writeReg(reg.H,registers.getReg(reg.D));
            this.registers.advancePC(1);
            return 4;


        case 0x63:
            this.registers.writeReg(reg.H,registers.getReg(reg.E));
            this.registers.advancePC(1);
            return 4;

        case 0x65:
            this.registers.writeReg(reg.H,registers.getReg(reg.L));
            this.registers.advancePC(1);
            return 4;

        case 0x66:
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.registers.writeReg(reg.H,reference);
            this.registers.advancePC(1);
            return 8;

        case 0x67:
            this.registers.writeReg(reg.H,registers.getReg(reg.A));
            this.registers.advancePC(1);
            return 4;



        // load into L
        case 0x68:
            this.registers.writeReg(reg.L,registers.getReg(reg.B));
            this.registers.advancePC(1);
            return 4;

        case 0x69:
            this.registers.writeReg(reg.L,registers.getReg(reg.C));
            this.registers.advancePC(1);
            return 4;

        case 0x6A:
            this.registers.writeReg(reg.L,registers.getReg(reg.D));
            this.registers.advancePC(1);
            return 4;


        case 0x6B:
            this.registers.writeReg(reg.L,registers.getReg(reg.E));
            this.registers.advancePC(1);
            return 4;

        case 0x6C:
            this.registers.writeReg(reg.L,registers.getReg(reg.H));
            this.registers.advancePC(1);
            return 4;

        case 0x6E:
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.registers.writeReg(reg.L,reference);
            this.registers.advancePC(1);
            return 8;

        case 0x6F:
            this.registers.writeReg(reg.L,registers.getReg(reg.A));
            this.registers.advancePC(1);
            return 4;


        // load into A
        case 0x78:
            this.registers.writeReg(reg.A,registers.getReg(reg.B));
            this.registers.advancePC(1);
            return 4;

        case 0x79:
            this.registers.writeReg(reg.A,registers.getReg(reg.C));
            this.registers.advancePC(1);
            return 4;

        case 0x7A:
            this.registers.writeReg(reg.A,registers.getReg(reg.D));
            this.registers.advancePC(1);
            return 4;


        case 0x7B:
            this.registers.writeReg(reg.A,registers.getReg(reg.E));
            this.registers.advancePC(1);
            return 4;

        case 0x7C:
            this.registers.writeReg(reg.A,registers.getReg(reg.H));
            this.registers.advancePC(1);
            return 4;

        case 0x7D:
            this.registers.writeReg(reg.A,registers.getReg(reg.L));
            this.registers.advancePC(1);
            return 4;

        case 0x7E:
            var addr=this.registers.readSixteenReg(reg.H);
            var reference=this.memory.readAddr(addr);
            this.registers.writeReg(reg.A,reference);
            this.registers.advancePC(1);
            return 8;

    // 8 bit write to reference HL
        case 0x70: //B
            var addr=this.registers.readSixteenReg(reg.H);
            this.memory.writeAddr(addr,this.reg.B);
            this.registers.advancePC(1);
            return 8;


        case 0x71: //C
            var addr=this.registers.readSixteenReg(reg.H);
            this.memory.writeAddr(addr,this.reg.C);
            this.registers.advancePC(1);
            return 8;


        case 0x72://D
            var addr=this.registers.readSixteenReg(reg.H);
            this.memory.writeAddr(addr,this.reg.D);
            this.registers.advancePC(1);
            return 8;

        case 0x73://E
            var addr=this.registers.readSixteenReg(reg.H);
            this.memory.writeAddr(addr,this.reg.E);
            this.registers.advancePC(1);
            return 8;


        case 0x74: //H
            var addr=this.registers.readSixteenReg(reg.H);
            this.memory.writeAddr(addr,this.reg.H);
            this.registers.advancePC(1);
            return 8;


        case 0x75: //L
            var addr=this.registers.readSixteenReg(reg.H);
            this.memory.writeAddr(addr,this.reg.L);
            this.registers.advancePC(1);
            return 8;


        case 0x77: //A
            var addr=this.registers.readSixteenReg(reg.H);
            this.memory.writeAddr(addr,this.reg.A);
            this.registers.advancePC(1);
            return 8;


    //8 bit add

    //A
        case 0x80: //b
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.B));
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x81: //c
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.C));
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;


        case 0x82: //d
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.D));
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x83://e
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.E));
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x84://h
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.H));
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x85://l
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.L));
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;


        case 0x86: //reference HL
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            var added = this.eightAdd(this.registers.getReg(reg.A),reference);
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 8;

        case 0x87://A
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.A));
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0xC6://immediate
            var immediate = this.rom.getRom(registers.getPC()+1)
            var added = this.eightAdd(this.registers.getReg(reg.A),immediate);
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(2);
            return 8;

        case 0xE8://signed immediate to stack pointer
            var immediate = this.rom.getRom(registers.getPC()+1)
            if ((immediate & 0x80) > 0)
             {
                immediate = immediate - 0x10;
             }  
            var added = this.sixteenAdd(this.registers.getStackPointer(),immediate);
            this.registers.setStackPointer(added);
            this.registers.setNegativeFlag(0);
            this.registers.advancePC(2);
            return 16;

    
            
    //ADC
        case 0x88: //b
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.B)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x89: //c
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.C)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;


        case 0x8A: //d
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.D)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x8B://e
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.E)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x8C://h
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.H)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0x8D://l
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.L)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;


        case 0x8E: //reference HL
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            var added = this.eightAdd(this.registers.getReg(reg.A),reference+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 8;
            
        case 0x8F://A
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.L)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        


    //8 bit subs

    //A
        case 0x90: //b
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.B));
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x91: //c
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.C));
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;


        case 0x92: //d
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.D));
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x93://e
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.E));
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x94://h
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.H));
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x95://l
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.L));
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;


        case 0x96: //reference HL
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            var subbed = this.eightSub(this.registers.getReg(reg.A),reference);
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 8;

        case 0x97://A
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.A));
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0xD6://immediate
            var immediate = this.rom.getRom(registers.getPC()+1)
            var subbed = this.eightSub(this.registers.getReg(reg.A),immediate);
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(2);
            return 8;

        //SBC
        case 0x98: //b
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.B)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x99: //c
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.C)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;


        case 0x9A: //d
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.D)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x9B://e
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.E)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x9C://h
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.H)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;

        case 0x9D://l
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.L)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;


        case 0x9E: //reference HL
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            var subbed = this.eightSub(this.registers.getReg(reg.A),reference-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 8;

        case 0x9F://A
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.L)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;






    //8 bit and
        case 0xA0:
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(this.registers.getReg(reg.B));
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xA1:
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(this.registers.getReg(reg.C));
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xA2:
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(this.registers.getReg(reg.D));
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xA3:
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(this.registers.getReg(reg.E));
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xA4:
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(this.registers.getReg(reg.H));
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xA5:
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(this.registers.getReg(reg.L));
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xA6: //reference hl
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(reference);
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 8;

        case 0xA7:
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&(this.registers.getReg(reg.A));
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xE6:
            var immediate = this.rom.getRom(registers.getPC()+1)
            this.registers.setZeroFlag(0);
            var anded = (this.registers.getReg(reg.A))&immediate;
            if (anded==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,anded);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(1);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(2);
            return 8;

    //8 bit xor  // dont need to worry about bitmasking as it should already be in the write
        case 0xA8:
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(this.registers.getReg(reg.B));
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xA9:
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(this.registers.getReg(reg.C));
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xAA:
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(this.registers.getReg(reg.D));
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xAB:
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(this.registers.getReg(reg.E));
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xAC:
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(this.registers.getReg(reg.H));
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xAD:
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(this.registers.getReg(reg.L));
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xAE: //reference hl
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(reference);
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 8;

        case 0xAF:
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(this.registers.getReg(reg.A));
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;




//8 bit or
        case 0xB0:
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(this.registers.getReg(reg.B));
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xB1:
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(this.registers.getReg(reg.C));
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xB2:
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(this.registers.getReg(reg.D));
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xB3:
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(this.registers.getReg(reg.E));
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xB4:
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(this.registers.getReg(reg.H));
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xB5:
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(this.registers.getReg(reg.L));
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;

        case 0xB6: //reference hl
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(reference);
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 8;

        case 0xB7:
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|(this.registers.getReg(reg.A));
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }
            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(1);
            return 4;


        case 0xF6: //immediate
            var immediate = this.rom.getRom(registers.getPC()+1);
            this.registers.setZeroFlag(0);
            var ored = (this.registers.getReg(reg.A))|immediate;
            if (ored==0)
            {
                this.registers.setZeroFlag(1);
            }

            this.registers.writeReg(reg.A,ored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(2);
            return 8;


// CP 

        case 0xB8://A,B
            this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.B));
            this.registers.advancePC(1);
            return 4;


        case 0xB9://A,C
            this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.C));
            this.registers.advancePC(1);
            return 4;

        case 0xBA://A,D
            this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.D));
            this.registers.advancePC(1);
            return 4;

        case 0xBB://A,E
            this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.E));
            this.registers.advancePC(1);
            return 4;

        case 0xBC://A,H
            this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.H));
            this.registers.advancePC(1);
            return 4;

        case 0xBD://A,L
            this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.L));
            this.registers.advancePC(1);
            return 4;

        case 0xBE://A,(HL)
            var addr=this.registers.readSixteenReg(reg.H);
            var reference= this.memory.readAddr(addr);
            this.eightSub(this.registers.getReg(reg.A),reference);
            this.registers.advancePC(1);
            return 8;

        case 0xBF://A,A
            this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.A));
            this.registers.advancePC(1);
            return 4;


    //ret

        case 0xC0:
            if((this.registers.getZeroFlag())==0)
            {
            this.registers.setPC(this.memory.readSixteenAddr(this.memory.getStackPointer()));
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            return 16;
            }
            this.registers.advancePC(1);
            return 8;

        case 0xD0:
            if((this.registers.getCarryFlag())==0)
            {
            this.registers.setPC(this.memory.readSixteenAddr(this.memory.getStackPointer()));
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            return 16;
            }
            this.registers.advancePC(1);
            return 8;

        case 0xC8:
            if((this.registers.getZeroFlag())==1)
            {
            this.registers.setPC(this.memory.readSixteenAddr(this.memory.getStackPointer()));
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            return 16;
            }
            this.registers.advancePC(1);
            return 8;

        case 0xD8:
            if((this.registers.getCarryFlag())==1)
            {
            this.registers.setPC(this.memory.readSixteenAddr(this.memory.getStackPointer()));
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            return 16;
            }
            this.registers.advancePC(1);
            return 8;



        case 0xC9:
            this.registers.setPC(this.memory.readSixteenAddr(this.memory.getStackPointer()));
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            return 16;



        case 0xC9:
            this.registers.setPC(this.memory.readSixteenAddr(this.memory.getStackPointer()));
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.registers.enableInt();
            return 16;


    // jumps
        case 0xC2:
            if((this.registers.getZeroFlag())==0)
            {
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.setPC(immediate);
                return 16;
            }
            this.registers.advancePC(1);
            return 8;

        case 0xD2:
            if((this.registers.getCarryFlag())==0)
            {
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.setPC(immediate);
                return 16;
            }
            this.registers.advancePC(1);
            return 8;

        case 0xC2:
            var immediate = this.rom.getSixteenRom(registers.getPC()+1);
            this.registers.setPC(immediate);
            return 16;



    //pop 

        case 0xC1:
            this.memory.writeSixteenReg(this.registers.readSixteenReg(reg.B),this.registers.getStackPointer());
            this.registers.setStackPointer(this.registers.getStackPointer()-2);
            this.registers.advancePC(1);
            return 16;

        case 0xD1:
            this.memory.writeSixteenReg(this.registers.readSixteenReg(reg.D),this.registers.getStackPointer());
            this.registers.setStackPointer(this.registers.getStackPointer()-2);
            this.registers.advancePC(1);
            return 16;

        case 0xE1:
            this.memory.writeSixteenReg(this.registers.readSixteenReg(reg.H),this.registers.getStackPointer());
            this.registers.setStackPointer(this.registers.getStackPointer()-2);
            this.registers.advancePC(1);
            return 16;
    
        case 0xF1:
            this.memory.writeSixteenReg(this.registers.readSixteenReg(reg.A),this.registers.getStackPointer());
            this.registers.setStackPointer(this.registers.getStackPointer()-2);
            this.registers.advancePC(1);
            return 16;

    //push

        case 0xC5:
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.readSixteenReg(reg.B));
            this.registers.advancePC(1);
            return 16;


        case 0xD5:
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.readSixteenReg(reg.D));
            this.registers.advancePC(1);
            return 16;

        case 0xE5:
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.readSixteenReg(reg.H));
            this.registers.advancePC(1);
            return 16;


        case 0xF5:
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.readSixteenReg(reg.A));
            this.registers.advancePC(1);
            return 16;
    

        

// RST
        case 0xC7: //00h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=tempReg & 0x00FF;
            this.registers.setPC(tempReg);
            return 16;

        case 0xD7: //10h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=(tempReg | 0x1000)&0x10FF;
            this.registers.setPC(tempReg);
            return 16;

        case 0xE7: //20h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=(tempReg | 0x2000)&0x20FF;
            this.registers.setPC(tempReg);
            return 16;

        case 0xF7: //30h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=tempReg=(tempReg | 0x3000)&0x30FF;
            this.registers.setPC(tempReg);
            return 16;

        case 0xCF: //88h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=(tempReg | 0x0800)&0x08FF;
            this.registers.setPC(tempReg);
            return 16;

        case 0xDF: //18h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=(tempReg | 0x1800)&0x18FF;
            this.registers.setPC(tempReg);
            return 16;

        case 0xEF: //28h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=(tempReg | 0x2800)&0x28FF;
            this.registers.setPC(tempReg);
            return 16;

        case 0xFF: //38h
            this.registers.setStackPointer(this.registers.getStackPointer()+2);
            this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getStackPointer());
            var tempReg = this.registers.getReg(reg.H);
            tempReg=(tempReg | 0x3800)&0x38FF;
            this.registers.setPC(tempReg);
            return 16;



        


    

        










            }
    



    };   



    module.exports = CPU;
})();