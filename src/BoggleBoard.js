import React, { useContext, useRef } from 'react';
import { BoggleContext } from './BoggleContext';

function BoggleBoard() {
    const { boardSize, board, setBoard, gameType, highlightedLetters } = useContext(BoggleContext);
    const inputsRef = useRef([]);

    // Handle input change
    const handleInputChange = (e, rowIndex, colIndex) => {
        // Convert input to uppercase
        const value = e.target.value.toUpperCase();
        e.target.value = value;

        // Update board state
        setBoard(prevBoard => {
            // Create a new board with the updated value
            const newBoard = prevBoard.map(row => row.slice());
            newBoard[rowIndex][colIndex] = value;
            return newBoard;
        });

        // Focus on the next input
        const nextInputIndex = rowIndex * boardSize + colIndex + 1;
        if (nextInputIndex < boardSize * boardSize && value !== '') {
            inputsRef.current[nextInputIndex].focus();
        }
    };

    const handleButtonClick = (row, col) => {
        console.log(`Button clicked at ${row}, ${col}`);
    };

    const renderBoard = () => {
        const boardRows = [];
        for (let row = 0; row < boardSize; row++) {
            const rowBoxes = [];
            for (let col = 0; col < boardSize; col++) {
                if (gameType === 'regular-boggle') {
                    rowBoxes.push(
                        <button
                            key={`${row}-${col}`}
                            className={`board-box ${highlightedLetters?.includes(`${row}-${col}`) ? 'highlighted' : ''} ${boardSize === 5 ? 'input-5x5' : 'input-4x4'}`}
                            onClick={() => handleButtonClick(row, col)}
                        >
                            {board[row][col]}
                        </button>
                    );
                } else {
                    rowBoxes.push(
                        <input
                            key={`${row}-${col}`}
                            type="text"
                            className={`board-input ${highlightedLetters?.includes(`${row}-${col}`) ? 'highlighted' : ''} ${boardSize === 5 ? 'input-5x5' : 'input-4x4'}`}
                            maxLength="1"
                            value={board[row][col]}
                            onChange={(e) => handleInputChange(e, row, col)}
                            ref={(el) => (inputsRef.current[row * boardSize + col] = el)}
                        />
                    );
                }
            }
            boardRows.push(
                <div className='board-row' key={row} >
                    {rowBoxes}
                </div>
            );
        }
        return boardRows;
    };

    return <div className={`boggle-board ${boardSize === 5 ? 'board-5x5' : 'board-4x4'}`}>{renderBoard()}</div>;
}

export default BoggleBoard;