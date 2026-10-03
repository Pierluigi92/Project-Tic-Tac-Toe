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
  return { getBoard, nextMove, winnerCheck, checkOccupiedCells };
}

function createPlayer(name, symbol) {
  return { name, symbol };
}

function gameController() {
  const chessBoard = gameBoard();
  const playerX = createPlayer("Gigi", "x");
  const playerO = createPlayer("Luca", "o");
  const listPlayer = [playerX, playerO];
  let currentPlayerIndex = 0;
  let gameOver = false;
  function playRound(position) {
    function returnGetBoard() {
      const board = chessBoard.getBoard();
      return board;
    }
    if (gameOver) {
      return {
        success: false,
        message: "Game over!",
      };
    }
    const currentPlayer = listPlayer[currentPlayerIndex];
    const symbol = currentPlayer.symbol;
    const moveAccepted = chessBoard.nextMove(position, symbol);
    if (moveAccepted.success === false) {
      return moveAccepted;
    }
    const winnerControl = chessBoard.winnerCheck();
    if (winnerControl !== null) {
      gameOver = true;
      return {
        success: true,
        message: `${currentPlayer.name} wins, with the symbol: ${symbol}`,
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
      message: `${listPlayer[currentPlayerIndex].name} it's your turn!`,
    };
  }
  return { playRound, returnGetBoard };
}
