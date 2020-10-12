(function() {


    //var regs = Uint8Array(8);
    //var stackPointerAndProgramCounter = Uint16Array(2);
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

        var regs = Uint8Array(8);
        var stackPointerAndProgramCounter = Uint16Array(2);

        }

    gameBoy.prototype.writeToSixteenReg = function(whatReg,data) { //pass the high reg

           
            //bitwise operation will be needed 
            //AND for low and bitshitft plus an AND  with 0x00FF for high
            var lo = data;
            var hi = data;
            regs[whatReg+1]= lo & 0x00FF;
            hi = hi >>> 8; 
            regs[whatReg] = hi & 0x00FF;
                         

   

       };

    gameBoy.prototype.readSixteenReg = function(whatReg) { //pass the high reg to what reg

           //maybe bitshit then OR with low
           var temp = 0;
           temp= regs[whatReg]<<8;
           temp= temp | regs[whatReg+1];

           return

   

       };

    gameBoy.prototype.writeReg = function(whatReg,data) { // writes to 8 bit reg


        regs[whatReg]=data;




    };

    gameBoy.prototype.getReg = function(whatReg) { // returns 8 bit reg

        //regs might be global 
        // making this function for readablility though 
        // if it impacts speed a lot (shouldn't) then I can just access directly
        return regs[whatReg];
    };


    gameBoy.prototype.setStackPointer = function(address) {//function name says what it does

        stackPointerAndProgramCounter[reg.SP]=address;

    };

    gameBoy.prototype.getStackPointer = function() {//function name says what it does

        return stackPointerAndProgramCounter[reg.SP];

    };

    gameBoy.prototype.advancePC = function(jumpAmount) { // this will advance the PC by the normal amount (I believe 4 bytes but will check before implementing)

        stackPointerAndProgramCounter[reg.PC]= stackPointerAndProgramCounter[reg.PC]+jumpAmount;

    };

    gameBoy.prototype.setPC = function(address) { // function name says what it does

        stackPointerAndProgramCounter[reg.PC]=address;


    };

    gameBoy.prototype.getPC = function() {//function name says what it does

        return stackPointerAndProgramCounter[reg.PC];

    };

    module.exports = registers;
})();