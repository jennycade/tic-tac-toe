// GAMEBOARD

const gameboard = (() => {
  let gameboard = ['_', '_', '_', '_', '_', '_', '_', '_', '_'];

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
    // console.log('Starting game (gameboard).');
    
  }
  const resetGame = () => {
    // console.log('Resetting game (gameboard)');
    gameboard = ['_', '_', '_', '_', '_', '_', '_', '_', '_']; // this is going through to render but not markSquare. I'm missing something about scope here.
    renderGameboard();
  }

  const renderGameboard = () => {
    for (i=0; i<gameboard.length; i++) {
      // set text to value in gameboard
      cells[i].textContent = gameboard[i];
    }
  }

  const markSquare = (player, square) => {
    // console.log(`Marking square ${square} (gameboard)`);
    // check to make sure it's not already marked
    if (getSquareOpen(square)) {
      gameboard[square] = player;
    } else {
      game.displayMessage('That space has already been played.');
      return false;
    }
    renderGameboard();
    return true;
  }

  const checkForWinner = () => {
    // console.log('Checking for winner (gameboard)');
    // TODO (maybe): also check for draw before board is filled
    lines = getLines();
    for (i=0; i<lines.length; i++) {
      if (lines[i] === 'XXX' || lines[i] === 'OOO') {
        // console.log('We have a winner!');
        // console.log(lines[i][0]);
        return lines[i][0]; // TODO: return player display name
      }
    }
    if (gameboard.includes('_')) {
      // game's not done yet
      return false;
    } else {
      return 'draw';
    }
  }

  const getLines = () => { // TODO replace blanks with _
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
    return lines;
  }

  const getSquareOpen = (square) => {
    return gameboard[square] === '_';
  }


  return {
    gameboard, // for debugging, delete later
    markSquare,
    checkForWinner,
    startGame,
    resetGame,
    getSquareOpen,
    getLines,
  };
})();

const Player = (name, playerName) => {
  // functions go here
  const playMove = (square) => {
    // console.log('Playing move (player)');
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
        playedMove = Player(name, playerName).playMove(square)
        // timeout only delays rendering the mark on the gameboard; not switching player or checking for winner.
        // playedMove = setTimeout(() => {
        //   return Player(name, playerName).playMove(square)
        // }, 1000);
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

const SmartAIPlayer = (name, playerName) => {
  const {getName} = Player(name, playerName);
  const {getPlayerName} = Player(name, playerName);

  const getNextMoveWinPatterns = (mark) => {
    return [
      mark + mark + '_',
      mark + '_' + mark,
      '_' + mark + mark,
    ];
  }
  const getSquare = (line, cell) => {
    // This should be in gameboard, no?
    const squareValues = {
      0: [0, 1, 2],
      1: [0, 4, 8],
      2: [0, 3, 6],
      3: [3, 4, 5],
      4: [6, 4, 2],
      5: [6, 7, 8],
      6: [1, 4, 7],
      7: [2, 5, 8],
    };
    return squareValues[line][cell];
  }
  const arraysAreEqual = (arr1, arr2) => {
    // I know they're the same length and non-nested, so skipping those cases
    for (let i=0; i<arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
  const playMove = () => {
    // get the lay of the land
    const lines = gameboard.getLines();
    let squareToPlay;

    // 0. first move: choose corner
    if (arraysAreEqual(lines, ['___','___','___','___','___','___','___','___'])) {
      console.log('First move. Choose a corner.');
      const corners = [0,2,6,8];
      squareToPlay = corners[Math.floor(Math.random()*4)];
    } else {
      nextMoveWins = getNextMoveWinPatterns(name);
      // 1. check for two of own mark + blank
      for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (nextMoveWins.includes(line)) {
          console.log('AI found a way to win!');
          // where's the blank?
          const cell = line.search('_');
          squareToPlay = getSquare(i, cell);
          console.log('Playing square ' + squareToPlay);
        }
      }
    }
    

    // 2. check for two of opponents' mark + blank

    // 3. choose center if open


    // 4. play randomly
    if (!squareToPlay) {
      console.log('No clear next move. Just play randomly.');
      const playedMove = RandomAIPlayer(name, playerName).playMove();
      return playedMove;
    } else {
      const playedMove = Player(name, playerName).playMove(squareToPlay);
      return playedMove;
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
    // console.log('Starting game (game).');
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
        // console.log('Making a human player');
        break;
      case 'randomAI':
        // player = RandomAIPlayer(mark, name);
        player = SmartAIPlayer(mark, name);
        // console.log('Making a random AI player');
        break;
      
    }
    return player;
  }

  const resetGame = () => {
    // cheater way: just refresh the page
    // console.log('Resetting the game');
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
    // console.log('Switching player (game)');
    if (currentPlayer === x) {
      currentPlayer = o;
    } else {
      currentPlayer = x;
    }
    currentPlayerNode.textContent = currentPlayer.getPlayerName();
  }

  const playMove = (square) => {
    // console.log('Playing move (game)');
    let playedMove = false;
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