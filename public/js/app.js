const table = document.getElementById("sudoku-grid");
const tableHide = document.getElementById("sudoku-grid-hide");
const newGameModal=document.querySelector('#newGameModal');
let sudokuPuzzle, originalGrid;
let startTime;
let timerInterval;
let newGame = false;
let currentNumber='1';
let currentId;
let inp_click=false;
let isWin=false;
let currentGrid=[];
let highlight=false;
let randomDifficulty;
let levelState;
let highScoresLoaded;
//const assetFolder='https://cdn.glitch.global/ca5aa811-8109-4d0b-bfe3-c16115da55f4';
const assetFolder='../resources';
const url='.';

window.addEventListener('load',()=>{
  loadHighScores();  
  musicPlayer.playTrack('background1');
  for(let i=1;i<=9;i++){
    const div = document.createElement("div");
    div.className="btnNumber";
    div.innerText=i;
    document.querySelector("#btndiv").appendChild(div);
    document.querySelectorAll(".btnNumber").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentNumber=e.target.textContent;
          musicPlayer.playTrack('select');
            if(inp_click){
                document.querySelector('#'+currentId).value=currentNumber;
                inp_click=false;
            }
            e.target.style.backgroundColor="#f00";
        })
        btn.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor="#888";
        })
        btn.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor="#558787";
        })
    })
  }
  
})

document.querySelector('#newGame').addEventListener('click',()=>{
    highlight!=highlight;
})

const showHint=()=>{
    if(originalGrid){
        table.style.display = 'none';
        tableHide.style.display = 'inline-block';
        setTimeout(()=> {
            tableHide.style.display = 'none';
            table.style.display = 'inline-block';
        }, 500);
    }
}
// Function to start the game and timer
const startGame=(min,max,level)=>{
    levelState=level;
    musicPlayer.pauseAll();
    musicPlayer.playTrack('background');
    randomDifficulty = generateRandomNumber(min,max);
    let newGrid = generateSudokuPuzzle(randomDifficulty);
    originalGrid = newGrid.originalGrid;
    sudokuPuzzle = newGrid.puzzleGrid;
    generatePuzzle(originalGrid,sudokuPuzzle);
    document.getElementById("timer").style.visibility = "visible";
    document.querySelector('#btndiv').style.visibility="visible";
    document.querySelector('#newGame').innerHTML=levelState
    closeModal();
}

const startTimer=()=>{
    newGame = true;
    startTime = new Date().getTime();
    updateTimer();
}

// Function to update the timer
const updateTimer=()=>{
    const now = new Date().getTime();
    const elapsedTime = now - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const userScore = calculateUserScore(elapsedTime);
    document.getElementById('user-score').textContent = userScore;
}

// Function to calculate the user's score based on elapsed time (example)
const calculateUserScore=(elapsedTime)=>{
    // Assume elapsedTime is in milliseconds
    const seconds = Math.floor(elapsedTime / 1000); // Convert to seconds
    const baseScore = 10000; // Base score for completing the game
    // Calculate the user's score
    // Example: Lower time results in a higher score
    const userScore = baseScore - seconds;
    return userScore < 0 ? 0 : userScore; // Ensure the score is non-negative
}

const generateRandomNumber=(min, max)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const clearPuzzle=()=>{
    generatePuzzle(originalGrid,sudokuPuzzle);
}

