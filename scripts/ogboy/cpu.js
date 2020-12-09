(function() {
    var Registers = require("./registers");
    var rom = require("./ROM");
    
    


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
    function CPU(mem) {
        this.registers = new Registers();
        this.memory = mem;

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

   CPU.prototype.sla= function(whatReg){
    this.registers.setNegativeFlag(0);
    this.registers.setHalfCarryFlag(0);
    if(this.registers.getReg(whatReg)&0x80==0x80)
    {
        this.registers.setCarryFlag(1);
        this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)<<1)&0x0FF));
        if(this.registers.getReg(whatReg)==0)
        {
            this.registers.setZeroFlag(1);
        }
        else{
            this.registers.setZeroFlag(0);
        }
        return;

    }
    this.registers.writeReg(whatReg,this.registers.getReg(whatReg)<<1);
    if(this.registers.getReg(whatReg)==0)
    {
        this.registers.setZeroFlag(1);
    }
    else{
        this.registers.setZeroFlag(0);
    }
    this.registers.setCarryFlag(0);
    return;
    }


    CPU.prototype.sra= function(whatReg){ // this can be refactored 
        this.registers.setNegativeFlag(0);
        this.registers.setHalfCarryFlag(0);
        if(this.registers.getReg(whatReg)&0x01==0x01)
        {
            this.registers.setCarryFlag(1);
            if(this.registers.getReg(whatReg)&0x80==0x80){
            this.registers.writeReg(whatReg,(((this.registers.getReg(whatReg)>>1)&0x0FF)|0x80)); 
            }
            else{
                this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)>>1)&0x0FF)); 
            }
            if(this.registers.getReg(whatReg)==0)
            {
                this.registers.setZeroFlag(1);
            }
            else{
                this.registers.setZeroFlag(0);
            }
            return;

        }
        if(this.registers.getReg(whatReg)&0x80==0x80){
            this.registers.writeReg(whatReg,(((this.registers.getReg(whatReg)>>1)&0x0FF)|0x80)); 
            }
            else{
                this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)>>1)&0x0FF)); 
            }
        this.registers.setCarryFlag(0);
        if(this.registers.getReg(whatReg)==0)
        {
            this.registers.setZeroFlag(1);
        }
        else{
            this.registers.setZeroFlag(0);
        }
        return;
    }

    CPU.prototype.srl= function(whatReg){
        this.registers.setNegativeFlag(0);
        this.registers.setHalfCarryFlag(0);
        if(this.registers.getReg(whatReg)&0x01==0x01)
        {
            this.registers.setCarryFlag(1);
            this.registers.writeReg(whatReg,((this.registers.getReg(whatReg)>>>1)&0x0FF));
            if(this.registers.getReg(whatReg)==0)
            {
                this.registers.setZeroFlag(1);
            }
            else{
                this.registers.setZeroFlag(0);
            }
            return;

        }
        this.registers.writeReg(whatReg,this.registers.getReg(whatReg)>>>1);
        this.registers.setCarryFlag(0);
        if(this.registers.getReg(whatReg)==0)
        {
            this.registers.setZeroFlag(1);
        }
        else{
            this.registers.setZeroFlag(0);
        }
        return;


    }
    CPU.prototype.swap= function(whatReg){
        registers.setCarryFlag(0);
        registers.setNegativeFlag(0);
        registers.setHalfCarryFlag(0);
        var topNibble = (this.registers.getReg(whatReg)&0xF0)>>>4;
        var bottomNibble = (this.registers.getReg(whatReg)&0x0F)<<4;
        topNibble=topNibble|bottomNibble;
        if(topNibble==0)
        {
            this.registers.setZeroFlag(1);
        }
        else{
            this.registers.setZeroFlag(0);
        }
        this.registers.writeReg(whatReg,topNibble);
        return;





    }
    CPU.prototype.bitFunction= function(whatReg, whatBit)
    {
        this.registers.setHalfCarryFlag(1);
        this.registers.setNegativeFlag(0);

        var bit = 0x01;
        bit = bit << whatBit;
        if(bit&this.registers.getReg(whatReg)==bit)
        {
            this.registers.setZeroFlag(0);


        }
        else{
            this.registers.setZeroFlag(1);
        }
        this.registers.advancePC(1);
        return 8;

    }

    CPU.prototype.bitFunctionRef= function(whatBit)
    {
        this.registers.setHalfCarryFlag(1);
        this.registers.setNegativeFlag(0);
        var address = this.registers.readSixteenReg(reg.H);
        var reference= this.memory.readAddr(address);
        var bit = 0x01;
        bit = bit << whatBit;
        if(bit&reference==bit)
        {
            this.registers.setZeroFlag(0);


        }
        else{
            this.registers.setZeroFlag(1);
        }
        this.registers.advancePC(1);
        return 12;

    }

    CPU.prototype.setUnsetFunction= function(whatReg, whatBit, set)
    {

        var bit = 0x01;
        bit = bit << whatBit;
        if(set==0)
        {
            
            this.registers.writeReg(whatReg,(this.registers.getReg(whatReg)^bit))


        }
        else if (set==1){
            this.registers.writeReg(whatReg,(this.registers.getReg(whatReg)|bit))
        }
        this.registers.advancePC(1);
        return 8;

    }

    CPU.prototype.setUnsetFunctionRef= function(whatBit,set)
    {
        var address = this.registers.readSixteenReg(reg.H);
        var reference= this.memory.readAddr(address);
        var bit = 0x01;
        bit = bit << whatBit;
        if(set==0)
        {
            
            this.memory.writeAddr(address,(reference^bit))


        }
        else if (set==1){
            this.memory.writeAddr(address,(reference|bit))
        }
        this.registers.advancePC(1);
        return 12;

    }

    //implement the opcodes
    //question is do I make the map/switch statement here or in gameboy
    CPU.prototype.step = function() {
        switch (rom.getRom(registers.getPC())) {
            case 0xCB:  //prefix timeeeeee
               
                this.registers.advancePC(1);
                return this.prefixTable();
            





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


            case 0xEA: //reg to memory
                var immediate = this.rom.getSixteenRom(this.registers.getPC()+1);
                this.memory.writeAddr(immediate,this.registers.getReg(reg.A));  
                this.registers.advancePC(3); 
                return 16; //how many cycles this took 

            case 0xFA: //ref
                var addr=this.registers.readSixteenReg(reg.H);
                var reference=this.memory.readAddr(addr);
                this.registers.writeReg(reg.A,reference);  
                this.registers.advancePC(3); 
                return 16; //how many cycles this took 

            case 0xE0: //write to ref, a 
                var addr = this.rom.getRom(this.registers.getPC()+1);
                var addr=0xFF00|addr;
                this.memory.writeAddr(addr,this.registers.getReg(reg.A))
                this.registers.advancePC(2); 
                return 12; //how many cycles this took 

            case 0xF0: //write to a, ref 
                var addr = this.rom.getRom(this.registers.getPC()+1);
                var addr=0xFF00|addr;
                this.registers.writeReg(reg.A,this.memory.readAddr(addr));
                this.registers.advancePC(2); 
                return 12; //how many cycles this took 


            case 0xE2: //write to ref, ref+carry
            var addr = this.registers.getCarryFlag();
            var addr=0xFF00|addr;
            this.memory.writeAddr(addr,this.registers.getReg(reg.A))
            this.registers.advancePC(1); 
            return 8; //how many cycles this took 

            case 0xF2: //write to a, ref+carry 
                var addr = this.registers.getCarryFlag();
                var addr=0xFF00|addr;
                this.registers.writeReg(reg.A,this.memory.readAddr(addr));
                this.registers.advancePC(1); 
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
                this.registers.advancePC(2);
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
                this.registers.advancePC(2);
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
                this.registers.advancePC(2);
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
                this.registers.advancePC(2);
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
            var added = this.eightAdd(this.registers.getReg(reg.A),this.registers.getReg(reg.A)+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(1);
            return 4;

        case 0xCE://immediate 8
            var immediate = this.rom.getRom(registers.getPC()+1);
            var added = this.eightAdd(this.registers.getReg(reg.A),immediate+this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,added);
            this.registers.advancePC(2);
            return 8;

        


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
            var immediate = this.rom.getRom(registers.getPC()+1);
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
            var subbed = this.eightSub(this.registers.getReg(reg.A),this.registers.getReg(reg.A)-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 4;


        case 0x9F://immediate
            var immediate = this.rom.getRom(registers.getPC()+1);
            var subbed = this.eightSub(this.registers.getReg(reg.A),immediate-this.registers.getCarryFlag());
            this.registers.writeReg(reg.A,subbed);
            this.registers.advancePC(1);
            return 8;

            



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

        case 0xEE:
            var immediate = this.rom.getRom(registers.getPC()+1);
            this.registers.setZeroFlag(0);
            var xored = (this.registers.getReg(reg.A))^(immediate);
            if (xored==0)
            {
                this.registers.setZeroFlag(0);
            }
            this.registers.writeReg(reg.A,xored);
            this.registers.setCarryFlag(0);
            this.registers.setHalfCarryFlag(0);
            this.registers.setNegativeFlag(0);

            this.registers.advancePC(2);
            return 8;
    



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

        case 0xFE://imm
            var immediate = this.rom.getRom(registers.getPC()+1);
            this.eightSub(this.registers.getReg(reg.A),immediate);
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



        case 0xD9://reti
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

        case 0xC3:
            var immediate = this.rom.getSixteenRom(registers.getPC()+1);
            this.registers.setPC(immediate);
            return 16;

        case 0xE9:
            this.registers.setPC(this.registers.readSixteenReg(reg.H));
            return 4;



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



        
//CALL

        case 0xC4:
            if(this.registers.getZeroFlag()==0)
            {
                this.registers.setStackPointer(this.registers.getStackPointer()+2);
                this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getPC()+1);
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.setPC(immediate);
                this.registers.advancePC(3);
                this.registers.advancePC(jumpDistance);
                return 24;
            }
            this.registers.advancePC(3);
            return 12;

        case 0xD4:
            if(this.registers.getCarryFlag()==0)
            {
                this.registers.setStackPointer(this.registers.getStackPointer()+2);
                this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getPC()+1);
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.setPC(immediate);
                this.registers.advancePC(3);
                this.registers.advancePC(jumpDistance);
                return 24;
            }
            this.registers.advancePC(3);
            return 12;


        case 0xCC:
            if(this.registers.getZeroFlag()==1)
            {
                this.registers.setStackPointer(this.registers.getStackPointer()+2);
                this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getPC()+1);
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.setPC(immediate);
                this.registers.advancePC(3);
                this.registers.advancePC(jumpDistance);
                return 24;
            }
            this.registers.advancePC(3);
            return 12;

        case 0xDC:
            if(this.registers.getCarryFlag()==1)
            {
                this.registers.setStackPointer(this.registers.getStackPointer()+2);
                this.memory.writeSixteenAddr(this.registers.getStackPointer(),this.registers.getPC()+1);
                var immediate = this.rom.getSixteenRom(registers.getPC()+1);
                this.registers.setPC(immediate);
                this.registers.advancePC(3);
                this.registers.advancePC(jumpDistance);
                return 24;
            }
            this.registers.advancePC(3);
            return 12;



        case 0xF9: // load hl to the stack pointer
            this.registers.setStackPointer(this.registers.readSixteenReg(reg.H));
            this.registers.advancePC(1);
            return 8;

        
//interrupts 

        case 0xFB:
            this.registers.enableInt();
            this.registers.advancePC(1);
            return 4;
            

        case 0xF3:
            this.registers.disableInt();
            this.registers.advancePC(1);
            return 4;










            }
    



    }; 


    CPU.prototype.prefixTable = function()
    {
        switch (rom.getRom(registers.getPC())) {

//rlc
            case 0x00:
                this.rlc(reg.B);
                if(this.registers.getReg(reg.B)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x01:
                this.rlc(reg.C);
                if(this.registers.getReg(reg.C)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x02:
                this.rlc(reg.D);
                if(this.registers.getReg(reg.D)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x03:
                this.rlc(reg.E);
                if(this.registers.getReg(reg.E)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x04:
                this.rlc(reg.H);
                if(this.registers.getReg(reg.H)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x05:
                this.rlc(reg.L);
                if(this.registers.getReg(reg.L)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x06:
                this.registers.setNegativeFlag(0);
                this.registers.setHalfCarryFlag(0);
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);
                if(reference&0x80==0x80)
                {
                    this.registers.setCarryFlag(1);
                    this.memory.writeAddr(address,((reference<<1)&0x0FF)|0x01);
                    this.registers.advancePC(1);
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    return 16;
        
                }
                this.memory.writeAddr(address,((reference<<1)&0x0FF)<<1);
                this.registers.setCarryFlag(0);
                this.advancePC(1);
                if(this.memory.readAddr(address)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                return 16;

            case 0x07:
                this.rlc(reg.A);
                if(this.registers.getReg(reg.A)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;
            

    //rrc
            case 0x08:
                this.rrc(reg.B);
                if(this.registers.getReg(reg.B)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x09:
                this.rrc(reg.C);
                if(this.registers.getReg(reg.C)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x0A:
                this.rrc(reg.D);
                if(this.registers.getReg(reg.D)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x0B:
                this.rrc(reg.E);
                if(this.registers.getReg(reg.E)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x0C:
                this.rrc(reg.H);
                if(this.registers.getReg(reg.H)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x0D:
                this.rrc(reg.L);
                if(this.registers.getReg(reg.L)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x0E:
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);
                this.registers.setNegativeFlag(0);
                this.registers.setHalfCarryFlag(0);
                if(reference&0x01==0x01)
                {
                    this.registers.setCarryFlag(1);
                    this.memory.writeAddr(address,((this.registers.getReg(whatReg)>>>1)&0x0FF)|0x80);
                    this.advancePC(1);
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    return 16;
        
                }
                this.memory.writeAddr(address,this.registers.getReg(whatReg)>>>1);
                this.registers.setCarryFlag(0);
                this.advancePC(1);
                if(this.memory.readAddr(address)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                return 16;

            case 0x0F:
                this.rrc(reg.A);
                if(this.registers.getReg(reg.A)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;



//RL
            case 0x10:
                this.rl(reg.B);
                if(this.registers.getReg(reg.B)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x11:
                this.rl(reg.C);
                if(this.registers.getReg(reg.C)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x12:
                this.rl(reg.D);
                if(this.registers.getReg(reg.D)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x13:
                this.rl(reg.E);
                if(this.registers.getReg(reg.E)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x14:
                this.rl(reg.H);
                if(this.registers.getReg(reg.H)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x15:
                this.rl(reg.L);
                if(this.registers.getReg(reg.L)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x16://(hl)
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);
                if(this.registers.getCarryFlag()==1)
                {
                
                    if(reference&0x80==0x80)
                    {
                        this.registers.setCarryFlag(1);
                        this.memory.writeAddr(address,((reference<<1)&0x0FF)|0x01);
                        this.registers.advancePC(1);
                        if(this.memory.readAddr(address)==0)
                        {
                            this.registers.setZeroFlag(1);
                        }
                        else{
                            this.registers.setZeroFlag(0);
                        }
                        return 16;
        
                    }
                    this.registers.setCarryFlag(0);
                    this.memory.writeAddr(address,((reference<<1)&0x0FF)|0x01);
                    this.registers.advancePC(1);
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    return 16;
                }
                else //carry flag is 0
                {
                    if(reference&0x80==0x80)
                    {
                        this.registers.setCarryFlag(1);
                        this.memory.writeAddr(address,((reference<<1)&0x0FF)); //should set bit 0 to 0
                        //it is already filled with a 0
                        this.registers.advancePC(1); 
                        if(this.memory.readAddr(address)==0)
                        {
                            this.registers.setZeroFlag(1);
                        }
                        else{
                            this.registers.setZeroFlag(0);
                        }
                        return 16;
        
                    }
                    this.registers.setCarryFlag(0);
                    this.memory.writeAddr(address,((reference<<1)&0x0FF));
                    this.registers.advancePC(1);
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    return 16;
                }

            case 0x17:
                this.rl(reg.A);
                if(this.registers.getReg(reg.A)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;



    //RR
            case 0x18:
                this.rr(reg.B);
                if(this.registers.getReg(reg.B)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x19:
                this.rr(reg.C);
                if(this.registers.getReg(reg.C)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x1A:
                this.rr(reg.D);
                if(this.registers.getReg(reg.D)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x1B:
                this.rr(reg.E);
                if(this.registers.getReg(reg.E)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;


            case 0x1C:
                this.rr(reg.H);
                if(this.registers.getReg(reg.H)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x1D:
                this.rr(reg.L);
                if(this.registers.getReg(reg.L)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

            case 0x1E://(hl)
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);
                if(this.registers.getCarryFlag()==1)
                {
                
                    if(reference&0x01==0x01)
                    {
                        this.registers.setCarryFlag(1);
                        this.memory.writeAddr(address,((reference>>>1)&0x0FF)|0x80);
                        this.registers.advancePC(1);
                        if(this.memory.readAddr(address)==0)
                        {
                            this.registers.setZeroFlag(1);
                        }
                        else{
                            this.registers.setZeroFlag(0);
                        }
                        return 16;

                    }
                    this.registers.setCarryFlag(0);
                    this.memory.writeAddr(address,((reference>>>1)&0x0FF)|0x80);
                    this.registers.advancePC(1);
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    return 16;
                }
                else //carry flag is 0
                {
                    if(reference&0x01==0x01)
                    {
                        this.registers.setCarryFlag(1);
                        this.memory.writeAddr(address,((reference>>>1)&0x0FF)); //should set bit 0 to 0
                        //it is already filled with a 0 
                        this.registers.advancePC(1);
                        if(this.memory.readAddr(address)==0)
                        {
                            this.registers.setZeroFlag(1);
                        }
                        else{
                            this.registers.setZeroFlag(0);
                        }
                        return 16;

                    }
                    this.registers.setCarryFlag(0);
                    this.memory.writeAddr(address,((this.registers.getReg(reg.B)>>>1)&0x0FF));
                    this.registers.advancePC(1);
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    return 16;

                }

            case 0x1F:
                this.rr(reg.A);
                if(this.registers.getReg(reg.A)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 8;

//SLA 
            case 0x20:
                this.sla(reg.B);
                this.registers.advancePC(1);
                return 8;

            case 0x21:
                this.sla(reg.C);
                this.registers.advancePC(1);
                return 8;

            case 0x22:
                this.sla(reg.D);
                this.registers.advancePC(1);
                return 8;

            case 0x23:
                this.sla(reg.E);
                this.registers.advancePC(1);
                return 8;


            case 0x24:
                this.sla(reg.H);
                this.registers.advancePC(1);
                return 8;

            case 0x25:
                this.sla(reg.L);
                this.registers.advancePC(1);
                return 8;

            case 0x26:
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);
                this.registers.setNegativeFlag(0);
                this.registers.setHalfCarryFlag(0);
                if(reference&0x80==0x80)
                {
                    this.registers.setCarryFlag(1);
                    this.memory.writeAddr(address,((reference<<1)&0x0FF));
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    this.registers.advancePC(1);
                    return 16;
            
                }
                this.memory.writeAddr(address,reference<<1);
                if(this.memory.readAddr(address)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.setCarryFlag(0);
                this.registers.advancePC(1);
                return 16;
                

            case 0x27:
                this.sla(reg.A);
                this.registers.advancePC(1);
                return 8;

//sra
            case 0x28:
                this.sra(reg.B);
                this.registers.advancePC(1);
                return 8;

            case 0x29:
                this.sra(reg.C);
                this.registers.advancePC(1);
                return 8;

            case 0x2A:
                this.sra(reg.D);
                this.registers.advancePC(1);
                return 8;

            case 0x2B:
                this.sra(reg.E);
                this.registers.advancePC(1);
                return 8;


            case 0x2C:
                this.sra(reg.H);
                this.registers.advancePC(1);
                return 8;

            case 0x2D:
                this.sra(reg.L);
                this.registers.advancePC(1);
                return 8;

            case 0x2E:
                this.registers.setNegativeFlag(0);
                this.registers.setHalfCarryFlag(0);
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);
                if(reference&0x01==0x01)
                {
                    this.registers.setCarryFlag(1);
                    if(reference&0x80==0x80){
                    this.memory.writeAddr(address,(((reference>>1)&0x0FF)|0x80)); 
                    }
                    else{
                        this.memory.writeAddr(address,((reference>>1)&0x0FF)); 
                    }
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    this.registers.advancePC(1);
                    return 16;
        
                }
                if(reference&0x80==0x80){
                    this.memory.writeAddr(address,(((reference>>1)&0x0FF)|0x80)); 
                    }
                    else{
                        this.memory.writeAddr(address,((reference>>1)&0x0FF)); 
                    }
                this.registers.setCarryFlag(0);
                if(this.memory.readAddr(address)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 16;
                

            case 0x2F:
                this.sra(reg.A);
                this.registers.advancePC(1);
                return 8; 
//SRL
            case 0x38:
                this.srl(reg.B);
                this.registers.advancePC(1);
                return 8;

            case 0x39:
                this.srl(reg.C);
                this.registers.advancePC(1);
                return 8;

            case 0x3A:
                this.srl(reg.D);
                this.registers.advancePC(1);
                return 8;

            case 0x3B:
                this.srl(reg.E);
                this.registers.advancePC(1);
                return 8;


            case 0x3C:
                this.srl(reg.H);
                this.registers.advancePC(1);
                return 8;

            case 0x3D:
                this.srl(reg.L);
                this.registers.advancePC(1);
                return 8;

            case 0x3E:
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);
                this.registers.setNegativeFlag(0);
                this.registers.setHalfCarryFlag(0);
                if(reference&0x01==0x01)
                {
                    this.registers.setCarryFlag(1);
                   this.memory.writeAddr(address,((reference>>>1)&0x0FF));
                    if(this.memory.readAddr(address)==0)
                    {
                        this.registers.setZeroFlag(1);
                    }
                    else{
                        this.registers.setZeroFlag(0);
                    }
                    this.registers.advancePC(1);
                    return 16;
        
                }
               this.memory.writeAddr(address,reference>>>1);
                this.registers.setCarryFlag(0);
                if(this.memory.readAddr(address)==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.registers.advancePC(1);
                return 16;
                

            case 0x3F:
                this.srl(reg.A);
                this.registers.advancePC(1);
                return 8;

//SWAP
            case 0x30:
                this.swap(reg.B);
                this.registers.advancePC(1);
                return 8;

            case 0x31:
                this.swap(reg.C);
                this.registers.advancePC(1);
                return 8;

            case 0x32:
                this.swap(reg.D);
                this.registers.advancePC(1);
                return 8;

            case 0x33:
                this.swap(reg.E);
                this.registers.advancePC(1);
                return 8;

            case 0x34:
                this.swap(reg.H);
                this.registers.advancePC(1);
                return 8;

            case 0x35:
                this.swap(reg.L);
                this.registers.advancePC(1);
                return 8;

            case 0x36:
                registers.setCarryFlag(0);
                registers.setNegativeFlag(0);
                registers.setHalfCarryFlag(0);
                var address = this.registers.readSixteenReg(reg.H);
                var reference= this.memory.readAddr(address);

                var topNibble = (address&0xF0)>>>4;
                var bottomNibble = (address&0x0F)<<4;
                topNibble=topNibble|bottomNibble;
                if(topNibble==0)
                {
                    this.registers.setZeroFlag(1);
                }
                else{
                    this.registers.setZeroFlag(0);
                }
                this.memory.writeAddr(address,topNibble);
                this.registers.advancePC(1);
                return 16;

            case 0x37:
                this.swap(reg.A);
                this.registers.advancePC(1);
                return 8;
//BIT
        //0
            case 0x40:
                return this.bitFunction(reg.B,0);
            case 0x41:
                return this.bitFunction(reg.C,0);
            case 0x42:
                return this.bitFunction(reg.D,0);
            case 0x43:
                return this.bitFunction(reg.E,0);
            case 0x44:
                return this.bitFunction(reg.H,0);
            case 0x45:
                return this.bitFunction(reg.L,0);
            case 0x46:
                return this.bitFunctionRef(0);
            case 0x47:
                return this.bitFunction(reg.A,0);
        //1
            case 0x48:
                return this.bitFunction(reg.B,1);
            case 0x49:
                return this.bitFunction(reg.C,1);
            case 0x4A:
                return this.bitFunction(reg.D,1);
            case 0x4B:
                return this.bitFunction(reg.E,1);
            case 0x4C:
                return this.bitFunction(reg.H,1);
            case 0x4D:
                return this.bitFunction(reg.L,1);
            case 0x4E:
                return this.bitFunctionRef(1);
            case 0x4F:
                return this.bitFunction(reg.A,1);


        //2
           case 0x50:
                return this.bitFunction(reg.B,2);
           case 0x51:
                return this.bitFunction(reg.C,2);
           case 0x52:
                return this.bitFunction(reg.D,2);
           case 0x53:
                return this.bitFunction(reg.E,2);
           case 0x54:
                return this.bitFunction(reg.H,2);
           case 0x55:
                return this.bitFunction(reg.L,2);
           case 0x56:
                return this.bitFunctionRef(2);
           case 0x57:
                return this.bitFunction(reg.A,2);
        //3
           case 0x58:
                return this.bitFunction(reg.B,3);
           case 0x59:
                return this.bitFunction(reg.C,3);
           case 0x5A:
                return this.bitFunction(reg.D,3);
           case 0x5B:
                return this.bitFunction(reg.E,3);
           case 0x5C:
                return this.bitFunction(reg.H,3);
           case 0x5D:
                return this.bitFunction(reg.L,3);
           case 0x5E:
                return this.bitFunctionRef(3);
           case 0x5F:
                return this.bitFunction(reg.A,3);

        //4
            case 0x60:
                return this.bitFunction(reg.B,4);
            case 0x61:
                return this.bitFunction(reg.C,4);
            case 0x62:
                return this.bitFunction(reg.D,4);
            case 0x63:
                return this.bitFunction(reg.E,4);
            case 0x64:
                return this.bitFunction(reg.H,4);
            case 0x65:
                return this.bitFunction(reg.L,4);
            case 0x66:
                return this.bitFunctionRef(4);
            case 0x67:
                return this.bitFunction(reg.A,4);
        //5
            case 0x68:
                return this.bitFunction(reg.B,5);
            case 0x69:
                return this.bitFunction(reg.C,5);
            case 0x6A:
                return this.bitFunction(reg.D,5);
            case 0x6B:
                return this.bitFunction(reg.E,5);
            case 0x6C:
                return this.bitFunction(reg.H,5);
            case 0x6D:
                return this.bitFunction(reg.L,5);
            case 0x6E:
                return this.bitFunctionRef(5);
            case 0x6F:
                return this.bitFunction(reg.A,5);


        //6
            case 0x70:
                return this.bitFunction(reg.B,6);
            case 0x71:
                return this.bitFunction(reg.C,6);
            case 0x72:
                return this.bitFunction(reg.D,6);
            case 0x73:
                return this.bitFunction(reg.E,6);
            case 0x74:
                return this.bitFunction(reg.H,6);
            case 0x75:
                return this.bitFunction(reg.L,6);
            case 0x76:
                return this.bitFunctionRef(6);
            case 0x77:
                return this.bitFunction(reg.A,6);
        //7
            case 0x78:
                return this.bitFunction(reg.B,7);
            case 0x79:
                return this.bitFunction(reg.C,7);
            case 0x7A:
                return this.bitFunction(reg.D,7);
            case 0x7B:
                return this.bitFunction(reg.E,7);
            case 0x7C:
                return this.bitFunction(reg.H,7);
            case 0x7D:
                return this.bitFunction(reg.L,7);
            case 0x7E:
                return this.bitFunctionRef(7);
            case 0x7F:
                return this.bitFunction(reg.A,7);





//unset

        //0
        case 0x80:
            return this.setUnsetFunction(reg.B,0,0);
        case 0x81:
            return this.setUnsetFunction(reg.C,0,0);
        case 0x82:
            return this.setUnsetFunction(reg.D,0,0);
        case 0x83:
            return this.setUnsetFunction(reg.E,0,0);
        case 0x84:
            return this.setUnsetFunction(reg.H,0,0);
        case 0x85:
            return this.setUnsetFunction(reg.L,0,0);
        case 0x86:
            return this.setUnsetFunctionRef(0,0);
        case 0x87:
            return this.setUnsetFunction(reg.A,0,0);
    //1
        case 0x88:
            return this.setUnsetFunction(reg.B,1,0);
        case 0x89:
            return this.setUnsetFunction(reg.C,1,0);
        case 0x8A:
            return this.setUnsetFunction(reg.D,1,0);
        case 0x8B:
            return this.setUnsetFunction(reg.E,1,0);
        case 0x8C:
            return this.setUnsetFunction(reg.H,1,0);
        case 0x8D:
            return this.setUnsetFunction(reg.L,1,0);
        case 0x8E:
            return this.setUnsetFunctionRef(1,0);
        case 0x8F:
            return this.setUnsetFunction(reg.A,1,0);


    //2
       case 0x90:
            return this.setUnsetFunction(reg.B,2,0);
       case 0x91:
            return this.setUnsetFunction(reg.C,2,0);
       case 0x92:
            return this.setUnsetFunction(reg.D,2,0);
       case 0x93:
            return this.setUnsetFunction(reg.E,2,0);
       case 0x94:
            return this.setUnsetFunction(reg.H,2,0);
       case 0x95:
            return this.setUnsetFunction(reg.L,2,0);
       case 0x96:
            return this.setUnsetFunctionRef(2,0);
       case 0x97:
            return this.setUnsetFunction(reg.A,2,0);
    //3
       case 0x98:
            return this.setUnsetFunction(reg.B,3,0);
       case 0x99:
            return this.setUnsetFunction(reg.C,3,0);
       case 0x9A:
            return this.setUnsetFunction(reg.D,3,0);
       case 0x9B:
            return this.setUnsetFunction(reg.E,3,0);
       case 0x9C:
            return this.setUnsetFunction(reg.H,3,0);
       case 0x9D:
            return this.setUnsetFunction(reg.L,3,0);
       case 0x9E:
            return this.setUnsetFunctionRef(3,0);
       case 0x9F:
            return this.setUnsetFunction(reg.A,3,0);

    //4
        case 0xA0:
            return this.setUnsetFunction(reg.B,4,0);
        case 0xA1:
            return this.setUnsetFunction(reg.C,4,0);
        case 0xA2:
            return this.setUnsetFunction(reg.D,4,0);
        case 0xA3:
            return this.setUnsetFunction(reg.E,4,0);
        case 0xA4:
            return this.setUnsetFunction(reg.H,4,0);
        case 0xA5:
            return this.setUnsetFunction(reg.L,4,0);
        case 0xA6:
            return this.setUnsetFunctionRef(4,0);
        case 0xA7:
            return this.setUnsetFunction(reg.A,4,0);
    //5
        case 0xA8:
            return this.setUnsetFunction(reg.B,5,0);
        case 0xA9:
            return this.setUnsetFunction(reg.C,5,0);
        case 0xAA:
            return this.setUnsetFunction(reg.D,5,0);
        case 0xAB:
            return this.setUnsetFunction(reg.E,5,0);
        case 0xAC:
            return this.setUnsetFunction(reg.H,5,0);
        case 0xAD:
            return this.setUnsetFunction(reg.L,5,0);
        case 0xAE:
            return this.setUnsetFunctionRef(5,0);
        case 0xAF:
            return this.setUnsetFunction(reg.A,5,0);


    //6
        case 0xB0:
            return this.setUnsetFunction(reg.B,6,0);
        case 0xB1:
            return this.setUnsetFunction(reg.C,6,0);
        case 0xB2:
            return this.setUnsetFunction(reg.D,6,0);
        case 0xB3:
            return this.setUnsetFunction(reg.E,6,0);
        case 0xB4:
            return this.setUnsetFunction(reg.H,6,0);
        case 0xB5:
            return this.setUnsetFunction(reg.L,6,0);
        case 0xB6:
            return this.setUnsetFunctionRef(6,0);
        case 0xB7:
            return this.setUnsetFunction(reg.A,6,0);
    //7
        case 0xB8:
            return this.setUnsetFunction(reg.B,7,0);
        case 0xB9:
            return this.setUnsetFunction(reg.C,7,0);
        case 0xBA:
            return this.setUnsetFunction(reg.D,7,0);
        case 0xBB:
            return this.setUnsetFunction(reg.E,7,0);
        case 0xBC:
            return this.setUnsetFunction(reg.H,7,0);
        case 0xBD:
            return this.setUnsetFunction(reg.L,7,0);
        case 0xBE:
            return this.setUnsetFunctionRef(7,0);
        case 0xBF:
            return this.setUnsetFunction(reg.A,7,0);









//set

        //0
            case 0xC0:
                return this.setUnsetFunction(reg.B,0,1);
            case 0xC1:
                return this.setUnsetFunction(reg.C,0,1);
            case 0xC2:
                return this.setUnsetFunction(reg.D,0,1);
            case 0xC3:
                return this.setUnsetFunction(reg.E,0,1);
            case 0xC4:
                return this.setUnsetFunction(reg.H,0,1);
            case 0xC5:
                return this.setUnsetFunction(reg.L,0,1);
            case 0xC6:
                return this.setUnsetFunctionRef(0,1);
            case 0xC7:
                return this.setUnsetFunction(reg.A,0,1);
        //1
            case 0xC8:
                return this.setUnsetFunction(reg.B,1,1);
            case 0xC9:
                return this.setUnsetFunction(reg.C,1,1);
            case 0xCA:
                return this.setUnsetFunction(reg.D,1,1);
            case 0xCB:
                return this.setUnsetFunction(reg.E,1,1);
            case 0xCC:
                return this.setUnsetFunction(reg.H,1,1);
            case 0xCD:
                return this.setUnsetFunction(reg.L,1,1);
            case 0xCE:
                return this.setUnsetFunctionRef(1,1);
            case 0xCF:
                return this.setUnsetFunction(reg.A,1,1);


        //2
           case 0xD0:
                return this.setUnsetFunction(reg.B,2,1);
           case 0xD1:
                return this.setUnsetFunction(reg.C,2,1);
           case 0xD2:
                return this.setUnsetFunction(reg.D,2,1);
           case 0xD3:
                return this.setUnsetFunction(reg.E,2,1);
           case 0xD4:
                return this.setUnsetFunction(reg.H,2,1);
           case 0xD5:
                return this.setUnsetFunction(reg.L,2,1);
           case 0xD6:
                return this.setUnsetFunctionRef(2,1);
           case 0xD7:
                return this.setUnsetFunction(reg.A,2,1);
        //3
           case 0xD8:
                return this.setUnsetFunction(reg.B,3,1);
           case 0xD9:
                return this.setUnsetFunction(reg.C,3,1);
           case 0xDA:
                return this.setUnsetFunction(reg.D,3,1);
           case 0xDB:
                return this.setUnsetFunction(reg.E,3,1);
           case 0xDC:
                return this.setUnsetFunction(reg.H,3,1);
           case 0xDD:
                return this.setUnsetFunction(reg.L,3,1);
           case 0xDE:
                return this.setUnsetFunctionRef(3,1);
           case 0xDF:
                return this.setUnsetFunction(reg.A,3,1);

        //4
            case 0xE0:
                return this.setUnsetFunction(reg.B,4,1);
            case 0xE1:
                return this.setUnsetFunction(reg.C,4,1);
            case 0xE2:
                return this.setUnsetFunction(reg.D,4,1);
            case 0xE3:
                return this.setUnsetFunction(reg.E,4,1);
            case 0xE4:
                return this.setUnsetFunction(reg.H,4,1);
            case 0xE5:
                return this.setUnsetFunction(reg.L,4,1);
            case 0xE6:
                return this.setUnsetFunctionRef(4,1);
            case 0xE7:
                return this.setUnsetFunction(reg.A,4,1);
        //5
            case 0xE8:
                return this.setUnsetFunction(reg.B,5,1);
            case 0xE9:
                return this.setUnsetFunction(reg.C,5,1);
            case 0xEA:
                return this.setUnsetFunction(reg.D,5,1);
            case 0xEB:
                return this.setUnsetFunction(reg.E,5,1);
            case 0xEC:
                return this.setUnsetFunction(reg.H,5,1);
            case 0xED:
                return this.setUnsetFunction(reg.L,5,1);
            case 0xEE:
                return this.setUnsetFunctionRef(5,1);
            case 0xEF:
                return this.setUnsetFunction(reg.A,5,1);


        //6
            case 0xF0:
                return this.setUnsetFunction(reg.B,6,1);
            case 0xF1:
                return this.setUnsetFunction(reg.C,6,1);
            case 0xF2:
                return this.setUnsetFunction(reg.D,6,1);
            case 0xF3:
                return this.setUnsetFunction(reg.E,6,1);
            case 0xF4:
                return this.setUnsetFunction(reg.H,6,1);
            case 0xF5:
                return this.setUnsetFunction(reg.L,6,1);
            case 0xF6:
                return this.setUnsetFunctionRef(6,1);
            case 0xF7:
                return this.setUnsetFunction(reg.A,6,1);
        //7
            case 0xF8:
                return this.setUnsetFunction(reg.B,7,1);
            case 0xF9:
                return this.setUnsetFunction(reg.C,7,1);
            case 0xFA:
                return this.setUnsetFunction(reg.D,7,1);
            case 0xFB:
                return this.setUnsetFunction(reg.E,7,1);
            case 0xFC:
                return this.setUnsetFunction(reg.H,7,1);
            case 0xFD:
                return this.setUnsetFunction(reg.L,7,1);
            case 0xFE:
                return this.setUnsetFunctionRef(7,1);
            case 0xFF:
                return this.setUnsetFunction(reg.A,7,1);

            





        }



    }


    module.exports = CPU;
})();