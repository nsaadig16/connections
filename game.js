let groups = [];
let words = [];
let wordMap = {};
let selectedWords = [];
let solvedGroups = [];
let lives = 4;
let solvedWords = [];
let finished = false;

function startGame() {
    const base64Input = document.getElementById("base64-input").value.trim();
    if (!base64Input) {
        alert("Please enter a base64 encoded string.");
        return false; // Return false if no input
    }

    // Check if the base64 input is valid using a regular expression
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64Regex.test(base64Input) || base64Input.length % 4 !== 0) {
        alert("Invalid base64 string. Please enter a valid base64 encoded string.");
        return false; // Return false if invalid input
    }

    // Decode the base64 input and initialize the game
    try {
        groups = decodeBase64(base64Input);
        words = groups.flatMap(group => group.words);
        wordMap = {};
        groups.forEach((group, idx) => {
            group.words.forEach(word => {
                wordMap[word] = idx;
            });
        });

        document.getElementById("input-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        generateGrid();
        updateLives();
        return true; // Return true if game started successfully
    } catch (error) {
        alert("Error starting game: " + error.message);
        return false; // Return false if there was an error
    }
}

function decodeBase64(base64String) {
    const decodedData = atob(base64String);
    const lines = decodedData.split("\n").map(line => line.split(","));
    const groupMeanings = lines.pop();  // Last line should be the meanings
    const groups = lines.map((line, index) => ({
        words: line,
        meaning: groupMeanings[index]
    }));
    return groups;
}

function shuffleWords() {
    if (finished) return;
    generateGrid();
    resetSelections();
}

function generateGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    let sortedWords = [];
    solvedGroups.forEach(groupIndex => {
        const group = groups[groupIndex];
        sortedWords.push(...group.words.map(word => ({ word, groupIndex, solved: true })));
    });

    const unsolvedWords = words.filter(word => !solvedWords.includes(word));
    for (let i = unsolvedWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unsolvedWords[i], unsolvedWords[j]] = [unsolvedWords[j], unsolvedWords[i]];
    }
    sortedWords.push(...unsolvedWords.map(word => ({ word, groupIndex: wordMap[word], solved: false })));

    sortedWords.forEach(({ word, groupIndex, solved }) => {
        const tile = document.createElement("div");
        tile.className = "tile";

        if (solved) {
            tile.classList.add("solved", `group-${groupIndex}`);
            tile.textContent = groups[groupIndex].meaning;
        } else {
            tile.textContent = word;
            tile.onclick = () => selectTile(tile);
        }

        grid.appendChild(tile);
    });
}

function selectTile(tile) {
    if (tile.classList.contains("solved")) return;
    if (selectedWords.includes(tile)) {
        tile.classList.remove("selected");
        selectedWords = selectedWords.filter(t => t !== tile);
    } else {
        if (selectedWords.length < 4) {
            tile.classList.add("selected");
            selectedWords.push(tile);
        }
    }
}

function checkGuess() {
    if (selectedWords.length !== 4) return;
    const guessedWords = selectedWords.map(tile => tile.textContent);
    const groupIds = guessedWords.map(word => wordMap[word]);
    const feedback = document.getElementById("feedback");

    if (groupIds.every(id => id === groupIds[0])) {
        const groupIndex = groupIds[0];
        feedback.innerHTML = `✅ Correct! Group: <strong>${groups[groupIndex].meaning}</strong>`;
        solvedGroups.push(groupIndex);
        solvedWords.push(...groups[groupIndex].words);
        generateGrid();
    } else {
        const countMap = {};
        groupIds.forEach(id => {
            countMap[id] = (countMap[id] || 0) + 1;
        });
        const values = Object.values(countMap);
        const max = Math.max(...values);

        lives--;
        updateLives();

        if (max === 3) {
            feedback.textContent = "Almost! One away.";
        } else {
            feedback.textContent = "Incorrect!";
        }
    }

    resetSelections();

    if (solvedGroups.length === 4) {
        feedback.innerHTML = "🎉 You solved all groups!";
        finished = true;
        disableAllTiles();
    } else if (lives === 0) {
        feedback.innerHTML = "💔 Game over!";
        finished = true;
        revealAllGroups();
        disableAllTiles();
    }
}

function revealAllGroups() {
    const grid = document.getElementById("grid");
    grid.innerHTML = ""; // Clear existing tiles

    groups.forEach((group, index) => {
        const groupContainer = document.createElement("div");
        groupContainer.className = "group-container";

        const groupTitle = document.createElement("h3");
        groupTitle.textContent = group.meaning;
        groupContainer.appendChild(groupTitle);

        group.words.forEach(word => {
            const tile = document.createElement("div");
            tile.className = "tile solved";
            tile.textContent = word;
            groupContainer.appendChild(tile);
        });

        grid.appendChild(groupContainer);
    });
}

function resetSelections() {
    selectedWords = [];
    const tiles = document.querySelectorAll(".tile.selected");
    tiles.forEach(tile => tile.classList.remove("selected"));
}

function updateLives() {
    const livesCount = document.getElementById("lives-count");
    livesCount.innerHTML = "❤️ ".repeat(lives);
}

function disableAllTiles() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => tile.classList.add("solved"));
}
