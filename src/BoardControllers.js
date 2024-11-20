import generateRandomBoard from "./randomBoard";
import { BoggleContext } from "./BoggleContext";
import { useContext } from "react";

const BoardControllers = ({ handleMinLettersChange = () => { } }) => {

    const { board, setBoard, boardSize, setBoardSize, gameType, minLetters, clearBoard, setFoundWords, setPopupContent, setPopupVisible } = useContext(BoggleContext);

    const isBoardEmpty = () => {
        return board.every(row => row.every(cell => cell === ''));
    };

    const handleRandomBoardClick = () => {
        console.log(gameType);
        setFoundWords([]);
        setPopupContent('');
        setPopupVisible(false);
        generateRandomBoard(setBoard, boardSize, setFoundWords);
    };

    const handleBoardSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setBoardSize(newSize);
        clearBoard(newSize);
    };

    return (
        <div className="controls-container">
            <button className="generate-board-btn button-spacing" onClick={handleRandomBoardClick}>Generate Random Board</button>
            {!isBoardEmpty() && gameType === 'word-finder' &&
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
    );
};

export default BoardControllers;