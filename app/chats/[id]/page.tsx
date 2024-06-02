"use client"
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputMessage from "./inputMessage";



interface ChatsProps {
    id: any;
    sender: any;
    receiver: any;
    messages: any;
    receiverUserName: any;
}


const Chats = ({params: {id}}: {params: {id: string}}) => {
    const [chats, setChats] = useState<any>([]);
    const [current_id, setCurrentId] = useState("");
    const [reciever, setReciever] = useState("");
    const [receiverUserName, setReceiverUserName] = useState("");
    const [message, setMessage] = useState<string>("");
    const supabase = createClient()
    const router = useRouter()

    console.log(id, current_id, reciever, receiverUserName);

    useEffect(() => {
        const getInfo = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const current_id = user?.id;
            if (current_id) {
                setCurrentId(current_id);
            }
            else {
                console.error('Error fetching user:')
                return;
            }

            const sender = current_id;
            const receiver = id?.split('--').filter((id: string) => id !== sender)[0];
            setReciever(receiver);
        
            const { data: chats, error } = await supabase
                .from('chats')
                .select('messages')
                .eq('id', id);

            const messages = chats?.map(chat => chat.messages);
            if (messages) {
                const message = messages[0]
                setChats(message);
                console.log(messages)
            }
            else {
                console.error('Error fetching messages:', error);
                return;
            }

            const recieverUser = await supabase.from('profiles').select('username').eq('id', receiver).single();
            const reciverUserName = recieverUser?.data?.username;
            if (reciverUserName) {
                setReceiverUserName(reciverUserName);
            }
            else {
                console.error('Error fetching reciever username:');
                return;
            }
        }
        getInfo()
    }, [])

    useEffect(() => {        
        const channel = supabase
                .channel('table-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'chats',
                    },
                    (payload) => {
                        const newMessages = (payload.new as { messages: any }).messages;
                        setChats(newMessages);
                    }
                )
                .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [])
    
    const sendMessage = async (event: React.MouseEvent) => {
        event.preventDefault();
    
        const chatMessage = {
            sender: current_id,
            message: message,
            timestamp: new Date().toISOString()
        }
    
        let latestMessage = chats ? [...chats.flat(), chatMessage] : [chatMessage];
    
        console.log(latestMessage)
        console.log(chats, chatMessage)
        const { data: newMessage, error } = await supabase
            .from('chats')
            .update({ messages: latestMessage})
            .eq('id', id);
    
        if (error) {
            console.error('Error sending message:', error);
        } else {
            setMessage('');
        }
    }

    
    return (
        <>
            {chats ? (
            <>
                <p>Chat With {receiverUserName}</p>
                {chats?.map((message : any , index : any) => {
                    return (
                        <p key={index}>{message.message}</p>
                    )
                })}
                <div>
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button onClick={(event) => sendMessage(event)}>Send</Button>
                </div>
                

            </>
            ) : (
                <>
                    <p>Chat With {receiverUserName}</p>
                    <p>No messages</p>
                </>
            )}
        </>
    )
}

export default Chats;