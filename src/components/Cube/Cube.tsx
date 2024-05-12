import React from "react";
import "../Cube/Cube.css";

interface BoardProps {
  tiles: string[];
  onTileChange: (index: number, value: string) => void;
}

const Cube: React.FC<BoardProps> = ({ tiles, onTileChange }) => {
  const firstFiveTiles = tiles.slice(0, 25);

  return (
    <div id="cube">
      <div className="container">
        <div className="play">
          <div className="play__row">
            <div className="play-row-inputs">
              {firstFiveTiles.map((letter, index) => (
                <input
                  key={index}
                  type="text"
                  value={letter}
                  onChange={(e) =>
                    onTileChange(index, e.target.value)
                  }
                />
              ))}
              <div className="wordle-text">
                <p>Wordle #195</p>
                <p>12/31/2021</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cube;
