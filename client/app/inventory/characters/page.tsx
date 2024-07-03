"use client"
import DisplayCharacter from "@/components/DisplayCharacter";
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

interface Character {
    name: string
    link: string
}

const Characters = () => {
    const supabase = createClient()
    const [characters, setCharacters] = useState<Character[]>([])
    const [userCharacters, setUserCharacters] = useState<string[]>([])
    const [id, setId] = useState<string | null>(null)

    useEffect(()=> {
        const fetchCharacter = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user) {
                console.error('Error fetching user:')
                return;
            }
            const current_id = user?.id;
            setId(user.id)

            const { data, error } = await supabase.from('characters').select('*')
            if (error) console.log('error', error)
            
            if (data)
            setCharacters(data)

            const { data: characters, error: error2 } = await supabase.from("profiles").select("*").eq("id", current_id)
            if (error2) console.log('error', error2)
            console.log(characters)
            
        }
        fetchCharacter()
    
    }, [])

    const handleCharacterClick = (characterName: string) => {
        setUserCharacters(prev => {
            if (prev.includes(characterName)) {
                return prev.filter(name => name !== characterName);
            } else {
                return [...prev, characterName];
            }
        });
    };
    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Select the characters that you have!</h1>
            <div className="flex flex-wrap justify-center w-full">
                {characters.map((character) => (
                    <DisplayCharacter 
                        character={character}
                        userCharacters={userCharacters}
                        handleCharacterClick={handleCharacterClick}
                    />
                ))}
            </div>
            
        </div>
    )
}

export default Characters;