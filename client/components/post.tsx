"use server"
import { createClient } from "@/utils/supabase/server"

const Post = async ({id} : {id: string}) => {
    console.log(id)
    const supabase = createClient();
    const {data, error} = await supabase.from('posts').select('*').eq('id', id);
    if (error) {
        throw error;
    }
    console.log(data)
    return (
        <div className="border border-gray-300 p-4 my-4">
            <h3 className="text-lg font-semibold">{data[0].title}</h3>
            <img src={data[0].picture} alt={data[0].title} />
            <p>{data[0].description}</p>
      </div>
    )
}

export default Post