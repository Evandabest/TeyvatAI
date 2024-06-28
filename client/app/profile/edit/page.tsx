"use server"
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

interface profileInfo {
    pfp: File | null;
    username: string | null;
    Ar: number | null;
    email: string | null;

}

const Edit = async () => {
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();
    const id = user?.id;
    const {data, error} = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) {
        console.error('Error fetching chats:', error);
        return;
    }

    const edit = async (formData: FormData) => {
        "use server"
        const supabase = createClient()
        const newInfo: profileInfo = {
            pfp: formData.get('file') as File,
            username: formData.get('username') as string,
            Ar: parseInt(formData.get('Ar') as string),
            email: formData.get('email') as string
        }
        console.log(newInfo)
        
        const {data, error} = await supabase.from('profiles').update(
            [{
                pfp: newInfo.pfp,
                username: newInfo.username,
                Ar: newInfo.Ar,
                email: newInfo.email
            }]
        ).eq('id', id)

        if (error) {
            console.error('Error updating profile:', error);
            return;
        }

        console.log(newInfo)

        redirect("/profile")
    }
    

    return (
        <>   
            <form>
                <img src={data.pfp} alt="Profile Picture" />
                <Input type="file" name="file" />
                <Input name="username" defaultValue={data.username}/>
                <Input name="Ar" defaultValue={data.Ar}/>
                <Input name="email" defaultValue={data.email}/>
                <Button type="submit" formAction={edit}>Edit </Button>
            </form>
        </>
    )
}

export default Edit
