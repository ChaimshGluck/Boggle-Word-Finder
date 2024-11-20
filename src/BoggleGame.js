import { useContext, useEffect } from "react";
import BoggleBoard from "./BoggleBoard";
import generateRandomBoard from "./randomBoard";
import { BoggleContext } from "./BoggleContext";

function BoggleGame() {
    const { boardSize, setBoard } = useContext(BoggleContext);

    useEffect(() => {
        setBoard(Array(boardSize).fill('').map(() => Array(boardSize).fill('')));
        generateRandomBoard(setBoard, boardSize);
    }
        , [boardSize, setBoard]);

    return (
        <BoggleBoard />
    );
}

export default BoggleGame;