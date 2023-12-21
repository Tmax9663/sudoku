const body = document.body;
const sudokuGrid = document.getElementById("sudoku-grid");
const newGameModal = document.querySelector('#newGameModal');
const btnHint = document.querySelector('#btnHint');
const btnReplay = document.querySelector('#btnReplay');
const btnTitle = document.querySelector('#btnTitle');
const speakerSwitch = document.querySelector('#speakerSwitch');
const logo = document.querySelector('#logo');
const aboutModal = document.querySelector('#aboutModal');
const userScores = document.querySelector('#userScores');
const userName = document.querySelector('#user-name')
const topScores = document.querySelector('#topScores');
const btnUserScores = document.querySelector('#btnUserScores')
const btnWorldRankings = document.querySelector('#btnWorldRankings');
const aboutContent = document.querySelector('#aboutContent');
const highScoreModal = document.querySelector('#highScoreModal');
const userInputModal = document.querySelector('#userInputModal');
const themeModal=document.querySelector('#themeModal');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');
const hamburger = document.querySelector('#hamburger');
const theme = document.querySelector('#theme');
const maxHintCount = 5; //Specify maximum hintCount;
const topLimit = 3; // Specify scores board display Top 3 only
const boxSize = 3; // Specify the boxSize of the array (e.g., 3x3 grid)
//const assetFolder='https://cdn.glitch.global/ca5aa811-8109-4d0b-bfe3-c16115da55f4';
const assetFolder = '../resources';
const url = '.';
let sudokuPuzzle, tempSudokuPuzzle, originalGrid, newGrid;
let startTime;
let timerInterval;
let currentNumber = '1';
let currentId;
let newGame = false;
let inp_click = false;
let isWin = false;
let highlight = false;
let soundOn = true;
let autoSolved = false;
let randomDifficulty;
let levelState;
let highScoresLoaded;
let currentGrid = [];
let emptyCells = [];
let hintCells = [];
let tempHintCells = [];
let hintCount;
let solving = false; // A flag to track whether the solving process is active
let history=[];
let playDelay = 50;

const backgroundColorPicker=document.querySelector('#backgroundColorPicker');
const foregroundColorPicker=document.querySelector('#foregroundColorPicker');
const themeColorPicker=document.querySelector('#themeColorPicker');
const themeName=document.querySelector('#theme-name');
const themeColorSelector=document.querySelector('#themeColorSelector');
const saveButton = document.getElementById('saveButton');
let currentThemeColor=localStorage.getItem('currentThemeColor')||'';

window.addEventListener('load', () => {
    initColor();
    sidebar.style.left = '-100vw'
    const theme=localStorage.getItem('sudokuTheme')||'darkTheme';
    body.classList.add(theme);
    highScoreModal.classList.add(theme);
    newGameModal.classList.add(theme);
    userInputModal.classList.add(theme);
    aboutModal.classList.add(theme);
    themeModal.classList.add(theme);
    userName.classList.add(theme);
    sidebar.classList.add(theme);
    loadHighScores();
    btnHint.disabled = true;
    btnHint.style.color = '#666';
    btnReplay.disabled = true;
    btnReplay.style.color = '#666';
    musicPlayer.playTrack('background');
    for (let i = 1; i <= 9; i++) {
        const div = document.createElement("div");
        div.className = "btnNumber";
        div.innerText = i; 
        document.querySelector("#btndiv").appendChild(div);
        document.querySelectorAll(".btnNumber").forEach(btn => {
            btn.addEventListener("click", (e) => {
                currentNumber = e.target.textContent;
                musicPlayer.playTrack('select');
                if (inp_click) {
                    document.querySelectorAll('.sudoku-input').forEach(p=>{
                        p.style.backgroundColor='#333';
                    })
                    let clickNow = document.querySelector('#' + currentId);
                    const pos = currentId.split('_');
                    const row = parseInt(pos[1]);
                    const col = parseInt(pos[2]);
                    clickNow.textContent = currentNumber;
                    history.push({
                        row,
                        col,
                        currentNumber
                    })
                    hintCells = hintCells.filter(p => !(p[0] === row && p[1] === col));
                    inp_click = false;
                }
                e.target.style.backgroundColor = "#f00";
            })
            btn.addEventListener("mouseover", (e) => {
                e.target.style.backgroundColor = "#888";
            })
            btn.addEventListener("mouseleave", (e) => {
                e.target.style.backgroundColor = "var(--theme-color)";
            })
            }
           
        )
    }
    aboutContent.innerHTML = `<div> 
        Welcome to the Sudoku Game App! <br>
        This app allows you to play Sudoku puzzles and challenge yourself to solve them. <br>
        You can also save your high scores and puzzle grids to keep track of your progress.<br>
        </div>
        <h3>Game Instructions</h3>
        <ul>
            <li> Click the "New Game" button to start a new Sudoku puzzle.</li>
            <li> Click on an empty cell to select it.</li>
            <li> Use the number buttons to input your guess.</li>
            <li> Click "Undo" to undo current move.</li>
            <li> Use the "Hint" button for a helpful hint on the next move.</li>
            <li> The timer will start when you begin a new game.</li>
            <li> Win the game by correctly filling the entire grid.</li>
        </ul>`;
})

