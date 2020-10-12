(function() {

    var low = null;
    var hi = null;

    function register() {
        this.low = null;
        this.hi = null;
        }

        gameBoy.prototype.writeToFullReg = function(data) {

            //split data into numbers for the high bits and the low bits (seperate decimal to hex to decimal converter? already exist?
            //could use .tostring(16)
            // for instance 261=0001 0101 = 1 and 5 
    

        };

        gameBoy.prototype.readFullReg = function(data) {

            //could need to convert to hex then split string
            // this might not have to be implemented 
            // for instance 1 and 5 =0001 0101 = 0x01 and 0x05 =261
            //this isn't great for speed I guess but best idea I got right now
    

        };
    

    module.exports = registers;
})();