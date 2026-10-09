function gameBoard() {
  let chessBoard = [null, null, null, null, null, null, null, null, null];

  function getBoard() {
    return chessBoard.slice();
  }

  function nextMove(position, symbol) {
    if (symbol !== "x" && symbol !== "o") {
      return {
        success: false,
        message: "Symbol not valid!",
      };
    }

    if (Number.isInteger(position) && position >= 0 && position <= 8) {
      if (chessBoard[position] !== null) {
        return {
          success: false,
          message: "Position occupied!",
        };
      } else {
        chessBoard.splice(position, 1, symbol);
        return {
          success: true,
          message: "Operation successful!",
        };
      }
    } else {
      return {
        success: false,
        message: "Position not valid!",
      };
    }
  }

  function winnerCheck() {
    const combinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of combinations) {
      const [a, b, c] = combo;
      if (
        chessBoard[a] &&
        chessBoard[a] === chessBoard[b] &&
        chessBoard[a] === chessBoard[c]
      ) {
        return chessBoard[a];
      }
    }
    return null;
  }

  function checkOccupiedCells() {
    for (let box of chessBoard) {
      if (box === null) {
        return false;
      }
    }
    return true;
  }

  function clearChessBoard() {
    chessBoard = [null, null, null, null, null, null, null, null, null];
  }

  return {
    getBoard,
    nextMove,
    winnerCheck,
    checkOccupiedCells,
    clearChessBoard,
  };
}

function createPlayer(name, symbol) {
  return { name, symbol };
}

const chessBoard = gameBoard();

function gameController(nameX, nameO) {
  const playerX = createPlayer(nameX, "x");
  const playerO = createPlayer(nameO, "o");
  const listPlayer = [playerX, playerO];
  let currentPlayerIndex = 0;
  let playerXScore = 0;
  let playerOScore = 0;
  let gameOver = false;

  if (playerX.name === undefined || playerO.name === undefined) {
    playerX.name = "Player X";
    playerO.name = "Player O";
  }

  function returnGetBoard() {
    const board = chessBoard.getBoard();
    return board;
  }

  function returnPlayersName() {
    return {
      playerX: playerX.name,
      playerO: playerO.name,
    };
  }

  function returnCurrentPlayer() {
    const currentPlayer = listPlayer[currentPlayerIndex];
    return currentPlayer.name;
  }

  function returnScores() {
    return {
      playerXScore: playerXScore,
      playerOScore: playerOScore,
    };
  }

  function playRound(position) {
    const currentPlayer = listPlayer[currentPlayerIndex];
    if (gameOver) {
      return {
        success: false,
        message: "Game over!",
      };
    }

    const symbol = currentPlayer.symbol;
    const moveAccepted = chessBoard.nextMove(position, symbol);

    if (moveAccepted.success === false) {
      return moveAccepted;
    }

    const winnerControl = chessBoard.winnerCheck();

    if (winnerControl !== null) {
      gameOver = true;
      if (winnerControl === "x") {
        playerXScore++;
        playerXScoreMessage.textContent = playerXScore;
      } else if (winnerControl === "o") {
        playerOScore++;
      }
      return {
        success: true,
        message: `${currentPlayer.name} wins!`,
      };
    }

    const boardFull = chessBoard.checkOccupiedCells();

    if (boardFull) {
      gameOver = true;
      return {
        success: true,
        message: "The game ended in a tie!",
      };
    }

    if (currentPlayerIndex === 0) {
      currentPlayerIndex = 1;
    } else {
      currentPlayerIndex = 0;
    }

    return {
      success: true,
    };
  }

  function restart() {
    currentPlayerIndex = 0;
    gameOver = false;
  }

  return {
    playRound,
    returnGetBoard,
    returnScores,
    returnPlayersName,
    returnCurrentPlayer,
    restart,
  };
}

const allBox = document.querySelectorAll("[data-index]");
const playerXScoreMessage = document.querySelector(".playerX-score");
const playerOScoreMessage = document.querySelector(".playerO-score");
let game = gameController();
const gameMessage = document.querySelector(".game-message");

function render() {
  const board = game.returnGetBoard();
  const score = game.returnScores();
  const name = game.returnPlayersName();
  const currentPLayer = game.returnCurrentPlayer();

  allBox.forEach((box, index) => {
    box.textContent = board[box.dataset.index];
  });
  gameMessage.textContent = `${currentPLayer} it's your turn!`;
  playerXScoreMessage.textContent = `${name.playerX}'s score:
  ${score.playerXScore}`;
  playerOScoreMessage.textContent = `${name.playerO}'s score:
  ${score.playerOScore}`;
}

const containerChessboard = document.querySelector(".container-chessBoard");

containerChessboard.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const move = Number(e.target.getAttribute("data-index"));
    const moveResult = game.playRound(move);
    render();
    gameMessage.textContent = moveResult.message;
  }
});

const newGameButton = document.querySelector(".btn-new-game");

newGameButton.addEventListener("click", () => {
  let nameX = document.getElementById("playerX").value.trim();
  let nameO = document.getElementById("playerO").value.trim();
  if (nameX === "" || undefined) {
    nameX = "Player X";
  }
  if (nameO === "" || undefined) {
    nameO = "Player O";
  }
  game = gameController(nameX, nameO);
  chessBoard.clearChessBoard();
  render();
});

const restartButton = document.querySelector(".btn-restart");

restartButton.addEventListener("click", () => {
  chessBoard.clearChessBoard();
  game.restart();
  gameMessage.textContent = "";
  render();
});

render();