// window.addEventListener('resize',()=>{
//     const numRows = 9;
//     const numCols = 9;
//     if(window.innerWidth<"300px") window.innerWidth="300px"
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;
//     const cellSize = Math.min(windowWidth / numCols, windowHeight / numRows);
//     console.log('resize',cellSize)
//     document.querySelectorAll("#sudoku-grid td").forEach(cell => {
//         cell.style.width = `${cellSize}px`;
//         // cell.style.height = `${cellSize*cell.offsetWidth/cell.offsetHeight}px`;
//         cell.style.height = `${cell.offsetWidth}px`;
//         cell.style.fontSize="18px";
//     })
// })

const undo=()=>{
    if(history.length){
        const undoStep=history[history.length-1];
        setNumAtCell(undoStep.row,undoStep.col,'');
        history.pop();
    }
}
const openThemeModal=()=>{
    loadThemeColor();
    themeModal.style.display="block";
}
const themeToggle = () => {
    if (body.classList.contains("darkTheme")) {
        highScoreModal.classList.remove("darkTheme");
        newGameModal.classList.remove("darkTheme");
        userInputModal.classList.remove("darkTheme");
        aboutModal.classList.remove("darkTheme");
        themeModal.classList.remove("darkTheme");
        userName.classList.remove('darkTheme');
        sidebar.classList.remove("darkTheme");
        body.classList.remove("darkTheme");
        highScoreModal.classList.add("lightTheme");
        newGameModal.classList.add("lightTheme");
        userInputModal.classList.add("lightTheme");
        aboutModal.classList.add("lightTheme");
        themeModal.classList.add("lightTheme");
        userName.classList.add('lightTheme');
        sidebar.classList.add("lightTheme");
        body.classList.add("lightTheme");
        theme.textContent = "DarkTheme"
        localStorage.setItem('sudokuTheme','lightTheme')
    } else {
        highScoreModal.classList.remove("lightTheme");
        newGameModal.classList.remove("lightTheme");
        userInputModal.classList.remove("lightTheme");
        aboutModal.classList.remove("lightTheme");
        themeModal.classList.remove("lightTheme");
        sidebar.classList.remove("lightTheme");
        userName.classList.remove('lightTheme');
        body.classList.remove("lightTheme");
        highScoreModal.classList.add("darkTheme");
        newGameModal.classList.add("darkTheme");
        userInputModal.classList.add("darkTheme");
        aboutModal.classList.add("darkTheme");
        themeModal.classList.add("darkTheme");
        userName.classList.add('darkTheme');
        sidebar.classList.add("darkTheme");
        body.classList.add("darkTheme");
        theme.textContent = "LightTheme"
        localStorage.setItem('sudokuTheme','darkTheme')
    }
    document.querySelectorAll("#sudoku-grid td").forEach(cell => {
        cell.classList.remove("highlight-row", "highlight-col", "highlight-row-light", "highlight-col-light");
    });
    closeMenu();
};

const toggleSidebar = () => {
    sidebar.style.left === '-100vw' ? sidebar.style.left = '0' : sidebar.style.left = '-100vw';
}

const closeMenu = () => {
    sidebar.style.left = '-100vw';
}

