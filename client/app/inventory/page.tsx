"use server"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import 'boxicons/css/boxicons.min.css'; 

const Inventory = () => {

    const goToCharacters = async () => {
        "use server"
        redirect('/inventory/characters')
    }

    const goToTeams = async () => {
        "use server"
        redirect('/inventory/teams')
    }

    const goToNotes = async () => {
        "use server"
        redirect('/inventory/notes')
    }

    return (
        <div>
            <form className="flex flex-col m-auto justify-evenly items-center mt-24 space-y-20">
                <Button className="p-8" formAction = {goToCharacters} type="submit"><i className='bx bx-lg bxs-user-voice'></i></Button>
                <Button className="p-8" formAction = {goToTeams} type = "submit"><i className='bx bx-lg bx-street-view'></i></Button>
                <Button className="p-8" formAction = {goToNotes} type = "submit"><i className='bx bx-lg bxs-notepad' ></i></Button>
            </form>
        </div>
    );
}

export default Inventory;