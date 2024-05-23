"use client"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"


const AddFriend = async ({params}: {params: {id: string, sid: string}}) => {

    const id = params.id;
    const sid = params.sid;

    const supabase = createClient();
    const addFriends = async () => {
        const {data, error} = await supabase.from('friend_requests').insert({sender_id: sid, receiver_id: id});
    }

    return (
        <>
            <Button onClick={addFriends}>Add friend</Button>
        </>
    );
}

export default AddFriend;