const showHint = () => {
    if (hintCells.length > 0 && hintCount > 0) {
        const randomHint = hintCells[generateRandomNumber(0, hintCells.length - 1)];
        const getInputElement = (row, col) => {
            const inputId = `inp_${row}_${col}`;
            return document.getElementById(inputId);
        }
        const inputElement = getInputElement(randomHint[0], randomHint[1]);
        inputElement.textContent = randomHint[2];
        inputElement.style.color = '#069eb6';
        hintCells = hintCells.filter(p => !(p[0] === randomHint[0] && p[1] === randomHint[1]));
        hintCount--;
        // reduce scores by 100
        btnHint.innerHTML = 'Hint ' + hintCount;
        if (hintCount === 0) {
            btnHint.disabled = true;
            btnHint.style.color = '#666';
        }
    }
}
// Function to start the game and timer
const startGame = (min, max, level) => {
    history=[];
    autoSolved = false;
    levelState = level;
    hintCount = maxHintCount;
    btnHint.disabled = false;
    btnHint.style.color = '#eee';
    btnHint.innerHTML = 'Hint ' + hintCount;
    btnReplay.disabled = false;
    btnReplay.style.color = '#eee';
    musicPlayer.pauseAll();
    if (soundOn) musicPlayer.playTrack('background');
    randomDifficulty = generateRandomNumber(min, max);
    newGrid = generateSudokuPuzzle(randomDifficulty);
    originalGrid = newGrid.originalGrid;
    sudokuPuzzle = newGrid.puzzleGrid;
    localStorage.setItem('grid', JSON.stringify(sudokuPuzzle));
    hintCells = newGrid.hintCells;
    tempHintCells = hintCells;
    generatePuzzle(originalGrid, sudokuPuzzle);
    document.getElementById("timer").style.visibility = "visible";
    document.querySelector('#btndiv').style.visibility = "visible";
    document.querySelector('#btnTitle').innerHTML = `Sudoku - [${levelState}]`;
    closeModal();
}
const startTimer = () => {
    newGame = true;
    startTime = new Date().getTime();
    updateTimer();
}
// Function to update the timer
const updateTimer = () => {
    const now = new Date().getTime();
    const elapsedTime = now - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const userScore = calculateUserScore(elapsedTime) - ((maxHintCount - hintCount) * 100);
    document.getElementById('user-score').textContent = userScore;
}
// Function to calculate the user's score based on elapsed time (example)
const calculateUserScore = (elapsedTime) => {
    // Assume elapsedTime is in milliseconds
    const seconds = Math.floor(elapsedTime / 1000); // Convert to seconds
    const baseScore = 10000; // Base score for completing the game
    // Calculate the user's score
    // Example: Lower time results in a higher score
    const userScore = baseScore - seconds;
    return userScore < 0 ? 0 : userScore; // Ensure the score is non-negative
}
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const replayPuzzle = () => {
    history=[];
    generatePuzzle(originalGrid, JSON.parse(localStorage.getItem('grid')));
    hintCells = tempHintCells;
    hintCount = maxHintCount;
    btnHint.disabled = false;
    btnHint.style.color = '#eee';
    btnHint.innerHTML = 'Hint ' + hintCount;
    btnReplay.disabled = false;
    btnReplay.style.color = '#eee';
    autoSolved = false;
}
// Generate a Sudoku grid
const generatePuzzle = (originalGrid, sudokuPuzzle) => {
    logo.classList.remove('solving');
    stopSolving();
    if (typeof (sudokuPuzzle) === 'undefined') return;
    sudokuGrid.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            cell.style.width="40px";
            if (sudokuPuzzle[i][j] !== 0) {
                cell.textContent = sudokuPuzzle[i][j];
            } else {
                cell.className = "sudoku-input";
                cell.id = `inp_${i}_${j}`;
                cell.textContent='';
            }
            row.appendChild(cell);
        }
        sudokuGrid.appendChild(row);
    }
    // Add event listeners to each <td> cell
    document.querySelectorAll("#sudoku-grid td").forEach(cell => {
        cell.style.height=cell.offsetWidth+"px";
        cell.addEventListener("click", (e) => {
            highlightCells(cell);
        });
        cell.addEventListener("dblclick", () => {
            highlight = !highlight;
        });
    });

    document.querySelectorAll(".sudoku-input").forEach(inp => {
        inp.addEventListener('click', (e) => {
             // clear backgroundcolor to normal
             document.querySelectorAll('.sudoku-input').forEach(p=>{
                p.style.backgroundColor='#333';
            })
            // set current cell to backgroundColor of
            e.target.style.backgroundColor="#e1e1e122";      
            musicPlayer.playTrack('move');
            currentId = e.target.id;
            inp_click = true;
        })
    });
    startTimer();
    timerInterval = setInterval(() => {
        if (newGame) updateTimer();
    }, 1000);
}

const createBoxArray = () => {
    const boxArray = [];
    for (let i = 0; i < boxSize; i++) {
        const subArray = [];
        for (let j = 0; j < boxSize; j++) {
            const innerArray = [];
            for (let x = 0; x < boxSize; x++) {
                for (let y = 0; y < boxSize; y++) {
                    innerArray.push(`${i * boxSize + x},${j * boxSize + y}`);
                }
            }
            subArray.push(innerArray);
        }
        boxArray.push(subArray);
    }
    return boxArray;
}