// Generate a Sudoku grid
const  generatePuzzle=(originalGrid,sudokuPuzzle)=> {
    if(typeof(sudokuPuzzle)==='undefined') return;
    table.innerHTML = "";
    let k=0;
    for(let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        for(let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            if(sudokuPuzzle[i][j] !== 0) {
                cell.textContent = sudokuPuzzle[i][j];
            } else {
                const input = document.createElement("input");
                input.className = "sudoku-input";
                input.id="inp_"+k;
                input.setAttribute("readonly", "readonly"); 
                k++;
                cell.appendChild(input);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    // Add event listeners to each <td> cell
    document.querySelectorAll("#sudoku-grid td").forEach(cell => {
        cell.addEventListener("click", () => {
            if(highlight) highlightRowsAndColumns(cell);
        });
    });

    tableHide.innerHTML = "";
    for(let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        for(let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            cell.textContent = originalGrid[i][j];
            row.appendChild(cell);
        }
        tableHide.appendChild(row);
    }
    document.querySelectorAll(".sudoku-input").forEach(inp => {
        inp.addEventListener('click',(e)=>{
            console.log('inp',e.target.id)
          musicPlayer.playTrack('move');
            currentId=e.target.id;
            inp_click=true;
        })
    });
    startTimer();
    timerInterval = setInterval(() => {
        if(newGame) updateTimer();
    }, 1000);
}

const highlightRowsAndColumns=(clickedCell)=>{
    // Clear previous highlights
    document.querySelectorAll("#sudoku-grid td").forEach(cell => {
        cell.classList.remove("highlight-row", "highlight-col");
    });

    // Highlight the entire row
    const rowCells = Array.from(clickedCell.parentElement.cells); // Convert to array
    rowCells.forEach(cell => {
        cell.classList.add("highlight-row");
    });

    // Highlight the entire column
    const clickedColIndex = clickedCell.cellIndex;
    document.querySelectorAll("#sudoku-grid tr").forEach(row => {
        const cellInCol = row.cells[clickedColIndex];
        cellInCol.classList.add("highlight-col");
    });
}

// Check if the Sudoku grid is a valid solution
// Function to check if the given grid is a valid Sudoku solution
const isValidSolution=(grid)=> {
    const size = grid.length;
    // Helper function to check if an array of numbers is valid (no duplicates)
    const isValidArray=(arr)=>{
        const seen = new Set();
        for(const num of arr) {
            if(num !== 0 && seen.has(num)) {
                return false;
            }
            seen.add(num);
        }
        return true;
    }
    // Check rows and columns
    for(let i = 0; i < size; i++) {
        const row = [];
        const col = [];
        for(let j = 0; j < size; j++) {
            row.push(grid[i][j]);
            col.push(grid[j][i]);
        }
        if(!isValidArray(row) || !isValidArray(col)) {
            return false;
        }
    }
    // Check 3x3 subgrids
    for(let i = 0; i < size; i += 3) {
        for(let j = 0; j < size; j += 3) {
            const subgrid = [];
            for(let x = i; x < i + 3; x++) {
                for(let y = j; y < j + 3; y++) {
                    subgrid.push(grid[x][y]);
                }
            }
            if(!isValidArray(subgrid)) {
                return false;
            }
        }
    }
    currentGrid=grid;
    return true;
}

const generateValidSudokuGrid=()=>{
    const size = 9;
    const grid = Array.from({
        length: size
    }, () => Array(size).fill(0));
    // Function to shuffle an array
    const shuffleArray=(array)=>{
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    // Function to check if it's safe to place 'num' at (row, col)
    const isSafe=(row, col, num)=>{
        // Check row and column
        for(let i = 0; i < size; i++) {
            if(grid[row][i] === num || grid[i][col] === num) {
                return false;
            }
        }
        // Check 3x3 subgrid
        const subgridStartRow = row - (row % 3);
        const subgridStartCol = col - (col % 3);
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(grid[subgridStartRow + i][subgridStartCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }
    // Function to fill the Sudoku grid using backtracking
    const fillGrid=()=>{
        for(let row = 0; row < size; row++) {
            for(let col = 0; col < size; col++) {
                if(grid[row][col] === 0) {
                    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffleArray(nums);
                    for(let i = 0; i < nums.length; i++) {
                        const num = nums[i];
                        if(isSafe(row, col, num)) {
                            grid[row][col] = num;
                            if(fillGrid()) {
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

const generateSudokuPuzzle=(difficulty)=>{
    const size = 9;
    const originalGrid = generateValidSudokuGrid(); // Generate a valid Sudoku grid
    const puzzleGrid = JSON.parse(JSON.stringify(originalGrid)); // Clone the original grid
    // Function to remove cells from the grid
    const removeCells=(difficulty)=>{
        const cellsToRemove = Math.min(Math.max(difficulty, 0), size * size - 1);
        let cellsRemoved = 0;
        while(cellsRemoved < cellsToRemove) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            if(puzzleGrid[row][col] !== 0) {
                puzzleGrid[row][col] = 0;
                cellsRemoved++;
            }
        }
    }
    removeCells(difficulty);
    return {
        originalGrid,
        puzzleGrid
    };
}
// Function to check if the player has won the game
const autoCheckWin=()=>{
    const table = document.getElementById("sudoku-grid");
    const rows = table.getElementsByTagName("tr");
    const grid = [];
    currentGrid=[];
    for(let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        const row = [];
        for(let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if(cell.children.length > 0) {
                const input = cell.children[0];
                if(!input.value || isNaN(input.value) || input.value < 1 || input.value > 9) {
                    return false; // Invalid input
                }
                row.push(Number(input.value));
            } else {
                row.push(Number(cell.textContent));
            }
        }
        grid.push(row);
    }
    //console.log('isValidSudoku',grid,isValidSudoku(grid))
    return isValidSolution(grid);
}
// Function to continuously check for win
const checkForAutoWin=()=>{
     isWin = autoCheckWin();
    if(isWin && newGame) {
        musicPlayer.pauseAll();
        musicPlayer.playTrack('winning');
        alert("Congratulations! You've solved the Sudoku puzzle!");
        blinkBoard();        
        newGame = false;
        isWin=false;
        openModal();
    }
}

const blinkBoard=()=>{
    document.querySelectorAll(".sudoku-input").forEach(inp => {
        inp.className = "sudoku-input highlight-win";
    });
}

// Call the checkForAutoWin function at an interval (e.g., every second)
setInterval(checkForAutoWin, 1000);

const isValidSudoku=(rows)=>{ 
    const rowSet = new Set();
    const columnSet = new Set();
    const boxSet = new Set(); 
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i] 
        for (let j = 0; j < row.length; j++) {
            const rowNumber = row[j]; 
            const columnNumber = rows[j][i];
            const boxCharacter = rows[3 * Math.floor(i / 3)+ Math.floor(j / 3)][((i * 3) % 9) + (j % 3)] ;
            if (rowNumber !== ".") { 
                if (rowSet.has(rowNumber)) return false 
                rowSet.add(rowNumber) 
            }
            if (columnNumber !== ".") { 
                if (columnSet.has(columnNumber)) return false 
                columnSet.add(columnNumber) 
            }
            if (boxCharacter !== ".") {
                if (boxSet.has(boxCharacter)) return false 
                boxSet.add(boxCharacter) 
            }
        }
        rowSet.clear(); 
        columnSet.clear(); 
        boxSet.clear();
    }
    return true;
} 

const startNewGame=()=>{
    newGameModal.style.display="block";
}
// Open the user input modal
const openModal=()=>{
    const modal = document.getElementById('userInputModal');
    modal.style.display = 'block';
}

// Close the modal
const closeModal=()=>{
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });   
}

// Submit user's score
const submitScore=()=>{
    const userName = document.getElementById('user-name').value;
    const userScore = parseInt(document.getElementById('user-score').textContent);
    let d = convertTZ(new Date());
    let year=d.getFullYear();
    let month=pad2(d.getMonth() + 1);
    let day=pad2(d.getDate());
    let hour=pad2(d.getHours());
    let minute=pad2(d.getMinutes());
    let second=pad2(d.getSeconds());
    let timestamp=year+month+day+"_"+hour+minute+second;    
    if (userName && !isNaN(userScore)) {
        saveUserScore(userName,userScore ,sudokuPuzzle, currentGrid,levelState,timestamp);
        setTimeout(updateHighScoreBoard(),1000);
        document.getElementById('user-name').value='';
        musicPlayer.pauseAll();
        musicPlayer.playTrack('background1');
        closeModal();
    }
}

const convertTZ=(date)=>{
	return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
		timeZone: 'Asia/Kuala_Lumpur'
	}));
};

const pad2=(number)=>{
    var paddedNumber = String(number);
    if (paddedNumber.length < 2) {
      paddedNumber = "0" + paddedNumber;
    }
    return paddedNumber;
}

// Display the high score modal
const displayHighScoreModal=()=>{
    setTimeout(updateHighScoreBoard(),1000); 
    const modal = document.getElementById('highScoreModal');
    modal.style.display = 'block';
}

// Update high score board with user names
const updateHighScoreBoard=()=>{
    const highScores =highScoresLoaded;
    document.getElementById('easy-high-score-list').innerHTML='';
    document.getElementById('medium-high-score-list').innerHTML='';
    document.getElementById('hard-high-score-list').innerHTML='';
    document.getElementById('expert-high-score-list').innerHTML='';
    highScores.map(score => {
        if(score.level==='Easy'){
            document.getElementById('easy-high-score-list').innerHTML+=`<li><button class="scoreBtn" onclick="loadPuzzle(${score.id})">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
        }
        if(score.level==='Medium'){
            document.getElementById('medium-high-score-list').innerHTML+=`<li><button class="scoreBtn" onclick="loadPuzzle(${score.id})">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
        }
        if(score.level==='Hard'){
            document.getElementById('hard-high-score-list').innerHTML+=`<li><button class="scoreBtn" onclick="loadPuzzle(${score.id})">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
        }
        if(score.level==='Expert'){
            document.getElementById('expert-high-score-list').innerHTML+=`<li><button class="scoreBtn" onclick="loadPuzzle(${score.id})">Load</button><span class="scoreName">${score.name}: </span><span class="scoreResult">${score.score}</span></li>`;
        }
    })
}

const loadPuzzle=(id)=>{
    closeModal();
    let index=highScoresLoaded.findIndex(p=>p.id===id.toString())
    if(index>=0){
        sudokuPuzzle=JSON.parse(highScoresLoaded[index].puzzle);
        originalGrid=JSON.parse(highScoresLoaded[index].result);
        levelState=highScoresLoaded[index].level;
        document.querySelector('#newGame').innerHTML=levelState;
        document.getElementById("timer").style.visibility = "visible";
        document.querySelector('#btndiv').style.visibility="visible";
        clearPuzzle();    
    }
}

// Save user score to the database
const saveUserScore=(name, score,puzzle,result,level,remark)=>{
    fetch(`${url}/api/post`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
      body: JSON.stringify({
        name:name,
        score:score.toString(),
        puzzle:JSON.stringify(puzzle),
        result:JSON.stringify(result),
        level:level,
        remark:remark
      })
    })
    .then(response => response.json())
    .then(data => {
        highScoresLoaded.push(data);
        highScoresLoaded.sort((a, b) => parseInt(b.score) - parseInt(a.score));
    })
    .catch(error => console.error('Error:', error));
}

// Load high scores from the database
const loadHighScores=()=>{
   fetch(`${url}/api/post`)
    .then(response => response.json())
    .then(data => {
        highScoresLoaded=data;
        return true;
    })
    .catch(error => {
        console.error('Error:', error);
        return false
    });
}
//Music Class
class MusicPlayer {
    constructor() {
      this.tracks = new Map()
    }
    addTrack(name, url, volume,loop = true) {
      const audio = new Audio();
      audio.volume=volume;
      audio.loop = loop;
      audio.src = url;
      this.tracks.set(name, audio)
    }
    playTrack(name) {
      const audio = this.tracks.get(name);
      try {
        audio.play();
        //return audio;
      } catch(e) {
        // console.log(e);
      }
    }
    pauseAll() {
      console.log('pause')
      for(const audio of this.tracks.values()) {
        try {
          audio.pause()
        } catch(e) {
          console.log(e);
        }
      }
    }
  }
  //Music Class
  const musicPlayer = new MusicPlayer();
  musicPlayer.addTrack('background1', assetFolder+'/Komiku_-_13_-_Good_Fellow.mp3?v=1692965241859',0.5);// 
  musicPlayer.addTrack('background', assetFolder+'/Wallpaper.mp3',0.4);// 
  musicPlayer.addTrack('winning',assetFolder+'/mixkit-video-game-win-2016.wav?v=1692965458940',0.3);
  musicPlayer.addTrack('move', assetFolder+'/clearly.mp3',0.8 ,false);
//   musicPlayer.addTrack('gameOver', 'Assets/smb_gameover.wav', false);
  musicPlayer.addTrack('select', assetFolder+'/bubbles-single1.wav',0.8, false);
  
  //musicPlayer.pauseAll();