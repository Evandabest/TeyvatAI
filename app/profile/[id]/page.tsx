import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

const user = async ({params}: {params: {id: string}}) => {
    const {id} = params;
    const supabase = createClient();
    const {data, error} = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) {
        console.error(error);
        return;
    }
    const userName = data?.username;

    return (
        <div>
            <h1>{userName}</h1>
            <Button>Add friend</Button>
        </div>
    );
}

export default user;