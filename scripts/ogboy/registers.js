(function() {
    var Register = require("./register");



    function registers() {
        this.AF = new Register(this);
        this.BC = new Register(this);
        this.DE = new Register(this);
        this.HL = new Register(this);
        }

    

    module.exports = registers;
})();