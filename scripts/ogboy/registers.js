(function() {


    var regs;
    var stackPointerAndProgramCounter;
    const reg = {
        A: 0,
        F: 1,
        B: 2,
        C: 3,
        D: 4,
        E: 5,
        H: 6,
        L: 7,
        SP: 0,
        PC: 1

    }

    function registers() {

        this.regs = Uint8Array(8);
        this.stackPointerAndProgramCounter = Uint16Array(2);

        }

    registers.prototype.writeToSixteenReg = function(whatReg,data) { //pass the high reg

           
            //bitwise operation will be needed 
            //AND for low and bitshitft plus an AND  with 0x00FF for high
            var lo = data;
            var hi = data;
            regs[whatReg+1]= lo & 0x00FF;
            hi = hi >>> 8; 
            regs[whatReg] = hi & 0x00FF;
                         

   

       };

    registers.prototype.readSixteenReg = function(whatReg) { //pass the high reg to what reg

           //maybe bitshit then OR with low
           var temp = 0;
           temp= regs[whatReg]<<8;
           temp= temp | regs[whatReg+1];

           return

   

       };

    registers.prototype.writeReg = function(whatReg,data) { // writes to 8 bit reg


        regs[whatReg]=data;




    };

    registers.prototype.getReg = function(whatReg) { // returns 8 bit reg

        //regs might be global 
        // making this function for readablility though 
        // if it impacts speed a lot (shouldn't) then I can just access directly
        return regs[whatReg];
    };


    registers.prototype.setStackPointer = function(address) {//function name says what it does

        stackPointerAndProgramCounter[reg.SP]=address;

    };

    registers.prototype.getStackPointer = function() {//function name says what it does

        return stackPointerAndProgramCounter[reg.SP];

    };

    registers.prototype.advancePC = function(jumpAmount) { // this will advance the PC by the normal amount (I believe 4 bytes but will check before implementing)

        stackPointerAndProgramCounter[reg.PC]= stackPointerAndProgramCounter[reg.PC]+jumpAmount;

    };

    registers.prototype.setPC = function(address) { // function name says what it does

        stackPointerAndProgramCounter[reg.PC]=address;


    };

    registers.prototype.getPC = function() {//function name says what it does

        return stackPointerAndProgramCounter[reg.PC];

    };

    module.exports = registers;
})();