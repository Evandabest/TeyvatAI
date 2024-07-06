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
    const [userPfp, setUserPfp] = useState("");
    const [recieverPfp, setRecieverPfp] = useState("");
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

            const recieverUser = await supabase.from('profiles').select('*').eq('id', receiver).single();
            const reciverUserName = recieverUser?.data?.username;
            if (reciverUserName) {
                setReceiverUserName(reciverUserName);
            }
            else {
                console.error('Error fetching reciever username:');
                return;
            }
            const recieverPfp = recieverUser?.data?.pfp;
            if (recieverPfp) {
                setRecieverPfp(recieverPfp);
            }
            else {
                console.error('Error fetching reciever pfp:');
                return;
            }
            const current = await supabase.from('profiles').select('*').eq('id', current_id).single();
            const currentPfp = current?.data?.pfp;
            if (currentPfp) {
                setUserPfp(currentPfp);
            }
            else {
                console.error('Error fetching current pfp:');
                return;
            }
        }
        getInfo()
    }, [id, supabase])

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
    }, [id, supabase])
    
    const sendMessage = async (event: React.MouseEvent) => {
        event.preventDefault();
    
        const chatMessage = {
            sender: current_id,
            message: message,
            timestamp: new Date().toISOString()
        }
    
        let latestMessage = chats ? [...chats.flat(), chatMessage] : [chatMessage];
    
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
                <div className="flex flex-col m-auto rounded-md bg-slate-700 w-1/2 my-4">
                    <p className="m-auto my-4 text-white">Chat With {receiverUserName}</p>
                    <div className="mx-4 flex flex-grow flex-col bg-white h-[32rem] overflow-scroll">
                    {chats?.map((message : any , index : any) => (
                        message.sender === current_id ? (
                            <>
                                <div className='flex flex-row justify-end mr-4'>
                                    <p className=" text-end mx-4 text-black my-2" key={index}>{message.message}</p>
                                    <img className="rounded-full h-8 w-8" src={userPfp} alt="Profile Picture" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex flex-row justify-start ml-4'>
                                    <img className="rounded-full h-8 w-8" src={recieverPfp} alt="Profile Picture" />
                                    <div className="flex flex-col">
                                        <p className="text-start text-gray-500 mx-4 text-sm">{receiverUserName}</p>
                                        <p className="text-start mx-4 text-black" key={index}>{message.message}</p>
                                    </div>
                                </div>
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