(function() {

    var romArray;
    var bank;  // these won't matter untill I try to implement more complex games
    var cartType; // for now just tetris


    function ROM(game) {

        romArray=loadROM(game);


        }
    


    ROM.prototype.loadROM = function(game) { //game should be an arraybuffer

        
        return new uint8Array(game);

        

    };

    ROM.prototype.getROM = function(addr) { 

        
        return romArray[addr];

        

    };

    ROM.prototype.writeROM = function(addr, data) { //rarely used until banks are implemented

        
        romArray[addr]=data; //maybe an if here if its over a certain value to go to a bank

        

    };



    module.exports = ROM;
})();