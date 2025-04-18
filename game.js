let groups = [];
let words = [];
let wordMap = {};
let selectedWords = [];
let solvedGroups = [];
let lives = 4;
let solvedWords = [];

function startGame() {
    const base64Input = document.getElementById("base64-input").value.trim();
    if (!base64Input) {
        alert("Please enter a base64 encoded string.");
        return;
    }

    // Decode the base64 input and initialize the game
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
        disableAllTiles();
    } else if (lives === 0) {
        feedback.innerHTML = "💔 Game over! Here's the solution:";
        revealAllGroups();
        disableAllTiles();

        // Hide "Check Guess" and "Shuffle Words" buttons, and show "Reset Game" button
        document.getElementById("check-btn").style.display = "none";
        document.getElementById("shuffle-btn").style.display = "none";
        document.getElementById("reset-btn").style.display = "block"; // Show Reset button
    }
}

function updateLives() {
    const hearts = "💔 ".repeat(4 - lives) + "❤️ ".repeat(lives);
    document.getElementById("lives-count").textContent = hearts.trim();
}

function revealAllGroups() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        const word = tile.textContent;
        const groupIndex = wordMap[word] ?? groups.findIndex(g => g.meaning === word);
        tile.className = "tile solved group-" + groupIndex;
        tile.textContent = groups[groupIndex].meaning;
    });
}

function disableAllTiles() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => tile.onclick = null);
}

function resetSelections() {
    selectedWords.forEach(tile => tile.classList.remove("selected"));
    selectedWords = [];
}

function shuffleWords() {
    generateGrid();
    resetSelections();
}

function resetGame() {
    // Reset the game state
    groups = [];
    words = [];
    wordMap = {};
    selectedWords = [];
    solvedGroups = [];
    solvedWords = [];
    lives = 4;

    // Clear the input field
    document.getElementById("base64-input").value = '';

    // Clear feedback
    document.getElementById("feedback").innerHTML = '';

    // Show the input screen again
    document.getElementById("input-screen").style.display = "block";
    document.getElementById("game-screen").style.display = "none";

    // Reset the visibility of buttons
    document.getElementById("check-btn").style.display = "inline-block";
    document.getElementById("shuffle-btn").style.display = "inline-block";
    document.getElementById("reset-btn").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("reset-btn").style.display = "none"; // Ensure reset button is hidden initially
});
