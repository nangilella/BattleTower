(function() {

	var devmod = true;
	var timeToPlay = 15000;
	
  	window.onload = function() {
    board.init();
    menu.init();
    game.init();

    var number = 2;//by default
    var idGame;
    var glass = document.getElementById('glass');
	var menudev = document.getElementById('menudev');
	var startdev = document.getElementById('startdev');
	var startbutton = document.getElementById('startbutton');

	if (devmod == true) {
	console.log("devmod");
	glass.hidden = true;
	menudev.hidden = false;
	startdev.hidden = false;
	startbutton.onclick = function() {
			 startItems();
		}
	startEditing();

	} else {
	console.log("pas devmod");
	network.onCmd('youAreFirst', function() {
      number = 1;
      menu.setPlayerNumber(1);
    });

    network.onCmd('startEditing', function(data) {
      idGame = data.idGame;
      menu.setIdGame(idGame)
      glass.hidden = true;
      startEditing();
    });

    network.onCmd('endEditing', function(data) {
      startGame(data);
    });
}

    function startEditing() {
      menu.setEditing(true);
	if (devmod == true) {
      
	}else{
		menu.startTempo(timeToPlay/1000);
	
      setTimeout(function() {
        menu.setEditing(false);
        var myboard = [];
        var items = board.getItems();
        for(var i=0; i<items.length; i++) {
          myboard.push(items[i].getItem());
        }
        network.send({cmd: "endEditing", idGame: idGame, num: number, board: myboard});
      },timeToPlay);
	}
    }

	function startItems() {
		var items = board.getItems();
     	 for(var i=0; i<items.length; i++) {
        items[i].setState("Running");
      }
	}
      
    function startGame(data) {
      console.log(data);
      //add items' other gamer
      if(number == 2) {
        for(var i=0; i<data.boardP1.length; i++) {
          board.addItem(data.boardP1[i]);
        }
      } else {
        for(var i=0; i<data.boardP2.length; i++) {
          board.addItem(data.boardP2[i]);
        }
      }
      //run my items
      startItems();
    }

  }

})();
