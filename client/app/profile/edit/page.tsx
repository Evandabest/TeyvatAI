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
    }, [])

    const newFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return;
        }
        console.log(file)
        setNewPfp(file)
    }

    const edit = async () => {
        if (newPfp) {
            const time = Date.now()
            const {data, error} = await supabase.storage.from('pfp').upload(`${id}_${time}`, newPfp)
            if (error) {
                console.error('Error uploading pfp:', error);
                return;
            }

            console.log(data)

            const { data: {publicUrl} } = supabase
            .storage
            .from('pfp')
            .getPublicUrl(`${id}_${time}.png`)
            if (!publicUrl) {
                console.error('Error fetching public url');
                return;
            }
            console.log(publicUrl)

            setData(prevData => ({
                ...prevData,
                pfp: publicUrl
            }))
        }
        const {data: updatedData, error} = await supabase.from('profiles').update({
            pfp: data.pfp,
            username: data.username,
            Ar: data.Ar,
            email: data.email
        }).eq('id', id)
        if (error) {
            console.error('Error updating profile:', error);
            return;
        }
        //router.push('/profile')
    }

        


    const changeInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    

    return (
        <>   
            <form>
                <img src={data.pfp ?? undefined} alt="Profile Picture" />
                <Input type="file" onChange={newFile} name="file" />
                <Input name="username" onChange={changeInfo} value={data.username ?? ""} />
                <Input name="Ar" onChange={changeInfo} value={data.Ar ?? ""}/>
                <Input name="email" onChange={changeInfo} value={data.email ?? ""}/>
                <Button type="submit" onClick={edit}>Edit </Button>
            </form>
        </>
    )
}

export default Edit