const highlightCells = (clickedCell) => {
    // Clear previous highlights
    document.querySelectorAll("#sudoku-grid td").forEach(cell => {
        cell.classList.remove("highlight-row", "highlight-col", "highlight-row-light", "highlight-col-light");
    });
    if (!highlight) return;
    // check current cell clicked
    const cellRow = Math.round(clickedCell.offsetTop / clickedCell.offsetHeight);
    const cellCol = Math.round(clickedCell.offsetLeft / clickedCell.offsetWidth)
    let boxRow = 0,
        boxCol = 0;
    if (cellRow > 2 && cellRow < 6) boxRow = 1;
    if (cellRow >= 6) boxRow = 2;
    if (cellCol > 2 && cellCol < 6) boxCol = 1;
    if (cellCol >= 6) boxCol = 2;
    const boxArray = createBoxArray();
    // Highlight the entire 3x3 box
    document.querySelectorAll("#sudoku-grid td").forEach(cell => {
        const rClick = Math.round(cell.offsetTop / cell.offsetHeight);
        const cClick = Math.round(cell.offsetLeft / cell.offsetWidth);
        if (boxArray[boxRow][boxCol].find(p => p === (`${rClick},${cClick}`))) {
            if (body.classList.contains("dark")) {
                cell.classList.add("highlight-row");
            } else {
                cell.classList.add("highlight-row-light");
            }
        }
    });
    // Highlight the entire row
    const rowCells = Array.from(clickedCell.parentElement.cells); // Convert to array
    rowCells.forEach(cell => {
        if (body.classList.contains("dark")) {
            cell.classList.add("highlight-row");
        } else {
            cell.classList.add("highlight-row-light");
        }
    });
    // Highlight the entire column
    const clickedColIndex = clickedCell.cellIndex;
    // console.log('click col',clickedCell.cellIndex)
    document.querySelectorAll("#sudoku-grid tr").forEach(row => {
        const cellInCol = row.cells[clickedColIndex];
        if (body.classList.contains("dark")) {
            cellInCol.classList.add("highlight-col");
        } else {
            cellInCol.classList.add("highlight-col-light");
        }
    });
}
// Check if the Sudoku grid is a valid solution
// Function to check if the given grid is a valid Sudoku solution
const isValidSolution = (grid) => {
    const size = grid.length;
    // Helper function to check if an array of numbers is valid (no duplicates)
    const isValidArray = (arr) => {
        const seen = new Set();
        for (const num of arr) {
            if (num !== 0 && seen.has(num)) {
                return false;
            }
            seen.add(num);
        }
        return true;
    }
    // Check rows and columns
    for (let i = 0; i < size; i++) {
        const row = [];
        const col = [];
        for (let j = 0; j < size; j++) {
            row.push(grid[i][j]);
            col.push(grid[j][i]);
        }
        if (!isValidArray(row) || !isValidArray(col)) {
            return false;
        }
    }
    // Check 3x3 subgrids
    for (let i = 0; i < size; i += 3) {
        for (let j = 0; j < size; j += 3) {
            const subgrid = [];
            for (let x = i; x < i + 3; x++) {
                for (let y = j; y < j + 3; y++) {
                    subgrid.push(grid[x][y]);
                }
            }
            if (!isValidArray(subgrid)) {
                return false;
            }
        }
    }
    currentGrid = grid;
    return true;
}
const generateValidSudokuGrid = () => {
    const size = 9;
    const grid = Array.from({
        length: size
    }, () => Array(size).fill(0));
    // Function to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    // Function to check if it's safe to place 'num' at (row, col)
    const isSafe = (row, col, num) => {
        // Check row and column
        for (let i = 0; i < size; i++) {
            if (grid[row][i] === num || grid[i][col] === num) {
                return false;
            }
        }
        // Check 3x3 subgrid
        const subgridStartRow = row - (row % 3);
        const subgridStartCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[subgridStartRow + i][subgridStartCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }
    // Function to fill the Sudoku grid using backtracking
    const fillGrid = () => {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col] === 0) {
                    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffleArray(nums);
                    for (let i = 0; i < nums.length; i++) {
                        const num = nums[i];
                        if (isSafe(row, col, num)) {
                            grid[row][col] = num;
                            if (fillGrid()) {
                                return true;
                            }
                            grid[row][col] = 0; // Backtrack
                        }
                    }
                    return false; // No valid number found, backtrack
                }
            }
        }
        return true; // All cells filled
    }
    // Start filling the grid from the top-left corner
    fillGrid();
    return grid;
}
const generateSudokuPuzzle = (difficulty) => {
    const size = 9;
    hintCells = [];
    const originalGrid = generateValidSudokuGrid(); // Generate a valid Sudoku grid
    const puzzleGrid = JSON.parse(JSON.stringify(originalGrid)); // Clone the original grid
    // Function to remove cells from the grid
    const removeCells = (difficulty) => {
        const cellsToRemove = Math.min(Math.max(difficulty, 0), size * size - 1);
        let cellsRemoved = 0;
        while (cellsRemoved < cellsToRemove) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            if (puzzleGrid[row][col] !== 0) {
                hintCells.push([row, col, puzzleGrid[row][col]]);
                puzzleGrid[row][col] = 0;
                cellsRemoved++;
            }
        }
    }
    removeCells(difficulty);
    return {
        originalGrid,
        puzzleGrid,
        hintCells
    };
}
// Function to check if the player has won the game
const autoCheckWin = () => {
    const sudokuGrid = document.getElementById("sudoku-grid");
    const rows = sudokuGrid.getElementsByTagName("tr");
    const grid = [];
    currentGrid = [];
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        const row = [];
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (!parseInt(cell.textContent) || isNaN(parseInt(cell.textContent)) || parseInt(cell.textContent) < 1 || parseInt(cell.textContent) > 9) {
                return false; // Invalid input
            }
            row.push(Number(cell.textContent));
        }
        grid.push(row);
    }
    return isValidSolution(grid);
}
// Function to continuously check for win
const checkForAutoWin = () => {
    isWin = autoCheckWin();
    if (isWin && newGame) {
        // alert("Congratulations! You've solved the Sudoku puzzle!");
        blinkBoard();
        newGame = false;
        isWin = false;
        if (autoSolved) logo.classList.remove('solving');
        if (!autoSolved) {
            musicPlayer.pauseAll();
            musicPlayer.playTrack('winning');
            openModal();
        }
    }
}

