// GAMEBOARD

const gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];

  // tie it to the DOM
  let cells = [];

  const startGame = () => {
    console.log('Starting game (gameboard).');
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
  const resetGame = () => {
    console.log('Resetting game (gameboard)');
    gameboard = ['', '', '', '', '', '', '', '', '']; // this is going through to render but not markSquare. I'm missing something about scope here.
    renderGameboard();
  }

  const renderGameboard = () => {
    for (i=0; i<gameboard.length; i++) {
      // set text to value in gameboard
      cells[i].textContent = gameboard[i];
    }
  }

  const markSquare = (player, square) => {
    console.log(`Marking square ${square} (gameboard)`);
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
    console.log('Checking for winner (gameboard)');
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
        console.log('We have a winner!');
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
    gameboard, // for debugging, delete later
    markSquare,
    checkForWinner,
    startGame,
    resetGame,
  };
})();

const Player = (name, playerName) => {
  // functions go here
  const playMove = (square) => {
    console.log('Playing move (player)');
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
  let x;
  let o;

  let playing = false;

  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    startGame();
  })

  const currentPlayerNode = document.getElementById('currentPlayer');
  const messageNode = document.getElementById('message');
  
  const startGame = () => {
    console.log('Starting game (game).');
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
    // who's first?
    currentPlayer = x;
    currentPlayerNode.textContent = currentPlayer.getName();

    gameboard.startGame();
    togglePlayButton('reset');
    playing = true;
  }

  const resetGame = () => {
    // cheater way: just refresh the page
    console.log('Resetting the game');
    gameboard.resetGame();
    togglePlayButton('play');
  }

  const togglePlayButton = (changeTo) => {
    if (changeTo === 'reset') {
      playButton.textContent = 'Reset';
      playButton.addEventListener('click', resetGame);
      // TODO: actually reset the game
    } else if (changeTo === 'play') {
      playButton.textContent = 'Play';
      playButton.addEventListener('click', startGame);
    }
  }
  
  const switchPlayer = () => {
    console.log('Switching player (game)');
    if (currentPlayer === x) {
      currentPlayer = o;
    } else {
      currentPlayer = x;
    }
    currentPlayerNode.textContent = currentPlayer.getName();
  }

  const playMove = (square) => {
    console.log('Playing move (game)');
    let playedMove;
    displayMessage('');
    if (playing) {
      playedMove = currentPlayer.playMove(square);

      const outcome = gameboard.checkForWinner();
      if (outcome) {
        playing = false;
        endGame(outcome);
      }
    }
    if (playedMove) {
      switchPlayer();
    }
    
  }
  const displayMessage = (message) => {
    messageNode.textContent = message;
  }

  const endGame = (outcome) => {
    message = 'Game over. '
    if (outcome === 'draw') {
      message += 'It\'s a draw.';
    } else {
      message += `${outcome === 'X' ? x.getPlayerName() : o.getPlayerName()} won.`;
    }
    displayMessage(message);

  }

  return {
    playMove,
    displayMessage,
  }; // public functions
})();