import React, { useState, useEffect, useCallback, useRef } from "react";
import BoggleBoard from "./BoggleBoard";
import '../src/app.css';
import generateRandomBoard from "./randomBoard";

function FindWords() {
    const [foundWords, setFoundWords] = useState([]);
    const [filteredWords, setFilteredWords] = useState([]);
    const [dictionary, setDictionary] = useState(new Set());
    const [prefixes, setPrefixes] = useState(new Set());
    const [boardSize, setBoardSize] = useState(5);
    const [board, setBoard] = useState(Array(5).fill('').map(() => Array(5).fill('')));
    const [minLetters, setMinLetters] = useState(4);
    const [hasFoundWords, setHasFoundWords] = useState(false);
    const [highlightedLetters, setHighlightedLetters] = useState([]);
    const timeoutRef = useRef(null);
    const wordsRef = useRef(null);

    // Load dictionary into a Set for fast lookup
    useEffect(() => {
        const loadDictionary = async () => {
            try {
                // Load words from text file
                const response = await fetch('/words.txt');
                const text = await response.text();
                // Split text into an array of words
                const dictWords = text.split('\n').map(word => word.trim().toLowerCase());
                // Create a set of words
                const dictSet = new Set(dictWords);
                setDictionary(dictSet);

                // Create a set of prefixes
                const prefixSet = new Set();
                // Add all prefixes of each word to the set
                dictWords.forEach(word => {
                    for (let i = 1; i < word.length; i++) {
                        prefixSet.add(word.slice(0, i));
                    }
                });
                setPrefixes(prefixSet);

                console.log("Dictionary and prefixes loaded:", dictSet.size, "words,", prefixSet.size, "prefixes");
            } catch (error) {
                console.error("Error loading dictionary:", error);
            }
        };

        loadDictionary();
    }, []);

    const findAllNeighbors = useCallback((row, col) => {
        const neighbors = [];
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                // Check if neighbor is within bounds and not the same cell
                if (r >= 0 && r < board.length && c >= 0 && c < board[0].length && !(r === row && c === col)) {
                    neighbors.push({ row: r, col: c });
                }
            }
        }
        return neighbors;
    }, [board]);

    const findWords = useCallback((row, col, visited, currentWord, found, doublesCount) => {
        // Check if cell is visited
        if (visited[row][col]) return;

        const newCurrentWord = {
            word: currentWord.word + board[row][col],
            path: [...currentWord.path, { row, col }]
        };

        // Add current letter to currentWord
        const currentWordLower = newCurrentWord.word.toLowerCase();

        // Check if currentWord is a valid prefix or word
        if (!prefixes.has(currentWordLower) && !dictionary.has(currentWordLower)) return;


        // Check if currentWord is a valid word
        if (currentWordLower.length >= 3 && dictionary.has(currentWordLower) && !doublesCount.has(currentWordLower)) {
            found.add(newCurrentWord);
            doublesCount.add(currentWordLower);
            console.log("Valid word added:", newCurrentWord);
        }

        // Mark cell as visited
        visited[row][col] = true;

        // Find neighbors
        const neighbors = findAllNeighbors(row, col);
        for (const neighbor of neighbors) {
            findWords(neighbor.row, neighbor.col, visited, newCurrentWord, found, doublesCount);
        }

        // Reset visited cell
        visited[row][col] = false;
    }, [dictionary, prefixes, board, findAllNeighbors]);

    const filterWords = useCallback(() => {
        const filtered = foundWords.filter(wordObject => wordObject.word.length >= minLetters);
        setFilteredWords(filtered);
    }, [foundWords, minLetters]);

    const startFindingWords = useCallback(() => {
        if (!dictionary.size || !prefixes.size) {
            console.log("Dictionary or prefixes not loaded yet"); // Debugging log
            return;
        }

        // Create a 2D array to keep track of visited cells
        const visited = Array(board.length).fill(false).map(() => Array(board.length).fill(false));
        // Set to store found words
        const found = new Set();
        // Set to keep track of duplicate words
        const doublesCount = new Set();

        // Find words starting from each cell
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                findWords(row, col, visited, { word: '', path: [] }, found, doublesCount);
            }
        }
        const sortedWords = Array.from(found).sort((a, b) => b.word.length - a.word.length);
        setFoundWords(sortedWords);
        filterWords(sortedWords);
        setHasFoundWords(true);
        setFilteredWords(sortedWords.filter(wordObject => wordObject.word.length >= minLetters));
    }, [dictionary, prefixes, board, findWords, minLetters, filterWords]);

    // Filter words when minLetters changes
    useEffect(() => {
        if (hasFoundWords) {
            filterWords();
        }
    }, [minLetters, hasFoundWords, filterWords]);

    // Scroll to found words when words are found
    useEffect(() => {
        if (filteredWords.length > 0 && wordsRef.current) {
            const offset = window.innerHeight / 2;
            const elementTopPosition = wordsRef.current.offsetTop;

            window.scrollTo({
                top: elementTopPosition - offset,
                behavior: "smooth",
            });
        }
    }, [filteredWords]);

    const handleBoardSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setBoardSize(newSize);
        clearBoard(newSize);
        // setBoard(Array(newSize).fill('').map(() => Array(newSize).fill('')));
        // setFoundWords([]);
        // setFilteredWords([]);
        // setHasFoundWords(false);
        // setHighlightedLetters([]);
    };

    const handleMinLettersChange = (e) => {
        setMinLetters(parseInt(e.target.value, 10));
    };

    const clearBoard = (newSize) => {
        setBoard(Array(newSize).fill('').map(() => Array(newSize).fill('')));
        setFoundWords([]);
        setFilteredWords([]);
        setHasFoundWords(false);
        setHighlightedLetters([]);
    };

    const isBoardEmpty = () => {
        return board.every(row => row.every(cell => cell === ''));
    };

    const isBoardFilled = () => {
        return board.every(row => row.every(cell => cell !== ''));
    }

    const highlightLetters = (path) => {
        console.log("Highlighting letters:", path);
        const timeoutIndex = [];
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            setHighlightedLetters([]);
        }

        for (let i = 0; i < path.length; i++) {
            timeoutRef.current = setTimeout(() => {
                timeoutIndex.push(path[i]);
                setHighlightedLetters(timeoutIndex.map(({ row, col }) => `${row}-${col}`));
                timeoutRef.current = null;
            }, i * 200)
        }
    };

    return (
        <div className="find-words-container">
            <div className="board-container">
                <h2>Find words in your Boggle board</h2>
                <h3>Please enter your Boggle board:</h3>
                <div className="controls-container">
                    <button className="generate-board-btn button-spacing" onClick={() => generateRandomBoard(setFoundWords, setBoard, boardSize, setHighlightedLetters)}>Generate Random Board</button>
                    {!isBoardEmpty() &&
                        <button className="clear-board-btn" onClick={() => clearBoard(boardSize)}>Clear Board</button>
                    }
                    <div>
                        <select className="dropdown" value={boardSize} onChange={handleBoardSizeChange}>
                            <option value="4">4x4</option>
                            <option value="5">5x5</option>
                        </select>
                    </div>
                    <div>
                        <select className="dropdown" value={minLetters} onChange={handleMinLettersChange}>
                            <option value="4">Minimum 4 Letters</option>
                            <option value="3">Minimum 3 Letters</option>
                        </select>
                    </div>
                </div>
                <BoggleBoard boardSize={boardSize} board={board} setBoard={setBoard} highlightedLetters={highlightedLetters} />
                <button onClick={startFindingWords} disabled={!isBoardFilled()}>Find Words</button>
                {filteredWords.length > 0 && (
                    <div className="words-list" ref={wordsRef}>
                        <h3>Found Words:</h3>
                        <p>Total words found: {filteredWords.length}</p>
                        <div className="words-grid">
                            {filteredWords.map((wordObject, index) => (
                                <div
                                    key={index}
                                    className="word-item"
                                    onClick={() => highlightLetters(wordObject.path)}
                                >{wordObject.word}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindWords;