const blinkBoard = () => {
    document.querySelectorAll(".sudoku-input").forEach(inp => {
        inp.className = "sudoku-input highlight-win";
    });
}
// Call the checkForAutoWin function at an interval (e.g., every second)
setInterval(checkForAutoWin, 1000);
const startNewGame = () => {
    newGameModal.style.display = "block";
}

btnTitle.addEventListener("click", () => {
    // aboutModal.style.display="block";
})

const openAboutModal = () => {
    closeMenu();
    aboutModal.style.display = "block";
}
// Open the user input modal
const openModal = () => {
    const modal = document.getElementById('userInputModal');
    document.querySelector('#score').textContent = "Your score : " + document.getElementById('user-score').textContent;
    modal.style.display = 'block';
}
// Close the modal
const closeModal = () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        if (modal.id === 'userInputModal') {
            musicPlayer.stopTrack('winning')
        }
    });
}
// Submit user's score
const submitScore = () => {
    if (userName.value === '' || document.querySelector('#score').textContent === '0') return;
    const userScore = parseInt(document.getElementById('user-score').textContent);
    let timestamp = timeStamp();
    //console.log('ts', timestamp);
    if (userName.value && !isNaN(userScore)) {
        saveUserScore(userName.value, userScore, sudokuPuzzle, currentGrid, tempHintCells, levelState, timestamp);
        const existingHighScores = JSON.parse(localStorage.getItem('highScores')) || [];
        existingHighScores.push({
            "userName": userName.value,
            userScore,
            sudokuPuzzle,
            currentGrid,
            tempHintCells,
            levelState,
            timestamp
        });
        if (existingHighScores.length > 1) existingHighScores.sort((a, b) => b.userScore - a.userScore);
        localStorage.setItem('highScores', JSON.stringify(existingHighScores))
        setTimeout(updateHighScoreBoard(), 1000);
        userName.value = '';
        musicPlayer.pauseAll();
        if (soundOn) musicPlayer.playTrack('background');
        closeModal();
    }
}
// // Update high score board with user names
const UserHighScoreBoard = () => {
    const highScores = getHighScores();
    //console.log('highScore', highScores)
    const highScoreList = document.getElementById('high-score-list');
    highScoreList.innerHTML = '';
    highScores.map((score, index) => {
        if (index < 10) highScoreList.innerHTML += `<li><button class="scoreBtn" onclick="loadLocalPuzzle('${score.timestamp}')">Load</button><span class="scoreName">${score.userName}: </span><span class="scoreResult">${score.userScore}</span></li>`;
    });
    topScores.style.display = 'none';
    userScores.style.display = 'flex';
}

const loadLocalPuzzle = (timeStamp) => {
    closeModal();
    const localHighScores = JSON.parse(localStorage.getItem('highScores'))
    let index = localHighScores.findIndex(p => p.timestamp === timeStamp)
    console.log('load', localHighScores, index)
    if (index >= 0) {
        autoSolved = false;
        sudokuPuzzle = (localHighScores[index].sudokuPuzzle);
        originalGrid = (localHighScores[index].currentGrid);
        tempHintCells = (localHighScores[index].tempHintCells);
        localStorage.setItem('grid', JSON.stringify(sudokuPuzzle));
        levelState = localHighScores[index].levelState;
        document.getElementById("timer").style.visibility = "visible";
        document.querySelector('#btndiv').style.visibility = "visible";
        replayPuzzle();
    }
}
// Get high scores with user names
const getHighScores = () => {
    return JSON.parse(localStorage.getItem('highScores')) || [];
}
const timeStamp = () => {
    let d = convertTZ(new Date());
    let year = d.getFullYear();
    let month = pad2(d.getMonth() + 1);
    let day = pad2(d.getDate());
    let hour = pad2(d.getHours());
    let minute = pad2(d.getMinutes());
    let second = pad2(d.getSeconds());
    return year + month + day + "_" + hour + minute + second;
}
const convertTZ = (date) => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
        timeZone: 'Asia/Kuala_Lumpur'
    }));
};

