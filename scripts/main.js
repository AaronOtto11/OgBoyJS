(function() {
    var gameBoy = require("./ogboy");
    var game;
    window.gameBoy = new gameBoy();
    const fileSelector = document.getElementById('file-selector');
    fileSelector.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      game = reader.readAsArrayBuffer(file)

    });
    gameBoy.loadRom(game);
  })();