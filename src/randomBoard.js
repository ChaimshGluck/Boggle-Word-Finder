const generateRandomBoard = (setFoundWords, setBoard, boardSize, setHighlightedLetters) => {
    setFoundWords([]);
    const vowels = 'AAAAAEEEEEEEIIIIIOOOOUU'.split('');
    const consonants = 'BBCCDDDFFGGHHJKLLMMNPPQRRSSSTTVWXZ'.split('');

    const getRandomLetter = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const every5thNum = boardSize === 4 ? [4, 8, 12, 16] : [5, 10, 15, 20, 25];

    // get random boggle board
    let randomBoardLetters = [], row = 1, column = 1;
    for (let i = 1; i <= every5thNum[every5thNum.length - 1]; i++) {
        randomBoardLetters.push({ letter: Math.random() < 0.4 ? getRandomLetter(vowels) : getRandomLetter(consonants), row: row, column: column });
        column++;

        if (every5thNum.includes(i)) {
            row++;
            column = 1;
        }
    }

    // print boggle board
    const newBoard = Array(boardSize).fill('').map(() => Array(boardSize).fill(''));
    randomBoardLetters.forEach(({ letter, row, column }) => {
        newBoard[row - 1][column - 1] = letter;
    });
    setBoard(newBoard);
    setHighlightedLetters([]);
}

export default generateRandomBoard;