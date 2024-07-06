"use client"
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface profileInfo {
    pfp: string | null;
    username: string | null;
    Ar: number | null;
    email: string | null;

}

const Edit = () => {
    const supabase = createClient()
    const router = useRouter()
    const [data, setData] = useState<profileInfo>({
        pfp: "",
        username: "",
        Ar: 0,
        email: ""
    })
    const [newPfp, setNewPfp] = useState<File | undefined>()
    const [id, setId] = useState<string | undefined>()

    useEffect(() => {
        const getData = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const id = user?.id;
            setId(id)
            const {data, error} = await supabase.from('profiles').select('*').eq('id', id).single()
            if (error) {
                console.error('Error fetching chats:', error);
                return;
            }
            if (!data) {
                console.error('Profile not found');
                return;
            }
            setData(data)
        }
        getData()
    }, [supabase])

    const newFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return;
        }
        console.log(file)
        setNewPfp(file)
    }

    const getURL = async (link:string) => {
        const { data: {publicUrl} } = await supabase.storage.from('pfp').getPublicUrl(link);
            if (!publicUrl) {
                console.error('Error fetching public url');
                return;
        }
        return publicUrl
    }

    const edit = async (e: any) => {
        e.preventDefault()
        let updatedProfile = { ...data }
        if (newPfp) {
            const time = Date.now()
            const {data, error} = await supabase.storage.from('pfp').upload(`${id}_${time}`, newPfp)
            if (error) {
                console.error('Error uploading pfp:', error);
                return;
            }
            const publicUrl = await getURL(`${id}_${time}`)
            if (!publicUrl) {
                console.error('Error fetching public url');
                return;
            }
            updatedProfile.pfp = publicUrl
        
        }
        const { data: updatedData, error: updateError } = await supabase.from('profiles').update({
            pfp: updatedProfile.pfp, 
            username: updatedProfile.username,
            Ar: updatedProfile.Ar,
            email: updatedProfile.email
        }).eq('id', id);
        
        if (updateError) {
            console.error('Error updating profile:', updateError);
            return;
        }
        router.push('/profile')
    }

        


    const changeInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    

    return (
        <>   
            <form className="flex flex-col border-2 shadow-md shadow-black p-4 w-96 m-auto items-center justify-center mt-12 space-y-4">
                <img className="rounded-full h-24 w-24 mb-4" src={data.pfp ?? undefined} alt="Profile Picture" />
                <p>Select new profile picture</p>
                <Input type="file" onChange={newFile} name="file" />
                <p>Display name:</p>
                <Input name="username" onChange={changeInfo} value={data.username ?? ""} />
                <p>Adventure Rank</p>
                <Input name="Ar" onChange={changeInfo} value={data.Ar ?? ""}/>
                <p>Email</p>
                <Input name="email" onChange={changeInfo} value={data.email ?? ""}/>
                <Button type="submit" onClick={(e) => edit(e)}>Confirm changes </Button>
            </form>
        </>
    )
}

export default Edit
