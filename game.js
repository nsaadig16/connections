// game.js

const groups = [
    { words: ["apple", "banana", "grape", "orange"], meaning: "Fruits" },
    { words: ["dog", "cat", "rabbit", "hamster"], meaning: "Pets" },
    { words: ["car", "bus", "train", "bicycle"], meaning: "Transport" },
    { words: ["violin", "guitar", "flute", "drum"], meaning: "Instruments" }
  ];
  
  let words = groups.flatMap(group => group.words);
  let wordMap = {};
  groups.forEach((group, idx) => {
    group.words.forEach(word => {
      wordMap[word] = idx;
    });
  });
  
  let selectedWords = [];
  let solvedGroups = [];
  let lives = 4;
  let solvedWords = [];
  let gameOver = false;
  
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
    if (gameOver || tile.classList.contains("solved")) return;
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
    if (selectedWords.length !== 4 || gameOver) return;
    const guessedWords = selectedWords.map(tile => tile.textContent);
    const groupIds = guessedWords.map(word => wordMap[word]);
    const feedback = document.getElementById("feedback");
  
    if (groupIds.every(id => id === groupIds[0])) {
      const groupIndex = groupIds[0];
      if (!solvedGroups.includes(groupIndex)) {
        feedback.innerHTML = `✅ Correct! Group: <strong>${groups[groupIndex].meaning}</strong>`;
        solvedGroups.push(groupIndex);
        solvedWords.push(...groups[groupIndex].words);
      }
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
      gameOver = true;
    } else if (lives === 0) {
      feedback.innerHTML = "💔 Game over! Here's the solution:";
      revealAllGroups();
      disableAllTiles();
      gameOver = true;
    }
  }
  
  function updateLives() {
    const hearts = "❤️ ".repeat(lives) + "💔 ".repeat(4 - lives);
    document.getElementById("lives-count").textContent = hearts.trim();
  }
  
  function revealAllGroups() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    groups.forEach((group, groupIndex) => {
      group.words.forEach(word => {
        const tile = document.createElement("div");
        tile.className = `tile solved group-${groupIndex}`;
        tile.textContent = group.meaning;
        grid.appendChild(tile);
      });
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
    if (gameOver) return;
    generateGrid();
    resetSelections();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    shuffleWords();
    updateLives();
  });
  