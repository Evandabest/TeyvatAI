"use server"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const Inventory = () => {

    const goToCharacters = async () => {
        "use server"
        redirect('/inventory/characters')
    }

    const goToTeams = async () => {
        "use server"
        redirect('/inventory/characters')
    }

    const goToNotes = async () => {
        "use server"
        redirect('/inventory/characters')
    }

    return (
        <div>
            <form className="flex flex-col m-auto justify-evenly items-center">
                <Button formAction = {goToCharacters} type="submit">Characters</Button>
                <Button formAction = {goToTeams} type = "submit">Teams</Button>
                <Button formAction = {goToNotes} type = "submit">Notes</Button>
            </form>
        </div>
    );
}

export default Inventory;