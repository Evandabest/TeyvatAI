"use server"
import { createClient } from "@/utils/supabase/server"

const Post = async ({id} : {id: string}) => {
    console.log(id)
    const supabase = createClient();
    const getPost = async () => {
        const {data, error} = await supabase.from('posts').select('*').eq('id', id);
        if (error) {
            throw error;
        }
        return data
    }
    const post = await getPost();
    if (!post) {
        return <div>Post not found</div>
    }
    console.log(post[0].postId)
    const getUserName = async () => {
        const {data, error} =  await supabase.from('profiles').select('*').eq('id', post[0].postId);
        if (error) {
            throw error;
        }
        return data
    }

    const user = await getUserName();
    console.log(user[0].username)

    return (
        <div className=" flex flex-col border m-auto border-gray-300 w-[80%] h-[50%]">
            <div className="flex flex-row ml-3 mt-3 items-center space-x-4">
                <img className="rounded-full w-10" src={user[0].pfp} alt={user[0].username} />
                <h3 className="text-lg font-semibold">{user[0] && user[0]?.username}</h3>
            </div>
            <div className="flex flex-col ml-3 mt-2 ">
                <h3 className="text-lg font-semibold flex justify-start">{post[0].title}</h3>
                <div className="w-[80%] items-center m-auto">
                    <img className=" h-full w-full m-auto" src={post[0].picture} alt={post[0].title} />
                </div>
            </div>
            <p className="mx-2">{post[0].description}</p>
      </div>
    )
}

export default Post