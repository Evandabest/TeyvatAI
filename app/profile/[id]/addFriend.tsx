"use client"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"


const AddFriend = ({props}: {props: {id: string, sid: string}}) => {

    const id = props.id;
    const sid = props.sid;

    const supabase = createClient();
    const addFriends = async (event: React.MouseEvent) => {
        event.preventDefault();
        try {
            const { error } = await supabase.from('friend_requests').insert({sender_id: sid, receiver_id: id});
            if (error) {
                console.error('Error adding friend:', error);
            } else {
                console.log("friend added");
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }

    return (
        <>
            <Button onClick={addFriends}>Add friend</Button>
        </>
    );
}

export default AddFriend;