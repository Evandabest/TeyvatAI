"use client"
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { randomUUID } from "crypto";
// Import v4 as uuidv4 from the uuid library
import { v4 as uuidv4 } from 'uuid';

interface profileInfo {
    title: string | null;
    picture: string | null;
    description: string | null;
    Ar: number | null;
    postId: string | null;

}

const Post = () => {
    const supabase = createClient()
    const router = useRouter()
    const [data, setData] = useState<profileInfo>({
        title: "",
        picture: "",
        description: "",
        Ar: 0,
        postId: ""
    })
    const [postPic, setPostPic] = useState<File | undefined>()
    const [id, setId] = useState<string | undefined>()
    const [posts, setPosts] = useState<any>([])

    useEffect(() => {
        const getData = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const id2 = user?.id;
            setId(id2)
            const { data, error } = await supabase.from('profiles').select('*').eq('id', id2)
            if (error) {
                console.error('Error fetching posts:', error);
                return;
            }
            console.log(data[0].posts)
            setPosts(data[0].posts)

        }
        getData()
    }, [supabase])

    const newFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return;
        }
        console.log(file)
        setPostPic(file)
    }

    const getURL = async (link:string) => {
        const { data: {publicUrl} } = await supabase.storage.from('posts').getPublicUrl(link);
        if (!publicUrl) {
            console.error('Error fetching public url');
            return;
        }
        const { data, error } = await supabase.from('profiles').select("Ar").eq("id", id)
        if (error) {
            console.error('Error fetching profile:', error);
            return;
        }
        return {publicUrl:publicUrl, Ar:data[0].Ar}
    }



    const posted = async (e: any) => {
        e.preventDefault()
        let updatedProfile = { ...data }
        if (postPic) {
            const time = Date.now()
            const {data, error} = await supabase.storage.from('posts').upload(`${id}_${time}`, postPic)
            if (error) {
                console.error('Error uploading pfp:', error);
                return;
            }
            const info = await getURL(`${id}_${time}`)
            if (!info) {
                console.error('Error fetching public url');
                return;
            }
            if (!info.publicUrl) {
                console.error('Error fetching public url');
                return;
            }

            updatedProfile.picture = info.publicUrl
            updatedProfile.Ar = info.Ar
        
        }

        const postedId = uuidv4()
       
        const { data: updatedData, error: updateError } = await supabase.from('posts').insert({
            id: postedId,
            title: updatedProfile.title,
            picture: updatedProfile.picture,
            description: updatedProfile.description,
            Ar: updatedProfile.Ar,
            postId: id
        });
        
        if (updateError) {
            console.error('Error updating profile:', updateError);
            return;
        }
        let latestPost = posts ? [...posts.flat(), postedId] : [postedId];
        
        const data1 = await supabase.from('profiles').update({
            posts: latestPost
        }).eq('id', id)

        router.push('/home')
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
                {postPic && <img src={URL.createObjectURL(postPic)} alt="Post Picture" />}
                <Input type="file" onChange={newFile} name="file" />
                <Input name="title" onChange={changeInfo} value={data.title ?? ""} />
                <Input name="description" onChange={changeInfo} value={data.description ?? ""}/>
                <Button type="submit" onClick={(e) => posted(e)}>Post </Button>
            </form>
        </>
    )
}

export default Post
