import React from "react";
import "../Keyboard/Keyboard.css";

interface KeyboardProps {
    onKeyPress: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
    const keys = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M"],
    ];

    return (
        <div className="keyboard">
            {keys.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="keyboard-row">
                    {row.map((key) => (
                        <button
                            key={key}
                            className="keyboard-key"
                            onClick={() => onKeyPress(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
            <div className="keyboard-row">
                <button
                    className="keyboard-key"
                    onClick={() => onKeyPress("BACKSPACE")}
                >
                    BACKSPACE
                </button>
                <button
                    className="keyboard-key"
                    onClick={() => onKeyPress("ENTER")}
                >
                    ENTER
                </button>
            </div>
        </div>
    );
};

export default Keyboard;