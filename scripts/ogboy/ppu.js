(function() {
    
    function PPU() {
        this.vRam = Uint8Array(0x2000); 
        this.sprites= Uint8Array(0x00A0);

        }
    


    module.exports = PPU;
})();