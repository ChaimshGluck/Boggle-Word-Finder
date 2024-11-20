import React, { useState, createContext, useEffect } from "react";

export const BoggleContext = createContext();

export const BoggleProvider = ({ children }) => {
    const [boardSize, setBoardSize] = useState(() => {
        const savedBoardSize = localStorage.getItem('boardSize');
        return savedBoardSize ? JSON.parse(savedBoardSize) : 5;
    });
    const [board, setBoard] = useState(() => {
        const savedBoard = localStorage.getItem('board');
        return savedBoard ? JSON.parse(savedBoard) : Array(5).fill('').map(() => Array(5).fill(''));
    });
    const [foundWords, setFoundWords] = useState(() => {
        const savedFoundWords = localStorage.getItem('foundWords');
        return savedFoundWords ? JSON.parse(savedFoundWords) : [];
    });
    const [minLetters, setMinLetters] = useState(() => {
        const savedMinLetters = localStorage.getItem('minLetters');
        return savedMinLetters ? JSON.parse(savedMinLetters) : 4;
    });
    const [gameType, setGameType] = useState(() => {
        const savedGameType = localStorage.getItem('gameType');
        return savedGameType ? JSON.parse(savedGameType) : 'home-page';
    });
    const [hasFoundWords, setHasFoundWords] = useState(() => {
        const savedHasFoundWords = localStorage.getItem('hasFoundWords');
        return savedHasFoundWords ? JSON.parse(savedHasFoundWords) : false;
    });

    const [highlightedLetters, setHighlightedLetters] = useState([]);
    const [popupContent, setPopupContent] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        localStorage.setItem('board', JSON.stringify(board));
    }, [board]);

    useEffect(() => {
        localStorage.setItem('boardSize', JSON.stringify(boardSize));
    }, [boardSize, gameType]);

    useEffect(() => {
        localStorage.setItem('foundWords', JSON.stringify(foundWords));
    }, [foundWords]);

    useEffect(() => {
        localStorage.setItem('minLetters', JSON.stringify(minLetters));
    }, [minLetters]);

    useEffect(() => {
        localStorage.setItem('gameType', JSON.stringify(gameType));
    }, [gameType]);

    useEffect(() => {
        localStorage.setItem('hasFoundWords', JSON.stringify(hasFoundWords));
    }, [hasFoundWords]);

    const clearBoard = (boardSizeNew = boardSize) => {
        setBoard(Array(boardSizeNew).fill('').map(() => Array(boardSizeNew).fill('')));
        setFoundWords([]);
        setHighlightedLetters([]);
        setPopupContent('');
        setPopupVisible(false);
    };


    return (
        <BoggleContext.Provider value={{ boardSize, setBoardSize, board, setBoard, foundWords, setFoundWords, hasFoundWords, setHasFoundWords, minLetters, setMinLetters, gameType, setGameType, highlightedLetters, setHighlightedLetters, popupContent, setPopupContent, popupVisible, setPopupVisible, clearBoard }}>
            {children}
        </BoggleContext.Provider>
    );
}