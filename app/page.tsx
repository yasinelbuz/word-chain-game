"use client";

import { ApiResponse, IwordListArray } from "@/types/word-result";
import React, { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [lastWord, setLastWord] = useState<string>("");
  const [wordList, setWordList] = useState<IwordListArray | null>(null);
  const [error, setError] = useState<string>("");

  // const rePlayGame = () => {
  //   setInputValue("");
  //   setLastWord("");
  //   setAttempts(5);
  //   setWordList(null);
  //   setError("");
  // };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!inputValue) {
      return;
    }

    try {
      const res = await fetch(`/api?word=${encodeURIComponent(inputValue)}`);
      const data: ApiResponse = await res.json();

      if (Array.isArray(data)) {
        const newWord = data[0].sozu;
        const isWordAlreadyUsed = wordList?.some(
          (item) => item.word === newWord
        );

        const isFirstWordOrMatchesLastLetter =
          !lastWord ||
          newWord.toLowerCase().charAt(0) ===
            lastWord.toLowerCase().charAt(lastWord.length - 1);

        if (!isWordAlreadyUsed) {
          if (isFirstWordOrMatchesLastLetter) {
            setLastWord(newWord);
            setError("");
            addWordToList(newWord, true);
          } else {
            setError("Kelime son harfle başlamıyor!");
            addWordToList(newWord, false);
          }
        } else {
          setError("Bu kelime zaten kullanılmış!");
          addWordToList(newWord, false);
        }
      } else {
        setError("Yazdığınız kelime Türkçe sözlükte bulunmamaktadır!");
        addWordToList(inputValue, false);
      }

      setInputValue("");
    } catch (e) {
      console.log(e);
    }
  };

  // Yardımcı fonksiyon
  function addWordToList(word: string, isRight: boolean) {
    setWordList((prev) =>
      prev ? [...prev, { word, isRight }] : [{ word, isRight }]
    );
  }

  return (
    <div className="h-screen w-full">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 h-screen bg-purple-500 flex flex-col justify-center items-center">
          <h1 className="mb-4 font-extrabold text-2xl text-purple-950">
            <span className="bg-white rounded-md">⛓️‍💥</span> Word Chain
          </h1>
          <form onSubmit={handleSubmit} className="w-1/2">
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder="Kelime yaz"
              className="block w-full p-2 border border-gray-300 rounded-md mb-4 text-center text-black"
            />
            <button
              type="submit"
              className="w-full p-2 bg-purple-800 text-white rounded-md hover:bg-purple-900"
            >
              Dene
            </button>
          </form>
          <div className="text-center mt-4">
            <div className="text-purprle-300 underline">{error && error}</div>
            <div>{lastWord && "Son kelime: " + lastWord}</div>
          </div>
        </div>
        <div className="md:w-1/2 w-full p-12 bg-orange-100 text-black overflow-hidden">
          <h2 className="text-xl font-bold mb-2 underline">
            Kullanılan Kelimeler
          </h2>
          <ul className="list-disc pl-5 overflow-y-auto h-[calc(100vh-10rem)] mt-4">
            {wordList &&
              wordList.map((word, index) => (
                <li key={index}>
                  {word.word} {word.isRight ? "✅" : "❌"}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
