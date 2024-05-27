"use client"
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const UpdateFriend = ({props}: {props: {id: string}}) => {
  
  const { id: senderId } = props
  const supabase = createClient()
  const accept = async (senderId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id) {
      const { data, error } = await supabase
        .from('friend_requests')
        .select('status')
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id);
  
      if (error) {
        console.error('Error fetching friend request status: ', error);
      } else if (data && data.length > 0 && data[0].status === 'pending') {
        const updateResponse = await supabase
          .from('friend_requests')
          .update({ status: 'accepted' })
          .eq('sender_id', senderId)
          .eq('receiver_id', user.id);
  
        if (updateResponse.error) {
          console.error('Error updating friend request status: ', updateResponse.error);
        } else {
          console.log('Successfully updated friend request status: ', updateResponse.data);
  
          // Update receiver's friends array
          const { data: receiverData, error: receiverError } = await supabase
            .rpc('append_to_uuid_array', { user_id: user.id, friend_id: senderId });
  
          if (receiverError) {
            console.error('Error updating receiver friends list: ', receiverError);
          } else {
            console.log('Successfully updated receiver friends list: ', receiverData);
          }
  
          // Update sender's friends array
          const { data: senderData, error: senderError } = await supabase
            .rpc('append_to_uuid_array', { user_id: senderId, friend_id: user.id });
  
          if (senderError) {
            console.error('Error updating sender friends list: ', senderError);
          } else {
            console.log('Successfully updated sender friends list: ', senderData);
          }
        }
      }
    }
  }

    const reject = async (senderId: string) => {
        const {data: {user}} = await supabase.auth.getUser();
        if (user && user.id) {
            const { data, error } = await supabase
                .from('friend_requests')
                .update({ status: 'rejected' })
                .eq('sender_id', senderId)
                .eq('receiver_id', user.id);
            
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