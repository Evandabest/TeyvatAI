"use client"
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const UpdateFriend = ({props}: {props: {id: string}}) => {
  
  const { id: senderId } = props
  const supabase = createClient()
  const accept = async (senderId: string) => {
    const {data: {user}} = await supabase.auth.getUser();
    if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email, 
            friends: supabase.from('profiles').select('friends').eq('id', user.id).then(({ data, error }) => {
              if (error) {
                console.error('Error fetching friends list: ', error);
                return [];
              } else {
                return [...(data[0]?.friends || []), senderId];
              }
            })
          }, { onConflict: 'id' });
    
        if (error) {
          console.error('Error updating friends list: ', error);
        } else {
          console.log('Successfully added friend: ', data);
        }

        const { data: requestData, error: requestError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id);

        if (requestError) {
        console.error('Error updating friend request status: ', requestError);
        } else {
        console.log('Successfully updated friend request status: ', requestData);
        }
    }
    }

    const reject = async (senderId: string) => {
    const {data: {user}} = await supabase.auth.getUser();
    
    if (user) {
        const { data, error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('sender', senderId)
        .eq('receiver', user.id);
    
        if (error) {
        console.error('Error updating friend request status: ', error);
        } else {
        console.log('Successfully updated friend request status: ', data);
        }
    }
    }
    

    return (
      <>
        <Button onClick={() => accept(senderId)}>Add Friend</Button>
        <Button onClick={() => reject(senderId)}>Reject</Button>
      </>
    )
}

export default UpdateFriend;