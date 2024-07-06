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
        <>
            <form className="flex flex-col border-2 shadow-md shadow-black p-4 w-96 m-auto items-center justify-center mt-12">
                <img className="rounded-full mb-8 h-24 w-24" src={data.pfp} alt="Profile Picture" />
                <p>Display name: </p>
                <p> {data.username}</p>
                <p>Adventure Rank: </p>
                <p> {data.Ar}</p>
                <div className="my-4">
                    <AddFriend props = {{id, sid}}/>
                </div>
            </form>
        </>
    );
}

export default User;