import React, { useState, useRef } from "react";
import "../Cube/Cube.css"
import Keyboard from "../Keyboard/Keyboard";

interface BoardProps {
    tile: string;
    loading: boolean;
}

const Cube: React.FC<BoardProps> = ({ tile, loading }) => {
    const [inputValuesOne, setInputValuesOne] = useState<string[]>(
        Array(5).fill("")
    );
    const [inputValuesTwo, setInputValuesTwo] = useState<string[]>(
        Array(5).fill("")
    );
    const [inputValuesThree, setInputValuesThree] = useState<string[]>(
        Array(5).fill("")
    );
    const [inputValuesFour, setInputValuesFour] = useState<string[]>(
        Array(5).fill("")
    );
    const [inputValuesFive, setInputValuesFive] = useState<string[]>(
        Array(5).fill("")
    );
    const [inputColors, setInputColors] = useState<string[][]>(
        Array(5).fill(Array(5).fill("white"))
    );
    const [invalidInputs, setInvalidInputs] = useState<{
        [key: string]: boolean;
    }>({});
    const [currentRow, setCurrentRow] = useState<number>(0);
    const [currentCol, setCurrentCol] = useState<number>(0);

    const inputRefsOne = useRef<(HTMLInputElement | null)[]>(
        Array(5).fill(null)
    );
    const inputRefsTwo = useRef<(HTMLInputElement | null)[]>(
        Array(5).fill(null)
    );
    const inputRefsThree = useRef<(HTMLInputElement | null)[]>(
        Array(5).fill(null)
    );
    const inputRefsFour = useRef<(HTMLInputElement | null)[]>(
        Array(5).fill(null)
    );
    const inputRefsFive = useRef<(HTMLInputElement | null)[]>(
        Array(5).fill(null)
    );

    const allInputValues = [
        inputValuesOne,
        inputValuesTwo,
        inputValuesThree,
        inputValuesFour,
        inputValuesFive,
    ];

    const setInputValuesFunctions = [
        setInputValuesOne,
        setInputValuesTwo,
        setInputValuesThree,
        setInputValuesFour,
        setInputValuesFive,
    ];

    const inputRefs = [
        inputRefsOne,
        inputRefsTwo,
        inputRefsThree,
        inputRefsFour,
        inputRefsFive,
    ];

    const handleSave = () => {
        const newColors = inputColors.slice();
        const newInvalidInputs: { [key: string]: boolean } = {};

        let anyCorrect = false;

        allInputValues.forEach((inputValues, rowIndex) => {
            let rowString = inputValues.join("");
            let tileChars = tile.split("");
            let inputColorsRow = Array(5).fill("white");

            inputValues.forEach((value, colIndex) => {
                if (!value || value.trim() === "") {
                    newInvalidInputs[`${rowIndex}-${colIndex}`] = true;
                } else {
                    if (value === tile[colIndex]) {
                        inputColorsRow[colIndex] = "green";
                        tileChars[colIndex] = "";
                    }
                }
            });

            inputValues.forEach((value, colIndex) => {
                if (
                    value &&
                    value !== tile[colIndex] &&
                    tileChars.includes(value)
                ) {
                    inputColorsRow[colIndex] = "yellow";
                    tileChars[tileChars.indexOf(value)] = "";
                }
            });

            newColors[rowIndex] = inputColorsRow;

            if (rowString === tile) {
                anyCorrect = true;
            }
        });

        setInvalidInputs(newInvalidInputs);
        setInputColors(newColors);

        if (anyCorrect) {
            alert("You Won!");
        } else {
            alert("you lose");
        }
    };

    const handleChange = (
        index: number,
        value: string,
        setInputValues: React.Dispatch<React.SetStateAction<string[]>>,
        inputRefs: React.RefObject<(HTMLInputElement | null)[]>
    ) => {
        setInputValues((prevValues) => {
            const newInputValues = [...prevValues];
            newInputValues[index] = value;

            let nextIndex = index;
            if (value.length === 1 && index < 4) {
                nextIndex = index + 1;
            } else if (value.length === 0 && index > 0) {
                nextIndex = index - 1;
            }

            if (nextIndex >= 0 && nextIndex < 5 && inputRefs.current) {
                inputRefs.current[nextIndex]?.focus();
            }

            return newInputValues;
        });

        const key = `${inputRefs.current?.indexOf(
            inputRefs.current[index]
        )}-${index}`;
        setInvalidInputs((prev) => {
            const newInvalidInputs = { ...prev };
            delete newInvalidInputs[key];
            return newInvalidInputs;
        });
    };

    const handleKeyPress = (key: string) => {
        const currentInputValues = allInputValues[currentRow];
        const setCurrentInputValues = setInputValuesFunctions[currentRow];
        const currentInputRefs = inputRefs[currentRow];

        if (key === "BACKSPACE") {
            const newValues = [...currentInputValues];
            newValues[currentCol - 1] = "";
            setCurrentInputValues(newValues);
            setCurrentCol(Math.max(0, currentCol - 1));
            if (currentInputRefs.current[currentCol - 1]) {
                currentInputRefs.current[currentCol - 1]?.focus();
            }
        } else if (key === "ENTER") {
            if (currentCol === 5) {
                handleSave();
                setCurrentRow((prev) => prev + 1);
                setCurrentCol(0);
            }
        } else if (currentCol < 5) {
            const newValues = [...currentInputValues];
            newValues[currentCol] = key;
            setCurrentInputValues(newValues);
            setCurrentCol(currentCol + 1);
            if (currentInputRefs.current[currentCol]) {
                currentInputRefs.current[currentCol]?.focus();
            }
        
        }
    };
  
    return (
        <div id="cube">
            <div className="container">
                      <div className="play">
                        <h1>{tile}</h1>
                        <div className="play-row-inputs">
                            {allInputValues.map((inputValues, rowIndex) => (
                                <div key={`group-${rowIndex}`}>
                                    {inputValues.map((value, colIndex) => {
                                        const key = `${rowIndex}-${colIndex}`;
                                        const backgroundColor =
                                            inputColors[rowIndex][colIndex];

                                        return (
                                            <input
                                                key={`input-${rowIndex}-${colIndex}`}
                                                type="text"
                                                value={value}
                                                maxLength={1}
                                                ref={(el) => {
                                                    inputRefs[rowIndex].current[
                                                        colIndex
                                                    ] = el;
                                                }}
                                                onChange={(e) =>
                                                    handleChange(
                                                        colIndex,
                                                        e.target.value,
                                                        setInputValuesFunctions[
                                                            rowIndex
                                                        ],
                                                        inputRefs[rowIndex]
                                                    )
                                                }
                                                style={{ backgroundColor }}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    <div className="wordle-text">
                        <p>Wordle #195</p>
                        <p>12/31/2021</p>
                    </div>
                    </div>
                <Keyboard onKeyPress={handleKeyPress} />
                <button
                    style={{
                        padding: "18px 40px",
                        borderRadius: "15px",
                        marginLeft: "590px",
                        display: "flex",
                        marginTop: "20px",
                    }}
                    onClick={handleSave}
                >
                    Save
                </button>
                </div>
. 
            </div>
    );
};

export default Cube;