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
            // Check if a friend request already exists from the receiver to the sender
            const { data: existingRequests, error: fetchError } = await supabase
                .from('friend_requests')
                .select('*')
                .eq('sender_id', id)
                .eq('receiver_id', sid) ||
                await supabase.from('friend_requests')
                .select('*')
                .eq('sender_id', sid)
                .eq('receiver_id', id);
    
            if (fetchError) {
                console.error('Error fetching existing friend requests:', fetchError);
                return;
            }
    
            if (existingRequests && existingRequests.length > 0) {
                const existingRequest = existingRequests[0];
                if (existingRequest.status !== 'accepted') {
                    const { error: updateError } = await supabase
                        .from('friend_requests')
                        .update({ status: 'pending' })
                        .eq('id', existingRequest.id);
            
                    if (updateError) {
                        console.error('Error updating friend request status:', updateError);
                        return;
                    }
            
                    console.log('Friend request status updated to pending');
                    return;
                }
            
                console.log('Friend request already exists and is accepted');
                return;
            }
    
            // If no existing request, proceed with adding a new one
            const { error: insertError } = await supabase
                .from('friend_requests')
                .insert({sender_id: sid, receiver_id: id});
    
            if (insertError) {
                console.error('Error adding friend:', insertError);
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