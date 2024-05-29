import { createClient } from "@/utils/supabase/server";
import NewChat from "./newChat"

const Chat = async () => {
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();
    const id = user?.id;
    const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .ilike('id', `%${id}%`);

    if (error) {
        console.error('Error fetching chats:', error);
        return;
    }

    const friends = async () => {
        const { data: profile, error } = await supabase
        .from('profiles')
        .select('friends')
        .eq('id', id)
        .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return;
        }

        if (!profile) {
            console.error('Profile not found');
            return;
        }
        
        const friendIds = profile.friends;

    const friends = await Promise.all(
        friendIds.map(async (friend_id: string) => {
            const { data: friend, error: friendError } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', friend_id)
                .single();

            if (friendError) {
                console.error('Error fetching friend:', friendError);
                return null;
            }

            return { id: friend_id, username: friend.username };
        }));

        return friends.filter(Boolean);  // Remove null values
    }

    const friendsList = await friends(); // Await the friends() function call
    const usernames = friendsList?.map(friend => friend?.username); // Use the map method on the awaited result
    
    const friendList = friendsList;
    //console.log(friendList);
    
    return (
        <>
            <h1>Chat</h1>
            {chats && chats.length > 0 && usernames ? (
                chats.map((chat, index) => (
                    <div>
                        <p>{usernames[index]}</p>
                        <p>{chat.message}</p>
                    </div>
                ))
            ) : (
                <>
                    <p>No chats found</p>
                    <NewChat props = {friendList} />

                </>
            )}
        </>
    )
}


export default Chat;