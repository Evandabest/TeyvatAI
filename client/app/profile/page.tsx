import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

const Profile = async () => {
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();
    const id = user?.id;
    const {data, error} = await supabase.from('profiles').select('*').eq('id', id)
    if (error) {
        console.error('Error fetching chats:', error);
        return;
    }

    const goToEdit = async (formData: FormData) => {
        "use server"
        redirect("/profile/edit") 
    }

    return (
        <>    
            <form className="flex flex-col border-2 shadow-md shadow-black p-4 w-96 m-auto items-center justify-center mt-12">
                <img className="rounded-full mb-8 h-24 w-24" src={data[0].pfp} alt="Profile Picture" />
                <p>Display name: </p>
                <p> {data[0].username}</p>
                <p>Adventure Rank: </p>
                <p> {data[0].Ar}</p>
                <p>Email: </p>
                <p> {data[0].email}</p>
                <Button className="mt-4" type="submit" formAction={goToEdit}>Edit</Button>
            </form>
        </>
    )
}

export default Profile