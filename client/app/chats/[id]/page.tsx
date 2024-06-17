"use client"
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";




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
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    console.log(id, current_id, reciever, receiverUserName);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        const getInfo = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const current_id = user?.id;
            //fix this, same name as the state currentid
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
        scrollToBottom()
    }, [chats])

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
                <div className="flex flex-col m-auto rounded-md bg-slate-700 w-1/2 h-screen">
                    <p className="m-auto my-4 text-white">Chat With {receiverUserName}</p>
                    <div className="mx-4 flex flex-grow flex-col bg-white overflow-auto">
                    {chats?.map((message : any , index : any) => (
                        message.sender === current_id ? (
                            <p className=" text-end mx-4 text-black my-2" key={index}>{message.message}</p>
                        ) : (
                            <>
                                <p className="text-start text-gray-500 mx-4 text-sm">{receiverUserName}</p>
                                <p className="text-start mx-4 text-black" key={index}>{message.message}</p>
                            </>
                        )
                    ))}
                    <div ref={messagesEndRef} />
                    </div>
                    <div className="flex my-4 flex-row m-auto w-full">
                        <Input className="w-full mx-2" value={message} onChange={(e) => setMessage(e.target.value)} />
                        <Button  className = "mx-2" onClick={(event) => sendMessage(event)}>Send</Button>
                    </div>
                </div>
            </>
        )    : (
            <>
                    <p>Chat With {receiverUserName}</p>
                    <p>No messages</p>
                </>
            )}
        </>
    )
}

export default Chats;