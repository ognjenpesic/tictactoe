const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status-message');
const nextRoundBtn = document.getElementById('next-round-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const modal = document.getElementById('history-modal');
const showHistoryBtn = document.getElementById('show-history-btn');
const closeModal = document.querySelector('.close-modal');
const historyContainer = document.getElementById('history-list-container');
const clearBtn = document.getElementById('clear-history-btn');

let currentPlayer = "X";
let roundStarter = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[cellIndex] !== "" || !gameActive) return;

    gameState[cellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winCondition = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i];
        let a = gameState[condition[0]];
        let b = gameState[condition[1]];
        let c = gameState[condition[2]];

        if (a === '' || b === '' || c === '') continue;

        if (a === b && b === c) {
            roundWon = true;
            winCondition = condition;
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = `Player ${currentPlayer} Wins!`;
        winCondition.forEach(index => cells[index].classList.add('winning-cell'));
        
        if (currentPlayer === "X") {
            scoreX++;
            scoreXElement.innerText = scoreX;
        } else {
            scoreO++;
            scoreOElement.innerText = scoreO;
        }
        
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusText.innerText = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
}

function saveMatchToHistory() {
    if (scoreX === 0 && scoreO === 0) return;

    const now = new Date();
    const dateTime = now.toLocaleString();
    const entry = `X    ${scoreX} - ${scoreO}    O | ${dateTime}`;

    let history = JSON.parse(localStorage.getItem('ticTacToeHistory')) || [];
    history.unshift(entry);
    localStorage.setItem('ticTacToeHistory', JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('ticTacToeHistory')) || [];
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p style="text-align:center; opacity:0.5;">No games played yet.</p>';
        return;
    }

    historyContainer.innerHTML = history.map(item => {
        const [scorePart, datePart] = item.split(' | ');
        return `
            <div class="history-block">
                <div class="history-info">
                    <span class="scores">${scorePart}</span>
                    <span class="date">${datePart}</span>
                </div>
                <div class="status-tag">Completed</div>
            </div>
        `;
    }).join('');
}

function resetBoard() {
    roundStarter = roundStarter === "X" ? "O" : "X";
    currentPlayer = roundStarter;
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.innerText = `Player ${currentPlayer} Starts Turn`;
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('winning-cell');
    });
}

function resetFullGame() {
    saveMatchToHistory();
    scoreX = 0;
    scoreO = 0;
    scoreXElement.innerText = "0";
    scoreOElement.innerText = "0";
    roundStarter = "O"; 
    resetBoard();
}

showHistoryBtn.onclick = () => {
    displayHistory();
    modal.style.display = "block";
}

closeModal.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

clearBtn.onclick = () => {
    localStorage.removeItem('ticTacToeHistory');
    displayHistory();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
nextRoundBtn.addEventListener('click', resetBoard);
resetGameBtn.addEventListener('click', resetFullGame);