const pad2 = (number) => {
    let paddedNumber = String(number);
    if (paddedNumber.length < 2) {
        paddedNumber = "0" + paddedNumber;
    }
    return paddedNumber;
}
// Display the high score modal
const displayHighScoreModal = () => {
    closeMenu();
    setTimeout(updateHighScoreBoard(), 1000);
    const modal = document.getElementById('highScoreModal');
    userScores.style.display = 'none';
    topScores.style.display = 'block';
    modal.style.display = 'block';
}

btnUserScores.addEventListener('click', () => {
    UserHighScoreBoard();
    btnUserScores.classList.add('active');
    btnWorldRankings.classList.remove('active');
});

btnWorldRankings.addEventListener('click', () => {
    userScores.style.display = 'none';
    topScores.style.display = 'block';
    btnWorldRankings.classList.add('active');
    btnUserScores.classList.remove('active');
});

// Update high score board with user names
const updateHighScoreBoard = () => {
    let easy = 0,
        medium = 0,
        hard = 0,
        expert = 0;
    const highScores = highScoresLoaded;
    document.getElementById('easy-high-score-list').innerHTML = '';
    document.getElementById('medium-high-score-list').innerHTML = '';
    document.getElementById('hard-high-score-list').innerHTML = '';
    document.getElementById('expert-high-score-list').innerHTML = '';
    highScores.map(score => {
        if (score.level === 'Easy' && easy < topLimit) {
            document.getElementById('easy-high-score-list').innerHTML += `<li><button class="scoreBtn" onclick="loadPuzzle('${score.id}')">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
            easy++;
        }
        if (score.level === 'Medium' && medium < topLimit) {
            document.getElementById('medium-high-score-list').innerHTML += `<li><button class="scoreBtn" onclick="loadPuzzle('${score.id}')">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
            medium++;
        }
        if (score.level === 'Hard' && hard < topLimit) {
            document.getElementById('hard-high-score-list').innerHTML += `<li><button class="scoreBtn" onclick="loadPuzzle('${score.id}')">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
            hard++;
        }
        if (score.level === 'Expert' && expert < topLimit) {
            document.getElementById('expert-high-score-list').innerHTML += `<li><button class="scoreBtn" onclick="loadPuzzle('${score.id}')">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
            expert++;
        }
    })
}

