(function() {


    var regs;
    var halfCarry;
    var carry;
    var negative;
    var setZeroFlag;
    var stackPointerAndProgramCounter;


    function Registers() {

        this.regs = Uint8Array(7);
        this.stackPointerAndProgramCounter = Uint16Array(2);
        this.halfCarry=0;
        this.carry=0;
        this.negative=0;
        this.setZeroFlag=0;


        }

    registers.prototype.writeSixteenReg = function(whatReg,data) { //pass the high reg

           
            //bitwise operation will be needed 
            //AND for low and bitshitft plus an AND  with 0x00FF for high
            var lo = data;
            var hi = data;
            regs[whatReg+1]= lo & 0x0000000F;
            hi = hi >>> 8; 
            regs[whatReg] = hi & 0x0000000F;
                         

   

       };

    registers.prototype.readSixteenReg = function(whatReg) { //pass the high reg to what reg

           //maybe bitshit then OR with low
           var temp = 0;
           temp= regs[whatReg]<<8;
           temp= temp | regs[whatReg+1];

           return temp;

   

       };

    registers.prototype.writeReg = function(whatReg,data) { // writes to 8 bit reg


        regs[whatReg]=data&0x0000000F;




    };

    registers.prototype.getReg = function(whatReg) { // returns 8 bit reg

        //regs might be global 
        // making this function for readablility though 
        // if it impacts speed a lot (shouldn't) then I can just access directly
        return regs[whatReg];
    };


    registers.prototype.setStackPointer = function(address) {//function name says what it does

        stackPointerAndProgramCounter[0]=address;

    };

    registers.prototype.getStackPointer = function() {//function name says what it does

        return stackPointerAndProgramCounter[0];

    };

    registers.prototype.advancePC = function(jumpAmount) { // this will advance the PC by the normal amount (I believe 4 bytes but will check before implementing)

        stackPointerAndProgramCounter[1]= stackPointerAndProgramCounter[1]+jumpAmount;

    };

    registers.prototype.setPC = function(address) { // function name says what it does

        stackPointerAndProgramCounter[1]=address;


    };

    registers.prototype.getPC = function() {//function name says what it does

        return stackPointerAndProgramCounter[1];

    };




    registers.prototype.setZeroFlag = function(flag) {//function name says what it does

        this.zero=flag;

    };

    registers.prototype.setNegativeFlag = function(flag) {//function name says what it does

        this.negative=flag;

    };

    registers.prototype.setHalfCarryFlag = function(flag) {//function name says what it does

        this.halfCarry=flag;

    };


    registers.prototype.setCarryFlag = function(flag) {//function name says what it does

        this.carry=flag;

    };




    registers.prototype.getZeroFlag = function() {//function name says what it does

        return this.zero;

    };

    registers.prototype.getNegativeFlag = function() {//function name says what it does

        return this.negative;

    };

    registers.prototype.getHalfCarryFlag = function() {//function name says what it does

        return this.halfCarry;

    };


    registers.prototype.getCarryFlag = function() {//function name says what it does

       return this.carry;

    };




    module.exports = Registers;
})();