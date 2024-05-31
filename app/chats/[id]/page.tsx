import { createClient } from "@/utils/supabase/server";

const Chats = async ({params: {id}}: {params : {id:string}}) => {
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();
    const current_id = user?.id;


    const sender = current_id;
    const receiver = id?.split('--').filter((id: string) => id !== sender)[0];
    console.log(receiver);
    
    const { data: chats, error } = await supabase
        .from('chats')
        .select('messages')
        .eq('id', id);


    const messages = chats?.map(chat => chat.messages);
    console.log(messages);

    const recieverUser = await supabase.from('profiles').select('username').eq('id', receiver).single();
    const reciverUserName = recieverUser?.data?.username;

    console.log(reciverUserName);
    

    
    
    return (
        <>
            {chats ? (
            <>
                <p>Chat With {reciverUserName}</p>
                {messages?.map((message, index) => {
                    return (
                        <p key={index}>{message}</p>
                    )
                })}
            </>
            ) : (
                <>
                    <p>No messages</p>
                </>
            )}
        </>
    )
}

export default Chats;