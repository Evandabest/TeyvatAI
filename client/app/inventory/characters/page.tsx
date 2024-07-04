"use client"
import DisplayCharacter from "@/components/DisplayCharacter";
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export interface Character {
    name: string
    link: string
}

const Characters = () => {
    const supabase = createClient()
    const [characters, setCharacters] = useState<Character[]>([])
    const [userCharacters, setUserCharacters] = useState<string[]>([])
    const [id, setId] = useState<string | null>(null)
    const router = useRouter()

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

            const { data: characters, error: error2 } = await supabase.from("profiles").select("characters").eq("id", current_id)
            if (error2) console.log('error', error2)
            if (characters) {
                setUserCharacters(characters[0].characters)
            }
            
        }
        fetchCharacter()
    
    }, [supabase])

    const handleCharacterClick = (characterName: string) => {
        let latestCharacters;
        if (userCharacters) {
            if (userCharacters.includes(characterName)) {
                latestCharacters = userCharacters.filter(name => name !== characterName);
            } else {
                latestCharacters = [...userCharacters, characterName];
            }
        } else {
            latestCharacters = [characterName];
        }
        setUserCharacters(latestCharacters);
    };

    const handleSubmit = async () => {
        const { data, error } = await supabase.from('profiles').update({ characters: userCharacters }).eq('id', id)
        if (error) console.log('error', error)
        
        router.push('/inventory')
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Select the characters that you have!</h1>
            <div className="flex flex-wrap justify-center w-full">
                {characters.map((character) => (
                    <>
                    <DisplayCharacter 
                        character={character}
                        userCharacters={userCharacters}
                        handleCharacterClick={handleCharacterClick}
                    />
                    </>
                ))}
            </div>
            <Button onClick={handleSubmit}> Submit</Button>
            
        </div>
    )
}

export default Characters;