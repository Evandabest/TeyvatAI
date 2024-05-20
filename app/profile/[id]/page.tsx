import { createClient } from "@/utils/supabase/server";

const user = async ({params}: {params: {id: string}}) => {
    const {id} = params;
    const supabase = createClient();
    const {data, error} = await supabase.from('profiles').select('*').eq('id', id).single();
    console.log(data);

    return (
        <div>
            <h1>{data.userName}</h1>
        </div>
    );
}

export default user;