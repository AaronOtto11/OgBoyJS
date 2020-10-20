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



    module.exports = ROM;
})();