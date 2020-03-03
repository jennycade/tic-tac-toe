// GAMEBOARD

const gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];
  // let numRows = 3; // in case I want to expand it later

  // tie it to the DOM
  let cells = [];

  const startGame = () => {
    for (i=0; i<gameboard.length; i++) {
      // grab the cell for later use
      const cell = document.getElementById(i.toString())
      cells.push(cell);
      // hook it up
      cell.addEventListener('click', (e) => {
        game.playMove(parseInt(e.target.id));
      });
    }
  }

  // functions go here
  const renderGameboard = () => {
    for (i=0; i<gameboard.length; i++) {
      // set text to value in gameboard
      cells[i].textContent = gameboard[i];
    }
  }

  const markSquare = (player, square) => {
    // check to make sure it's not already marked
    if (gameboard[square] === '') {
      gameboard[square] = player;
    } else {
      game.displayMessage('That space has already been played.');
      return false;
    }
    renderGameboard();
    return true;
  }

  const checkForWinner = () => {
    // TODO (maybe): also check for draw before board is filled
    const lines = [
      gameboard[0] + gameboard[1] + gameboard[2],
      gameboard[0] + gameboard[4] + gameboard[8],
      gameboard[0] + gameboard[3] + gameboard[6],
      gameboard[3] + gameboard[4] + gameboard[5],
      gameboard[6] + gameboard[4] + gameboard[2],
      gameboard[6] + gameboard[7] + gameboard[8],
      gameboard[1] + gameboard[4] + gameboard[7],
      gameboard[2] + gameboard[5] + gameboard[8],
    ];
    for (i=0; i<lines.length; i++) {
      if (lines[i] === 'XXX' || lines[i] === 'OOO') {
        return lines[i][0]; // TODO: return player display name
      }
    }
    if (gameboard.join('').length < 9) {
      // game's not done yet
      return false;
    } else {
      return 'draw';
    }
  }


  return {
    markSquare,
    checkForWinner,
    startGame,
  };
})();

const Player = (name, playerName) => {
  // functions go here
  const playMove = (square) => {
    return gameboard.markSquare(name, square);
  }
  const getName = () => {
    return name;
  }
  const getPlayerName = () => {
    return playerName;
  }
  return {
    playMove,
    getName,
    getPlayerName,
  }; // public functions
}

const game = (() => {
  let x = Player('X', 'Player 1');
  let o = Player('O', 'Player 2');

  let playing = false;
  let gameOver = false;
  let currentPlayer = x;

  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    startGame();
  })

  const currentPlayerNode = document.getElementById('currentPlayer');
  const messageNode = document.getElementById('message');
  currentPlayerNode.textContent = currentPlayer.getName();
  
  const startGame = () => {
    // set names
    let player1name = document.getElementById('player1').value;
    let player2name = document.getElementById('player2').value;
    if (player1name === player2name) {
      player1name += ' (X)';
      player2name += ' (O)';
    }
    // create players
    x = Player('X', player1name);
    o = Player('O', player2name);
    console.log('Let\'s play!');

    gameboard.startGame();
    playing = true;
  }
  
  const switchPlayer = () => {
    if (currentPlayer === x) {
      currentPlayer = o;
    } else {
      currentPlayer = x;
    }
    currentPlayerNode.textContent = currentPlayer.getName();
  }

  const playMove = (square) => {
    let playedMove;
    if (!gameOver) {
      playedMove = currentPlayer.playMove(square);

      const outcome = gameboard.checkForWinner();
      if (outcome) {
        gameOver = true;
        if (outcome === 'draw') {
          displayMessage('Game over. It\'s a draw.');
        } else {
          displayMessage(`Game over. ${outcome === 'X' ? x.getPlayerName() : o.getPlayerName()} won.`)
        }
      }
    }
    if (playedMove) {
      switchPlayer();
    }
    
  }
  const displayMessage = (message) => {
    messageNode.textContent = message;
  } 

  return {
    playMove,
    displayMessage,
  }; // public functions
})();