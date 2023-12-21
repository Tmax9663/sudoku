class SudokuGame {
  constructor() {
    this.body = document.body;
    this.sudokuGrid = document.getElementById("sudoku-grid");
    this.newGameModal = document.querySelector('#newGameModal');
    this.btnHint = document.querySelector('#btnHint');
    this.btnReplay = document.querySelector('#btnReplay');
    this.btnTitle = document.querySelector('#btnTitle');
    this.speakerSwitch = document.querySelector('#speakerSwitch');
    this.logo = document.querySelector('#logo');
    this.aboutModal = document.querySelector('#aboutModal');
    this.userScores = document.querySelector('#userScores');
    this.userName = document.querySelector('#user-name');
    this.topScores = document.querySelector('#topScores');
    this.btnUserScores = document.querySelector('#btnUserScores');
    this.btnWorldRankings = document.querySelector('#btnWorldRankings');
    this.aboutContent = document.querySelector('#aboutContent');
    this.highScoreModal = document.querySelector('#highScoreModal');
    this.userInputModal = document.querySelector('#userInputModal');
    this.themeModal = document.querySelector('#themeModal');
    this.sidebar = document.querySelector('.sidebar');
    this.content = document.querySelector('.content');
    this.hamburger = document.querySelector('#hamburger');
    this.theme = document.querySelector('#theme');
    this.maxHintCount = 5;
    this.topLimit = 3;
    this.boxSize = 3;
    this.assetFolder = 'https://cdn.glitch.global/ca5aa811-8109-4d0b-bfe3-c16115da55f4';
    this.url = '.';
    this.sudokuPuzzle = [];
    this.tempSudokuPuzzle = [];
    this.originalGrid = [];
    this.newGrid = [];
    this.startTime = 0;
    this.timerInterval = null;
    this.currentNumber = '1';
    this.currentId = '';
    this.newGame = false;
    this.inp_click = false;
    this.isWin = false;
    this.highlight = false;
    this.soundOn = true;
    this.autoSolved = false;
    this.randomDifficulty = 0;
    this.levelState = '';
    this.highScoresLoaded = [];
    this.currentGrid = [];
    this.emptyCells = [];
    this.hintCells = [];
    this.tempHintCells = [];
    this.hintCount = 0;
    this.solving = false;
    this.history = [];
    this.backgroundColorPicker = document.querySelector('#backgroundColorPicker');
    this.foregroundColorPicker = document.querySelector('#foregroundColorPicker');
    this.themeColorPicker = document.querySelector('#themeColorPicker');
    this.themeName = document.querySelector('#theme-name');
    this.themeColorSelector = document.querySelector('#themeColorSelector');
    this.saveButton = document.getElementById('saveButton');
    this.currentThemeColor = localStorage.getItem('currentThemeColor') || '';

    window.addEventListener('load', () => {
      this.initColor();
      this.sidebar.style.left = '-100vw';
      const theme = localStorage.getItem('sudokuTheme') || 'darkTheme';
      this.body.classList.add(theme);
      this.highScoreModal.classList.add(theme);
      this.newGameModal.classList.add(theme);
      this.userInputModal.classList.add(theme);
      this.aboutModal.classList.add(theme);
      this.themeModal.classList.add(theme);
      this.userName.classList.add(theme);
      this.sidebar.classList.add(theme);
     // this.loadHighScores();
      this.btnHint.disabled = true;
      this.btnHint.style.color = '#666';
      this.btnReplay.disabled = true;
      this.btnReplay.style.color = '#666';
      //this.musicPlayer.playTrack('background');
      for (let i = 1; i <= 9; i++) {
        const div = document.createElement("div");
        div.className = "btnNumber";
        div.innerText = i;
        document.querySelector("#btndiv").appendChild(div);
        document.querySelectorAll(".btnNumber").forEach(btn => {
          btn.addEventListener("click", (e) => {
            this.currentNumber = e.target.textContent;
           // this.musicPlayer.playTrack('select');
            if (this.inp_click) {
              let clickNow = document.querySelector('#' + this.currentId);
              const pos = this.currentId.split('_');
              const row = parseInt(pos[1]);
              const col = parseInt(pos[2]);
              clickNow.textContent = this.currentNumber;
              clickNow.style.backgroundColor='#333';
              this.history.push({
                row,
                col,
                currentNumber:this.currentNumber
              });
              this.hintCells = this.hintCells.filter(p => !(p[0] === row && p[1] === col));
              this.inp_click = false;
            }
            e.target.style.backgroundColor = "#f00";
          });
          btn.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor = "#888";
          });
          btn.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor = "var(--theme-color)";
          });
        });
      }
      this.aboutContent.innerHTML = `<div> 
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
              <li> The timer will start when you begin a new game. Try to solve the puzzle as fast as you can.</li>
              <li> Click "Replay" to restart the current puzzle.</li>
              <li> Click "Check" to check your current progress and find any incorrect entries.</li>
              <li> Click "Solve" to solve the puzzle automatically (this will end your current game).</li>
              <li> Click the "High Scores" button to view the high scores table.</li>
              <li> Click the "About" button to learn more about the game and its developers.</li>
              <li> You can adjust the game theme and colors in the "Themes" section.</li>
          </ul>`;
      this.loadSudoku(this.randomDifficulty);
      document.querySelector("#btndiv").style.visibility="visible"
      if (!localStorage.getItem('userName')) {
        this.promptUserName();
      }
    //   this.musicPlayer = new MusicPlayer(this);
    //   this.musicPlayer.loadTrack('background', 'https://cdn.glitch.global/776cbf0f-4ab7-4675-a4e0-6f6cc439edf2/sudoku.mp3');
    //   this.musicPlayer.loadTrack('select', 'https://cdn.glitch.global/439dd7a5-6462-4e06-836e-e98f5c685d9e/sudoku_select.mp3');
    //   this.musicPlayer.loadTrack('success', 'https://cdn.glitch.global/29707b02-144d-4400-8d47-4f0f0f1e5c80/sudoku_success.mp3');
    //   this.musicPlayer.loadTrack('hint', 'https://cdn.glitch.global/7f7c8eeb-1899-46e3-ae24-e1e2de75f03e/sudoku_hint.mp3');
    //   this.musicPlayer.loadTrack('error', 'https://cdn.glitch.global/4be933c7-fc58-4f17-8d96-1ae4707e177f/sudoku_error.mp3');
    });
  }

  // Initialize the color settings
  initColor() {
    this.backgroundColorPicker.value = localStorage.getItem('backgroundColor') || '#222';
    this.foregroundColorPicker.value = localStorage.getItem('foregroundColor') || '#fff';
    this.themeColorPicker.value = localStorage.getItem('themeColor') || '#00bcd4';
    this.themeName.value = localStorage.getItem('themeName') || 'Custom Theme';
    this.themeColorSelector.style.backgroundColor = this.themeColorPicker.value;
    this.setCustomTheme();
  }

  // Set custom theme based on user color preferences
  setCustomTheme() {
    const backgroundColor = this.backgroundColorPicker.value;
    const foregroundColor = this.foregroundColorPicker.value;
    const themeColor = this.themeColorPicker.value;
    const themeName = this.themeName.value;

    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--foreground-color', foregroundColor);
    document.documentElement.style.setProperty('--theme-color', themeColor);

    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('foregroundColor', foregroundColor);
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('themeName', themeName);
  }

  // Load the Sudoku puzzle
  loadSudoku(difficulty) {
    // Load the Sudoku puzzle from your source or generate one
    // Assign the puzzle to this.sudokuPuzzle
    // For example:
    this.sudokuPuzzle = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ];
    // Save the original grid for comparison
    this.originalGrid = this.deepCopyGrid(this.sudokuPuzzle);
    console.log('originalGrid',this.originalGrid)
    // Render the Sudoku grid
    this.renderGrid();
  }

  // Render the Sudoku grid
  renderGrid() {
    // Clear the grid
    this.sudokuGrid.innerHTML = '';

    // Loop through rows and columns
    for (let row = 0; row < 9; row++) {
        const rowCell = document.createElement("tr");
      for (let col = 0; col < 9; col++) {
        const cells = document.createElement("td");
        cells.style.width="40px";
        const cellValue = this.sudokuPuzzle[row][col];
        const cellId = `cell_${row}_${col}`;
        if (cellValue !== null) {
            cells.textContent = cellValue;
            cells.classList.add('given');
        } else {
            
            // const cell = document.createElement('input');
            // cell.type = 'text';
             cells.className = 'sudoku-input';
             cells.id = cellId;
            // cell.style.textAlign="center";
            // cell.style.fontSize="20px";
            // cell.style.color="#f00";
        // cell.readOnly=true;
            // Check if the cell is pre-filled (given)
            // if (cellValue !== null) {
            //   cell.value = cellValue;
            //   cell.readOnly = true;
            //   cell.classList.add('given');
            // }
            cells.textContent = '';
            cells.style.color="#f00";
            // Add event listener for cell click
            cells.addEventListener('click', (e) => {
                document.querySelectorAll('.sudoku-input').forEach(p=>{
                    p.style.backgroundColor='#333';
                })
                this.cellClick(cellId);
                //e.target.style.border="2px solid #0ff"
                e.target.style.backgroundColor="#e1e1e122";
                console.log('thisId',cellId,e.target)
            });
            // cells.addEventListener('blur', (e) => {
            //     e.target.style.backgroundColor='#333'
            //     //e.target.style.border='0.5px solid #00bcd4';
            // })
        
            //cells.appendChild(cell);
        }
        rowCell.appendChild(cells);
        // Append the cell to the grid
        // this.sudokuGrid.appendChild(cell);
      }
      this.sudokuGrid.appendChild(rowCell);
    }
  }

  // Handle cell click event
  cellClick(cellId) {
    if (this.isWin) {
      return;
    }

    this.currentId = cellId;
    this.inp_click = true;

    // Highlight the selected cell
    if (this.highlight) {
      document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('highlighted');
      });
      document.querySelectorAll(`.r${cellId[5]}, .c${cellId[7]}, .b${Math.floor(cellId[5] / 3)}${Math.floor(cellId[7] / 3)}`).forEach(cell => {
        cell.classList.add('highlighted');
      });
    }
  }

  // Deep copy a 2D grid
  deepCopyGrid(grid) {
    return grid.map(row => [...row]);
  }

  // Check if the Sudoku puzzle is solved
  isSolved() {
    // Check if the current grid is equal to the original grid
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.sudokuPuzzle[row][col] !== this.originalGrid[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  // Save the Sudoku grid to local storage
  saveGrid() {
    // Save the current grid to local storage
    localStorage.setItem('sudokuGrid', JSON.stringify(this.sudokuPuzzle));
  }

  // Load the Sudoku grid from local storage
  loadSavedGrid() {
    // Load the saved grid from local storage
    const savedGrid = localStorage.getItem('sudokuGrid');
    if (savedGrid) {
      this.sudokuPuzzle = JSON.parse(savedGrid);
      this.originalGrid = this.deepCopyGrid(this.sudokuPuzzle);
      this.renderGrid();
    }
  }

  // Clear the Sudoku grid and reset the game
  clearGrid() {
    // Clear the current grid
    this.sudokuPuzzle = Array.from({ length: 9 }, () => Array(9).fill(null));
    this.originalGrid = this.deepCopyGrid(this.sudokuPuzzle);

    // Clear local storage
    localStorage.removeItem('sudokuGrid');

    // Render the empty grid
    this.renderGrid();
  }

  // Prompt the user for their name
  promptUserName() {
    const userName = prompt('Please enter your name:');
    if (userName) {
      localStorage.setItem('userName', userName);
      this.userName = userName;
    }
  }

  // Check if the Sudoku puzzle is valid
  isValid() {
    // Implement Sudoku validation logic here
    // Return true if the puzzle is valid, false otherwise
    // You can use the this.sudokuPuzzle to access the current grid
    // For example:
    return true;
  }

  // Check the Sudoku puzzle and show errors
  checkGrid() {
    // Check if the current grid is valid
    if (!this.isValid()) {
      alert('There are errors in the grid. Please fix them before checking again.');
      return;
    }

    // Check for errors in the current grid
    let hasErrors = false;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellValue = this.sudokuPuzzle[row][col];
        if (cellValue !== null) {
          // Check row
          for (let c = 0; c < 9; c++) {
            if (c !== col && this.sudokuPuzzle[row][c] === cellValue) {
              hasErrors = true;
              this.highlightError(`cell_${row}_${col}`);
              this.highlightError(`cell_${row}_${c}`);
            }
          }

          // Check column
          for (let r = 0; r < 9; r++) {
            if (r !== row && this.sudokuPuzzle[r][col] === cellValue) {
              hasErrors = true;
              this.highlightError(`cell_${row}_${col}`);
              this.highlightError(`cell_${r}_${col}`);
            }
          }

          // Check 3x3 box
          const boxRow = Math.floor(row / 3) * 3;
          const boxCol = Math.floor(col / 3) * 3;
          for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
              if ((r !== row || c !== col) && this.sudokuPuzzle[r][c] === cellValue) {
                hasErrors = true;
                this.highlightError(`cell_${row}_${col}`);
                this.highlightError(`cell_${r}_${c}`);
              }
            }
          }
        }
      }
    }

    // Display result
    if (hasErrors) {
      alert('There are errors in the grid.');
    } else {
      alert('The grid is correct! Congratulations!');
      this.isWin = true;
    }
  }

  // Highlight an error cell
  highlightError(cellId) {
    const cell = document.getElementById(cellId);
    if (cell) {
      cell.classList.add('error');
    }
  }

  // Clear all error highlights
  clearErrors() {
    document.querySelectorAll('.error').forEach(cell => {
      cell.classList.remove('error');
    });
  }

  // Solve the Sudoku puzzle
  solveGrid() {
    // Implement Sudoku solving logic here
    // You can use the this.sudokuPuzzle to access the current grid
    // Update the grid with the solved values
    // For example:
    this.sudokuPuzzle = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    // Render the solved grid
    this.renderGrid();
  }

  // Generate a hint for the Sudoku puzzle
  generateHint() {
    // Implement Sudoku hint generation logic here
    // Update the grid with the hint value
    // For example:
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const hintValue = this.sudokuPuzzle[row][col];
    if (hintValue !== null) {
      // Update the grid with the hint value
      this.sudokuPuzzle[row][col] = hintValue;
      // Update the UI
      document.getElementById(`cell_${row}_${col}`).value = hintValue;
    }
  }

  // Play a sound effect
  playSound(soundName) {
   // this.musicPlayer.play(soundName);
  }

  // Handle keyboard input
  handleKeyPress(event) {
    if (this.isWin) {
      return;
    }

    const { key } = event;
    const cellId = this.currentId;

    if (this.inp_click) {
      if (key >= '1' && key <= '9') {
        document.getElementById(cellId).value = key;
        const [row, col] = cellId.split('_').slice(1).map(Number);
        this.sudokuPuzzle[row][col] = parseInt(key);
        this.inp_click = false;
        this.checkGrid();
      } else if (key === 'Backspace' || key === 'Delete') {
        document.getElementById(cellId).value = '';
        const [row, col] = cellId.split('_').slice(1).map(Number);
        this.sudokuPuzzle[row][col] = null;
      } else if (key === 'ArrowLeft') {
        const [row, col] = cellId.split('_').slice(1).map(Number);
        const prevCol = col === 0 ? 8 : col - 1;
        this.cellClick(`cell_${row}_${prevCol}`);
      } else if (key === 'ArrowRight') {
        const [row, col] = cellId.split('_').slice(1).map(Number);
        const nextCol = col === 8 ? 0 : col + 1;
        this.cellClick(`cell_${row}_${nextCol}`);
      } else if (key === 'ArrowUp') {
        const [row, col] = cellId.split('_').slice(1).map(Number);
        const prevRow = row === 0 ? 8 : row - 1;
        this.cellClick(`cell_${prevRow}_${col}`);
      } else if (key === 'ArrowDown') {
        const [row, col] = cellId.split('_').slice(1).map(Number);
        const nextRow = row === 8 ? 0 : row + 1;
        this.cellClick(`cell_${nextRow}_${col}`);
      }
    }
  }

  // Start the game timer
  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = new Date(currentTime - this.startTime);
      const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
      const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
      document.querySelector('#timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
  }

  // Stop the game timer
  stopTimer() {
    clearInterval(this.timerInterval);
  }
}

