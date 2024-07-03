"use client"
import { useEffect, useState } from "react"

interface Character {
    name: string
    link: string
}

const DisplayCharacter = ({character, userCharacters, handleCharacterClick}: {character: Character, userCharacters: string[], handleCharacterClick: any}) => {
    const [clicked, setClicked] = useState<boolean>(false)
    
    useEffect(() => {
        if (userCharacters.length === 0) {
            setClicked(false);
        } else {
        setClicked(userCharacters.includes(character.name));
        }
    }, [character, userCharacters]); 

    return (
        <>
            {clicked? (
                <div
                    id={character.name}
                    onClick={() => handleCharacterClick(character.name)}
                    className={`cursor-pointer bg-gray-400 p-4 m-2 rounded-lg shadow-lg hover:bg-gray-200`}
                >
                    <img src={character.link} alt={character.name} className="w-full h-auto rounded-t-lg" />
                    <h1 className="text-lg font-bold text-center mt-2">{character.name}</h1>
                </div>
            ) : (
                <div
                    id={character.name}
                    onClick={() => handleCharacterClick(character.name)}
                    className='cursor-pointer bg-transparent p-4 m-2 rounded-lg shadow-lg hover:bg-gray-200'
                >
                    <img src={character.link} alt={character.name} className="w-full h-auto rounded-t-lg" />
                    <h1 className="text-lg font-bold text-center mt-2">{character.name}</h1>
                </div>
            )}
        </>
    );
}

export default DisplayCharacter

