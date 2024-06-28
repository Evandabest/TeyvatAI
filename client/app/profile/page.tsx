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
            <form>
                <img src={data[0].pfp} alt="Profile Picture" />
                <p>Username: {data[0].username}</p>
                <p>Adventure Rank: {data[0].Ar}</p>
                <p>Email: {data[0].email}</p>
                <Button type="submit" formAction={goToEdit}></Button>
            </form>
        </>
    )
}

export default Profile