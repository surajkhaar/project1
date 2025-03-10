document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".box");
    const turnBox = document.getElementById("turn");
    const results = document.getElementById("results");
    const playAgainButton = document.getElementById("play-again");
    const clickSound = document.getElementById("click-sound");
    const winSound = document.getElementById("win-sound");
    const gameModeButtons = document.querySelector(".game-mode");
    const playFriendButton = document.getElementById("play-friend");
    const playAIButton = document.getElementById("play-ai");

    let currentPlayer = "X";
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let isPlayingWithAI = false;
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    playFriendButton.addEventListener("click", () => startGame(false));
    playAIButton.addEventListener("click", () => startGame(true));

    function startGame(playWithAI) {
        isPlayingWithAI = playWithAI;
        gameModeButtons.style.display = "none";
        document.querySelector(".main-grid").style.display = "grid";
        document.querySelector(".turn-container").style.display = "flex";
        playAgainButton.style.display = "block";
        restartGame();
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive || (isPlayingWithAI && currentPlayer === "O")) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickSound.play();

        checkResult();
        if (gameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            turnBox.textContent = currentPlayer;
            if (isPlayingWithAI && currentPlayer === "O") {
                setTimeout(computerMove, 500); // Adding a slight delay for better UX
            }
        }
    }

    function computerMove() {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = "O";
                let score = minimax(gameState, 0, false);
                gameState[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        gameState[bestMove] = "O";
        boxes[bestMove].textContent = "O";
        clickSound.play();

        checkResult();
        if (gameActive) {
            currentPlayer = "X";
            turnBox.textContent = currentPlayer;
        }
    }

    function minimax(state, depth, isMaximizing) {
        let scores = {
            "O": 1,
            "X": -1,
            "tie": 0
        };

        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < state.length; i++) {
                if (state[i] === "") {
                    state[i] = "O";
                    let score = minimax(state, depth + 1, false);
                    state[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < state.length; i++) {
                if (state[i] === "") {
                    state[i] = "X";
                    let score = minimax(state, depth + 1, true);
                    state[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                return a;
            }
        }

        if (!gameState.includes("")) {
            return "tie";
        }
        return null;
    }

    function checkResult() {
        let winner = checkWinner();
        if (winner !== null) {
            if (winner === "tie") {
                results.textContent = "It's a Draw!";
            } else {
                results.textContent = `Player ${winner} Wins!`;
            }
            gameActive = false;
            winSound.play();
            return;
        }
    }

    function highlightWinningBoxes(winCondition) {
        winCondition.forEach(index => {
            boxes[index].classList.add('win');
        });
    }

    function restartGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        results.textContent = "";
        boxes.forEach(box => {
            box.textContent = "";
            box.classList.remove('win');
        });
        turnBox.textContent = currentPlayer;
    }

    boxes.forEach(box => box.addEventListener("click", handleCellClick));
    playAgainButton.addEventListener("click", restartGame);
});
