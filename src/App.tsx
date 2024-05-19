import React, { useEffect, useState } from "react";
import "./App.css";
import Cube from "./components/Cube/Cube";


export default function App() {
    const [tile, setTile] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchRandomWord = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    "https://piccolo-server.vercel.app/words"
                );
                const data = await response.json();
                const words: string[] = data.data;
                const randomIndex: number = Math.floor(
                    Math.random() * words.length
                );
                const randomWord: string = words[randomIndex];
                setTile(randomWord);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching random word:", error);
                setLoading(false);
            }
        };

        fetchRandomWord();
    }, []);

    return (
        <div className="App">
            <Cube tile={tile} loading={loading} />
        </div>
    );
}