"use server"
import { createClient } from "@/utils/supabase/server";
import AddFriend from "./addFriend";

const User = async ({params}: {params: {id: string}}) => {
    const {id} = params;
    const supabase = createClient();
    const {data, error} = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) {
        console.error(error);
        return;
    }
    const userName = data?.username;

    const {data: {user}} = await supabase.auth.getUser();
    const sid = user?.id;
    if (!sid) {
        console.error("You must be logged in to add a friend");
        return;
    }
    if (sid == id) {
        console.error("You can't add yourself as a friend");
    }

    return (
        <div>
            <form>
                <h1>{userName}</h1>
                <AddFriend props = {{id, sid}} />
            </form>
        </div>
    );
}

export default User;