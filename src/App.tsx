import React, { useEffect, useState } from "react";
import "./App.css";
import Cube from "./components/Cube/Cube";

export default function App() {
  const [tiles, setTiles] = useState<string[]>(Array(30).fill(""));

  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await fetch("https://piccolo-server.vercel.app/words");
        const data = await response.json();
        const words: string[] = data.data;
        const randomIndex: number = Math.floor(Math.random() * words.length);
        const randomWord: string = words[randomIndex];
        updateTiles(randomWord);
      } catch (error) {
        console.error("Error fetching random word:", error);
      }
    };

    fetchRandomWord();
  }, []); 

  const updateTiles = (word: string) => {
    const newTiles: string[] = [...word.toUpperCase().split(""), ...Array(30 - word.length).fill("")];
    setTiles(newTiles);
  };

  const handleTileChange = (index: number, value: string) => {
    const newTiles: string[] = [...tiles];
    newTiles[index] = value.toUpperCase(); 
    setTiles(newTiles);
  };

  return (
    <div className="App">
      <Cube tiles={tiles} onTileChange={handleTileChange}  />
    </div>
  );
}