const loadPuzzle = (id) => {
    closeModal();
    let index = highScoresLoaded.findIndex(p => p.id === id.toString())
    if (index >= 0) {
        autoSolved = false;
        sudokuPuzzle = JSON.parse(highScoresLoaded[index].puzzle);
        originalGrid = JSON.parse(highScoresLoaded[index].result);
        tempHintCells = JSON.parse(highScoresLoaded[index].hint);
        localStorage.setItem('grid', JSON.stringify(sudokuPuzzle));
        levelState = highScoresLoaded[index].level;
        document.querySelector('#btnTitle').innerHTML = `Sudoku - [${levelState}]`;
        document.getElementById("timer").style.visibility = "visible";
        document.querySelector('#btndiv').style.visibility = "visible";
        replayPuzzle();
    }
}
// Save user score to the database
const saveUserScore = (name, score, puzzle, result, hint, level, remark) => {
    fetch(`${url}/api/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            score: score.toString(),
            puzzle: JSON.stringify(puzzle),
            result: JSON.stringify(result),
            hint: JSON.stringify(hint),
            level: level,
            remark: remark
        })
    }).then(response => response.json()).then(data => {
        highScoresLoaded.push(data);
        highScoresLoaded.sort((a, b) => parseInt(b.score) - parseInt(a.score));
    }).catch(error => console.error('Error:', error));
}
// Load high scores from the database
const loadHighScores = () => {
    fetch(`${url}/api/post`).then(response => response.json()).then(data => {
        highScoresLoaded = data;
        return true;
    }).catch(error => {
        console.error('Error:', error);
        return false
    });
}

//Music Class
class MusicPlayer {
    constructor() {
        this.tracks = new Map();
    }
    addTrack(name, url, volume, loop = true) {
        const audio = new Audio();
        audio.volume = volume;
        audio.loop = loop;
        audio.src = url;
        this.tracks.set(name, audio);
    }
    playTrack(name) {
        const audio = this.tracks.get(name);
        try {
            audio.play();
        } catch (e) {
            console.log(e);
        }
    }
    pauseAll() {
        for (const audio of this.tracks.values()) {
            try {
                audio.pause();
            } catch (e) {
                console.log(e);
            }
        }
    }
    stopTrack(name) {
        const audio = this.tracks.get(name);
        if (audio) {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {
                console.log(e);
            }
        }
    }
}
const musicPlayer = new MusicPlayer();
musicPlayer.addTrack('background', assetFolder + '/Komiku_-_13_-_Good_Fellow.mp3?v=1692965241859', 0.3); // 
musicPlayer.addTrack('winning', assetFolder + '/mixkit-video-game-win-2016.wav?v=1692965458940', 0.3);
musicPlayer.addTrack('move', assetFolder + '/clearly.mp3', 0.8, false);
musicPlayer.addTrack('select', assetFolder + '/bubbles-single1.wav', 0.8, false);
speakerSwitch.addEventListener('click', () => {
    soundOn = !soundOn;
    if (!soundOn) {
        // Stop track1 after 1 seconds
        setTimeout(() => {
            musicPlayer.stopTrack("background");
        }, 1000);
        speakerSwitch.innerHTML = '🔇';
        speakerSwitch.title = 'audioOn';
    } else {
        musicPlayer.playTrack('background');
        speakerSwitch.innerHTML = '🔊';
        speakerSwitch.title = 'audioOff';
    }
})

// auto solveSudoku 
const solveSudoku = (grid) => {
    const size = grid.length;
    // Find an empty cell (cell with value 0)
    const emptyCell = findEmptyCell(grid);
    //console.log('empty',emptyCell);
    if (!emptyCell) {
        return true; // Puzzle solved
    }
    const [row, col] = emptyCell;
    // Try filling the empty cell with digits from 1 to 9
    for (let num = 1; num <= 9; num++) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            // place num to row and col
            if (solveSudoku(grid)) {
                emptyCells.push([row, col, num]); // best
                emptyCells.map(p => {
                    setTimeout(setNumAtCell(p[0], p[1], p[2]), 1000);
                })
                // setNumAtCell(row,col,num);
                delay(1000);
                return true; // Successfully solved
            }
            grid[row][col] = 0; // Backtrack
        }
    }
    return false; // No valid number found, backtrack
}

const findEmptyCell = (grid) => {
    const size = grid.length;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (grid[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null; // All cells filled
}

const isValidMove = (grid, row, col, num) => {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }
    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

const delay = (delayInms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

const delayLoop = (fn, delay) => {
    return (x, i) => {
        setTimeout(() => {
            fn(x);
        }, i * delay)
    }
};

const setNumAtCell = (row, col, num) => {
    if (document.querySelector(`#inp_${row}_${col}`) !== null) document.querySelector(`#inp_${row}_${col}`).textContent = num;
}

const solve = () => {
    emptyCells = [];
    let solveGrid = sudokuPuzzle;
    solveSudoku(solveGrid);
    emptyCells.reverse();
    console.log('solve', emptyCells, solveGrid);
}

// Function to solve a Sudoku puzzle with a delay and random number placement
const solveSudokuWithDelay = async (grid) => {
    const size = grid.length;
    // const playDelay = 50; // Delay in milliseconds (adjust as needed)
    // Function to check if a number is safe to place at a given cell
    const isSafe = (row, col, num) => {
        for (let i = 0; i < size; i++) {
            if (grid[row][i] === num || grid[i][col] === num) {
                return false;
            }
        }
        const subgridStartRow = row - (row % 3);
        const subgridStartCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[subgridStartRow + i][subgridStartCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }
    // Function to solve Sudoku recursively with a delay
    const solve = async () => {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafe(row, col, num)) {
                            // Place the number temporarily for visualization
                            grid[row][col] = num;
                            setNumAtCell(row, col, num);
                            musicPlayer.playTrack('select');
                            // Update the Sudoku grid visually (e.g., render it)
                            // Here, you can add code to visually update the grid
                            await new Promise((resolve) => setTimeout(resolve, playDelay));
                            if (!solving) {
                                return;
                            }
                            // Recursively attempt to solve
                            if (await solve()) {
                                return true; // Solved
                            }
                            // If not solved, backtrack and remove the number
                            grid[row][col] = 0;
                            setNumAtCell(row, col, '');
                            // Update the Sudoku grid visually to remove the number
                            // Here, you can add code to visually remove the number
                            await new Promise((resolve) => setTimeout(resolve, playDelay));
                            
                        }
                    }
                    return false; // No valid number found, backtrack
                }
            }
        }
        return true; // All cells filled, Sudoku solved
    }
    solving = true; // Set solving flag to true
    await solve();
    solving = false; // Reset solving flag when done
}

const autoSolve = (grid) => {
    if (grid) {
        document.querySelectorAll(".sudoku-input").forEach(inp => {
            inp.textContent='';
            inp.style.color="#4bc120";
        })
        solveSudokuWithDelay(grid).then(() => {
            grid = null;
            autoSolved = true;
            //console.log('success', grid, autoSolved)
            document.querySelectorAll(".sudoku-input").forEach(inp => {
                inp.style.color="red";
            })
        })
    }
}

