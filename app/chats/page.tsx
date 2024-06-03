import { createClient } from "@/utils/supabase/server";
import NewChat from "./newChat"
import DisplayChats from "./displayChats"

interface Friend {
    id: string;
    username: string;
}
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

    const friends: Friend[] = await Promise.all(
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

            const user: string = friend?.username;

            return { id: friend_id, username: user };
        }));

        return friends.filter(Boolean);  // Remove null values
    }

    const friendL = await friends(); // Await the friends() function call
    if (!friendL) {
        console.error('No friends found');
        return;
    }
    const friendsList: Friend [] = friendL;
    const usernames: string[] = friendsList?.map(friend => friend?.username); // Use the map method on the awaited result
    
    const friendList = friendsList;
    //console.log(friendList);
    
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="m-auto text-2xl my-2">Chats</h1>
                {chats && chats.length > 0 && usernames ? (
                    chats.map((chat, index) => (
                        <>
                            <NewChat friend = {friendList} />
                            <DisplayChats chats = {usernames[index]} chatid = {chat.id} />
                        </>
                    ))
                ) : (
                    <>
                        <NewChat friend = {friendList} />
                        <p>No chats found</p>

                    </>
                )}
            </div>
        </>
    )
}


export default Chat;