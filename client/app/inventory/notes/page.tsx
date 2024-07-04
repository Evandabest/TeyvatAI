"use client"
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";

interface Note {
    note: string;
    completed: boolean;
}

const Notes = () => {
    const supabase = createClient();
    const [notes, setNotes] = useState<any[]>([]);
    const [id, setId] = useState<string | null>(null);
    const [newNote, setNewNote] = useState<string | null>(null);
    const [sent, setSent] = useState<boolean>(false);
    useEffect(() => {
        const fetchNotes = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const current_id = user?.id;
            if (user) setId(user.id);
            const { data, error } = await supabase.from("notes").select("note").eq("id", current_id);
            if (error) console.log('error', error)
            if (data) {
                setNotes(data[0].note);
                
            }
        }
        fetchNotes();
    }, [supabase, sent]);
    
    useEffect(() => {
        const getNote = async () => {
            if (!id) return;
            const { data, error } = await supabase.from("notes").select("note").eq("id", id);
            if (error) console.log('error', error)
            if (data) setNotes(data[0].note);
        }
        getNote();
    }, [supabase, sent, id]);
    const addNote = async () => {
        let notesCopy: any[] = notes;
        if (notesCopy.length === 0) {
            notesCopy = [newNote];
        }
        else {
            notesCopy = [...notes, newNote];
        }
        const { data, error } = await supabase.from("notes").update({note: notesCopy}).eq("id", id);
        if (error) console.log('error', error);
        if (data) setNotes(data);
        setSent(!sent);
    }
    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Notes</h1>
            <div>
            <AlertDialog>
                    <AlertDialogTrigger>Add Note</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Add a new note</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-row">
                            <Input type="text" onChange={(e) => setNewNote(e.target.value)} />
                        </div>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction><Button onClick={addNote}>Save</Button></AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <ul>
                {notes.map((item, index) => {
                    return <li key={index}>{item}</li>
                })}
            </ul>
        </div>
    );
}

export default Notes;