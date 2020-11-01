(function() {
    var CPU = require("./cpu");
    var ROM = require("./ROM");


    function gameBoy() {
        //start code based of Alex Dickerson's NES project to provide a good starting point while learning javaScript
        this.cpu = new CPU();
        }
    


    gameBoy.prototype.loadROM = function(data) {
        this.cpu.loadROM(data);
        this.reset();
    };


    gameBoy.prototype.stepFrame = function() {
        // timing idea from codeslinger 
        const maxCycles = 69905;  //max number of cycles that can be run in 1 frame
        var currentCycles = 0;
      
        while (currentCycles < maxCycles)
        {
           var cycles = this.cpu.step();
           currentCycles+=cycles;
           UpdateTimers(cycles); //memory timer
           runPPU(cycles); // graphics
           DoInterupts(); 
        }
        drawFrame();
    };

    gameBoy.prototype.reset = function() {
        this.cpu.reset();
    };

    module.exports = gameBoy;
})();