// for (let i = 1; i <= 9; i++) {
//     const div = document.createElement("div");
//     div.className = "btnNumber";
//     div.innerText = i; 
//     document.querySelector("#btndiv").appendChild(div);
//     document.querySelectorAll(".btnNumber").forEach(btn => {
//         btn.addEventListener("click", (e) => {
//             currentNumber = e.target.textContent;
//             musicPlayer.playTrack('select');
//             if (inp_click) {
//                 let clickNow = document.querySelector('#' + currentId);
//                 const pos = currentId.split('_');
//                 const row = parseInt(pos[1]);
//                 const col = parseInt(pos[2]);
//                 clickNow.value = currentNumber;
//                 history.push({
//                     row,
//                     col,
//                     currentNumber
//                 })
//                 hintCells = hintCells.filter(p => !(p[0] === row && p[1] === col));
//                 inp_click = false;
//             }
//             e.target.style.backgroundColor = "#f00";
//         })
//         btn.addEventListener("mouseover", (e) => {
//             e.target.style.backgroundColor = "#888";
//         })
//         btn.addEventListener("mouseleave", (e) => {
//             e.target.style.backgroundColor = "var(--theme-color)";
//         })
//         }
       
//     )
// }
// Initialize the Sudoku game
const sudokuGame = new SudokuGame();
