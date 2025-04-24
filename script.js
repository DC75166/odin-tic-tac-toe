const gameBoard = (() => {

  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  }
  
  const setSquare = (index,marker) => {
    if(board[index] === ""){
      board[index] = marker;
      return true;
    }
    return false;
  }

   return {getBoard,resetBoard,setSquare};
}) ();

const player = ( name, marker ) =>({name, marker});

const gameController = (() => {

 let currentPlayer, player1, player2;
 let gameOver = false;

 const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const startGame = (name1, marker1, name2, marker2) => {
  if(marker1 === marker2){
    displayController.setStatus("Markers must be different");
    return;
  }

  if(name1 == name2){
    displayController.setStatus("Player names should be different");
    return;
  }

  player1 = player(name1 || "player1", marker1);
  player2 = player(name2 || "player2", marker2);
  currentPlayer = player1;
  gameOver = false;
  gameBoard.resetBoard();
  displayController.render();
  displayController.setStatus(`Current turn: ${currentPlayer.name} (${currentPlayer.marker})`);

};

const playRound = (index) => {
  if(gameOver||!currentPlayer) return;

  const success = gameBoard.setSquare(index,currentPlayer.marker);
  if(!success) return;

  if(checkWinner()){
    displayController.setStatus(`${currentPlayer.name} wins!`);
    gameOver = true;
    return;
  }

  if(!gameBoard.getBoard().includes("")){
    displayController.setStatus("Its a tie!");
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === player1 ? player2 : player1;
  displayController.setStatus(`Current turn: ${currentPlayer.name} (${currentPlayer.marker})`);
}

const checkWinner = () => {
  const board = gameBoard.getBoard();
  return winningCombos.some(combo => 
    combo.every(i => board[i] === currentPlayer.marker)
  );
};

const restartGame = () => {
  if (!player1 || !player2) return;
  gameBoard.resetBoard();
  currentPlayer = player1;
  gameOver = false;
  displayController.render();
  displayController.setStatus(`Current turn: ${currentPlayer.name} (${currentPlayer.marker})`);
};

return { startGame, playRound, restartGame };
}) ();

const displayController = (() => {
  const boardDiv = document.getElementById("board");
  const statusDiv = document.getElementById("status");
  const restartBtn = document.getElementById("restartBtn");
  const startBtn = document.getElementById("startBtn");
  const name1Input = document.getElementById("player1Name");
  const marker1Input = document.getElementById("player1Marker");
  const name2Input = document.getElementById("player2Name");
  const marker2Input = document.getElementById("player2Marker");

 
  const render = () => {
    boardDiv.innerHTML = "";
    const board = gameBoard.getBoard();

    board.forEach((value, index) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.textContent = value;
      square.addEventListener("click", () => {
        gameController.playRound(index);
        render();
      });
      boardDiv.appendChild(square);
    });
  };

  const setStatus = (text) => {
    statusDiv.textContent = text;
  };

  restartBtn.addEventListener("click", () => {
    gameController.restartGame();
  });

  startBtn.addEventListener("click", () => {
    const name1 = name1Input.value.trim();
    const marker1 = marker1Input.value.trim().toUpperCase();
    const name2 = name2Input.value.trim();
    const marker2 = marker2Input.value.trim().toUpperCase();

    gameController.startGame(name1, marker1, name2, marker2);
  });

  return {render, setStatus};
}) ();