// Function to stop the solving process
const stopSolving = () => {
    solving = false;
    logo.classList.remove('solving');
}

logo.addEventListener('click', () => {
    if (sudokuGrid.innerHTML === "" && !solving) {
        logo.classList.remove('solving');
        return;
    }
    if (!solving) {
        logo.classList.add('solving');
        logo.title = "autoSolving Off";
        autoSolve(JSON.parse(localStorage.getItem('grid')));
    } else {
        stopSolving();
        logo.title = "autoSolving On";
    }
})


// Function to set the selected color in localStorage
function saveThemeColor(color) {
    localStorage.setItem('themeColor', color);
}

// Function to load the selected color from localStorage
// function loadThemeColor() {
//     const savedColor = localStorage.getItem('themeColor');
//     console.log('themeColor',savedColor);
//     if (savedColor) {
//         bodyBackgroundColor = savedColor.backgroundColorPicker;
//         bodyForegroundColor=savedColor.foregroundColorPicker;
//         themeForegroundColor=savedColor.themeColorPicker;
//     }
// }

// Event listener for the color picker input
// const colorPicker = document.getElementById('colorPicker');
// colorPicker.addEventListener('input', (e) => {
//     const selectedColor = e.target.value;
//     document.body.style.backgroundColor = selectedColor;
// });


// Event listener for the save button

saveButton.addEventListener('click', () => {
    const selectedColor={
        "backgroundColorPicker":backgroundColorPicker.value,
        "foregroundColorPicker":foregroundColorPicker.value,
        "themeColorPicker":themeColorPicker.value
    };
    localStorage.setItem(themeName.value,JSON.stringify(selectedColor));
    const localThemeColor=JSON.parse(localStorage.getItem('themeColor'))||[];
    localThemeColor.push(themeName.value);
    localStorage.setItem('themeColor',JSON.stringify(localThemeColor));
    //saveThemeColor(selectedColor);
    alert('Theme color saved to localStorage!');
});

// Load the saved theme color on page load
//loadThemeColor();

themeColorSelector.addEventListener('change',()=>{
    const thisTheme=JSON.parse(localStorage.getItem(themeColorSelector.value));
    themeName.value=themeColorSelector.value;
    backgroundColorPicker.value=thisTheme.backgroundColorPicker;
    foregroundColorPicker.value=thisTheme.foregroundColorPicker;
    themeColorPicker.value=thisTheme.themeColorPicker;
    // document.querySelectorAll('.testBackground').style.backgroundColor=backgroundColorPicker.value;//+ ' !important';
   initColor();
})

const loadThemeColor=()=>{
    let themeColorSelectorOption='';
    const themeColor=JSON.parse(localStorage.getItem('themeColor'))||[];
    if(themeColor.length){
        themeColor.map(p=>{
            themeColorSelectorOption+=`<option value="${p}">${p}</option>`;
        })
    }
    themeColorSelector.innerHTML=themeColorSelectorOption;
}
const initColor=()=>{
    
    document.querySelector('#testForeground').style.backgroundColor=backgroundColorPicker.value; //+ ' !important';
    document.querySelector('#testTheme').style.backgroundColor=backgroundColorPicker.value; //+ ' !important';
    document.querySelector('#testForeground').style.color=foregroundColorPicker.value; //+ ' !important';
    document.querySelector('#testTheme').style.color=themeColorPicker.value; //+ ' !important';
  
    const bkColor=backgroundColorPicker.value;//+ '!important';
    const frColor=foregroundColorPicker.value;//+ '!important';
        // highScoreModal.style.backgroundColor=bkColor;
        // highScoreModal.style.color=frColor;
        // newGameModal.style.backgroundColor=bkColor;
        // newGameModal.style.color=frColor;
        // userInputModal.style.backgroundColor=bkColor;
        // userInputModal.style.color=frColor;
        // aboutModal.style.backgroundColor=bkColor;
        // aboutModal.style.color=frColor;
        // themeModal.style.backgroundColor=bkColor;
        // themeModal.style.color=frColor;
        // userName.style.backgroundColor=bkColor;
        // userName.style.color=frColor;
        // sidebar.style.backgroundColor=bkColor;
        // sidebar.style.color=frColor;
        // body.style.backgroundColor=bkColor;
        // body.style.color=frColor;

        // theme.textContent = "DarkTheme";
        // document.querySelectorAll(".btnNumber").forEach(btn => {
        //     btn.style.backgroundColor=themeColorPicker.value; 
        //     btn.addEventListener("mouseover", (e) => {
        //         e.target.style.backgroundColor = "#888";
        //     })
        //     btn.addEventListener("mouseleave", (e) => {
        //         e.target.style.backgroundColor = themeColorPicker.value;
        //     })
        // })


        // if (body.classList.contains("dark")) {
        // }
}

//https://www.geeksforgeeks.org/sudoku-backtracking-7/