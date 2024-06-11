import React, { useState, useRef } from "react";
import "../Cube/Cube.css"
import Keyboard from "../Keyboard/Keyboard";

interface BoardProps {
    tile: string;
    loading: boolean;
}
const Block: React.FC<BoardProps> = ({ tile, loading }) => {
    const [inputValues, setInputValues] = useState<string[][]>(
        Array(5)
            .fill("")
            .map(() => Array(5).fill(""))
    );
    const [inputColors, setInputColors] = useState<string[][]>(
        Array(5)
            .fill("")
            .map(() => Array(5).fill("white"))
    );
    const [invalidInputs, setInvalidInputs] = useState<{
        [key: string]: boolean;
    }>({});
    const [currentRow, setCurrentRow] = useState<number>(0);
    const [currentCol, setCurrentCol] = useState<number>(0);
    const inputRefs = useRef<(HTMLInputElement | null)[][]>(
        Array(5)
            .fill("")
            .map(() => Array(5).fill(null))
    );
    const resetGame = () => {
        setInputValues(
            Array(5)
                .fill("")
                .map(() => Array(5).fill(""))
        );
        setInputColors(
            Array(5)
                .fill("")
                .map(() => Array(5).fill("white"))
        );
        setInvalidInputs({});
        setCurrentRow(0);
        setCurrentCol(0);
    };
    const handleEnterPress = () => {
        const newColors = inputColors.slice();
        const newInvalidInputs: { [key: string]: boolean } = {};
        let anyCorrect = false;
        let rowString = inputValues[currentRow].join("");
        let tileChars = tile.split("");
        let inputColorsRow = Array(5).fill("white");
        inputValues[currentRow].forEach((value, colIndex) => {
            if (!value || value.trim() === "") {
                newInvalidInputs[`${currentRow}-${colIndex}`] = true;
            } else {
                if (value === tile[colIndex]) {
                    inputColorsRow[colIndex] = "green";
                    tileChars[colIndex] = "";
                }
            }
        });
        inputValues[currentRow].forEach((value, colIndex) => {
            if (
                value &&
                value !== tile[colIndex] &&
                tileChars.includes(value)
            ) {
                inputColorsRow[colIndex] = "yellow";
                tileChars[tileChars.indexOf(value)] = "";
            }
        });
        newColors[currentRow] = inputColorsRow;
        if (rowString === tile) {
            anyCorrect = true;
        }
        setInvalidInputs(newInvalidInputs);
        setInputColors(newColors);
        if (anyCorrect) {
            alert("Сиз жеңдиңиз!Куттуктаймын!");
            resetGame();
        } else if (currentRow === 4) {
            alert(
                `Сиз туура таба албай калдыңыз, кайра ойноп көрүңүз! Сиз таба албай жаткан сөз: ${tile}`
            );
            resetGame();
        } else {
            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
            if (inputRefs.current[currentRow + 1][0]) {
                inputRefs.current[currentRow + 1][0]?.focus();
            }
        }
    };
    const handleChange = (
        rowIndex: number,
        colIndex: number,
        value: string
    ) => {
        if (rowIndex !== currentRow) return;
        if (!/^[a-zA-Z]$/.test(value) && value !== "") return;
        setInputValues((prevValues) => {
            const newValues = prevValues.map((row, i) =>
                row.map((col, j) =>
                    i === rowIndex && j === colIndex ? value.toUpperCase() : col
                )
            );
            let nextColIndex = colIndex;
            if (value.length === 1 && colIndex < 4) {
                nextColIndex = colIndex + 1;
            } else if (value.length === 0 && colIndex > 0) {
                nextColIndex = colIndex - 1;
            }
            setCurrentCol(nextColIndex);
            if (inputRefs.current[rowIndex][nextColIndex]) {
                inputRefs.current[rowIndex][nextColIndex]?.focus();
            }
            return newValues;
        });
        setInvalidInputs((prev) => {
            const newInvalidInputs = { ...prev };
            delete newInvalidInputs[`${rowIndex}-${colIndex}`];
            return newInvalidInputs;
        });
    };
    const handleKeyPress = (key: string) => {
        if (key === "BACKSPACE") {
            if (currentCol > 0) {
                handleChange(currentRow, currentCol - 1, "");
            } else if (currentCol === 0 && currentRow > 0) {
                const prevRowLastCol = inputRefs.current[currentRow - 1][4];
                if (prevRowLastCol) {
                    setCurrentRow(currentRow - 1);
                    setCurrentCol(4);
                    prevRowLastCol.focus();
                }
            }
        } else if (key === "ENTER") {
            handleEnterPress();
        } else if (currentCol < 5) {
            handleChange(currentRow, currentCol, key);
        }
    };
    return (
        <div id="cube">
            <div className="container">
                <div className="block">
                    <div className="block__content">
                        <div className="block__content__inputs">
                            {inputValues.map((inputRow, rowIndex) => (
                                <div key={`group-${rowIndex}`}>
                                    {inputRow.map((value, colIndex) => (
                                        <input
                                            key={`input-${rowIndex}-${colIndex}`}
                                            type="text"
                                            value={value}
                                            maxLength={1}
                                            readOnly={rowIndex < currentRow}
                                            ref={(el) => {
                                                inputRefs.current[rowIndex][
                                                    colIndex
                                                ] = el;
                                            }}
                                            onChange={(e) =>
                                                handleChange(
                                                    rowIndex,
                                                    colIndex,
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                backgroundColor:
                                                    inputColors[rowIndex][
                                                        colIndex
                                                    ],
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="wordle__text">
                        <p>Wordle #195</p>
                        <p>12/31/2021</p>
                    </div>
                </div>
                <Keyboard onKeyPress={handleKeyPress} />
            </div>
        </div>
    );
};
export default Block;