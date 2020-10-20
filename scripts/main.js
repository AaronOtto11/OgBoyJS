(function() {
    var gameBoy = require("./ogboy");
    var game;
    const fileSelector = document.getElementById('file-selector');
    fileSelector.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      game = reader.readAsArrayBuffer(file)

    });
    window.gameBoy = new gameBoy(game);
  })();