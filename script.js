// GAMEBOARD

const gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];

  // tie it to the DOM
  let cells = [];
  for (i=0; i<gameboard.length; i++) {
    // grab the cell for later use
    const cell = document.getElementById(i.toString())
    cells.push(cell);
    // hook it up
    cell.addEventListener('click', (e) => {
      game.playMove(parseInt(e.target.id));
    });
  }

  const startGame = () => {
    console.log('Starting game (gameboard).');
    
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
        console.log(lines[i][0]);
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

  const getSquareOpen = (square) => {
    return gameboard[square] === '';
  }


  return {
    gameboard, // for debugging, delete later
    markSquare,
    checkForWinner,
    startGame,
    resetGame,
    getSquareOpen,
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

const RandomAIPlayer = (name, playerName) => {
  // TODO: make the player play on its own, not only when a square is clicked.
  // is making a new Player for each function the best thing? Or can I use Object.assign() but still overwrite playMove()? 
  const {getName} = Player(name, playerName);
  const {getPlayerName} = Player(name, playerName);
  const playMove = () => {
    let playedMove = false;
    // pick randomly until a square is open, then play that.
    while (!playedMove) {
      square = Math.floor(Math.random()*9);
      if (gameboard.getSquareOpen(square)) {
        // play it
        playedMove = setTimeout(Player(name, playerName).playMove(square), 2000);
        return playedMove;
      }
    }
  }
  return {
    playMove,
    getName,
    getPlayerName,
  }
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
    const player1type = document.getElementById('player1AI').checked ? 'randomAI' : 'person';
    const player2type = document.getElementById('player2AI').checked ? 'randomAI' : 'person';
    
    x = createPlayer('X', player1name, player1type);
    o = createPlayer('O', player2name, player2type);
    
    // who's first?
    currentPlayer = x;
    currentPlayerNode.textContent = currentPlayer.getPlayerName();

    gameboard.startGame();
    togglePlayButton('reset');
    playing = true;
  }

  const createPlayer = (mark, name, type) => {
    let player;
    switch(type) {
      case 'person':
        player = Player(mark, name);
        console.log('Making a human player');
        break;
      case 'randomAI':
        player = RandomAIPlayer(mark, name);
        console.log('Making a random AI player');
        break;
    }
    return player;
  }

  const resetGame = () => {
    // cheater way: just refresh the page
    console.log('Resetting the game');
    togglePlayButton('play'); // this isn't executing second time?
    playing = false;
    gameboard.resetGame();
    
  }

  const togglePlayButton = (changeTo) => {
    if (changeTo === 'reset') {
      playButton.textContent = 'Reset';
      playButton.addEventListener('click', resetGame);
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
    currentPlayerNode.textContent = currentPlayer.getPlayerName();
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
      if (playedMove) {
        switchPlayer();
      }
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