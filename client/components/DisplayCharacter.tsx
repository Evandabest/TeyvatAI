"use client"
import { useEffect, useState } from "react"

interface Character {
    name: string
    link: string
}

const DisplayCharacter = ({character, userCharacters, handleCharacterClick}: {character: Character, userCharacters: string[], handleCharacterClick: any}) => {
    const [clicked, setClicked] = useState<boolean>(false)
    
    useEffect(() => {
        setClicked(userCharacters.includes(character.name));
        
    }, [character.name, userCharacters]);

    const handleClick = (name: string) => {
        handleCharacterClick(name);
    }

    return (
        <div
            id={character.name}
            onClick={() => handleClick(character.name)}
            className={`cursor-pointer p-4 m-2 rounded-lg shadow-lg ${clicked ? 'bg-gray-400' : 'bg-transparent'} hover:bg-gray-200`}
        >
            <img src={character.link} alt={character.name} className="w-full h-auto rounded-t-lg" />
            <h1 className="text-lg font-bold text-center mt-2">{character.name}</h1>
        </div>
    );
}

export default DisplayCharacter

