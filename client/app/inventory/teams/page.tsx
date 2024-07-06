"use client"
import { createClient } from "@/utils/supabase/client";
import { use, useEffect, useState } from "react";
import { Character } from "../characters/page";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  

interface Team {
    member1: string;
    member2?: string;
    member3?: string;
    member4?: string;
}

const Teams = () => {
    const supabase = createClient();
    const [teams, setTeams] = useState<any[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [userCharacters, setUserCharacters] = useState<string[]>([]);
    const [newTeam, setNewTeam] = useState<string[]>([]);
    const [id, setId] = useState<string | undefined>("");
    const [sent, setSent] = useState<boolean>(false);

    useEffect(() => {
        const fetchTeams = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const current_id = user?.id;
            setId(current_id);
            const { data: characters, error: error2 } = await supabase.from("profiles").select("characters").eq("id", current_id);
            if (error2) console.log('error', error2);
            if (characters) {
                setUserCharacters(characters[0].characters);
            }
            const { data: charactersData, error: error3 } = await supabase.from('characters').select('*');
            if (error3) console.log('error', error3);
            if (charactersData) setCharacters(charactersData);
        }
        fetchTeams();
    }
    , [supabase, id]);

    useEffect(() => {
        const fetchTeams = async () => {
            if (id) {
                const { data, error } = await supabase.from('profiles').select('teams').eq('id', id);
                if (error) console.log('error', error);
                if (data) setTeams(data[0].teams);
            } 
            else {
                const { data: { user } } = await supabase.auth.getUser();
                const current_id = user?.id;
                const { data, error } = await supabase.from('profiles').select('teams').eq('id', current_id);
                if (error) console.log('error', error);
                if (data) setTeams(data[0].teams);
                
            }
        }
        fetchTeams();
    }, [supabase, sent, id]);

    const addToTeam = (character: string, link: string) => {
        if (newTeam.length < 4 && !newTeam.includes(character)) {
            setNewTeam([...newTeam, character]);
        }
    }

    const updateTeams = async () => {
        let sendTeam;
        if (teams.length === 0) {
            sendTeam = [newTeam];
        }
        else {
            sendTeam = [...teams, newTeam];
        }

        const { data, error } = await supabase.from('profiles').update({ teams: sendTeam }).eq('id', id);
        if (error) console.log('error', error);
        setNewTeam([]);
        setSent(!sent);
    }

    const deleteTeam = async (teamed: any[]) => {
        const { data, error } = await supabase.from('profiles').update({ teams: teams.filter((team) => team !== teamed) }).eq('id', id);
        if (error) console.log('error', error);
        setSent(!sent);
    }



    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="font-bold">Teams</h1>
                <div>
                <AlertDialog>
                    <AlertDialogTrigger className="bg-gray-600 text-white p-2 rounded-md" >Add a new Team</AlertDialogTrigger>
                    <AlertDialogContent className="flex flex-wrap">
                        <AlertDialogHeader>
                        <AlertDialogTitle>Make a team</AlertDialogTitle>
                        <div className = "flex flex-row space-x-2">
                            {newTeam.map((character, index) => {
                                return (
                                    <div key={index} onClick = {() => setNewTeam(newTeam.filter((name) => name !== character))}>
                                        <img src={characters.find((char) => char.name === character)?.link} alt={character} />
                                        <p>{character}</p>
                                    </div>
                                );
                            })}
                        </div>
                        </AlertDialogHeader>
                        <div className="flex flex-wrap overflow-scroll h-72 space-x-2 space-y-2">
                            {characters.map((character) => {
                                return userCharacters.includes(character.name) ? (
                                    <div className="flex items-center justify-center flex-col" onClick={() => addToTeam(character.name, character.link)}>
                                        <img src={character.link} alt={character.name} />
                                        <p>{character.name}</p>
                                    </div>
                                ): null;
                            })}
                        </div>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction><Button onClick={updateTeams}>Save</Button></AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
                <div className="flex flex-col items-center justify-center mt-12">
                    {teams.map((team, index) => { 
                        return (
                            <div key={index} className="flex flex-row border-2 my-2 rounded-md border-black">
                                    {team.map((member : any, index: any) => {
                                        return (
                                            <div key={index} className="flex flex-col w-24 m-4 text-center items-center">
                                                <img src={characters.find((char) => char.name === member)?.link} alt={member} className="w-24 h-24" />
                                                <div className="flex flex-wrap">
                                                    <p>{member}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <Button onClick={() => deleteTeam(team)}> X </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Teams;