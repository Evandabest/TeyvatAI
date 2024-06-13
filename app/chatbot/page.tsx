"use client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


const Chatbot2 = () => {
    const [chats, setChats] = useState<any>([]);
    const [current_id, setCurrentId] = useState("");
    const [message, setMessage] = useState<string>("");
    const supabase = createClient()
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        const getInfo = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const id = user?.id;
            if (id) {
                setCurrentId(id);
                console.log(id)
                return id
            }
            else {
                console.error('Error fetching user:')
                return;
            }
        }
        const getChat = async () => {
            const id = await getInfo()
            if (id) {
                const { data, error } = await supabase
                    .from('chatbot')
                    .select('messages')
                    .eq('id', id);
                console.log(data, error)

                //const messages = chats?.map(chat => chat.messages);
                //if (messages) {
                //    const message = messages[0]
                //    setChats(message);
                //}
                //else {
                //    console.error('Error fetching messages:', error);
                //    return;
                //}
            }
        }
        getChat()
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
            .eq('id', current_id);
    
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
                    <p className="m-auto my-4 text-white">Chat With Teyvat's Tinker</p>
                    <div className="mx-4 flex flex-grow flex-col bg-white overflow-auto">
                    {chats?.map((message : any , index : any) => (
                        message.sender === current_id ? (
                            <p className=" text-end mx-4 text-black my-2" key={index}>{message.message}</p>
                        ) : (
                            <>
                                <p className="text-start text-gray-500 mx-4 text-sm">Teyvat's Tinker</p>
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
                    <p>Chat With Teyvat's Tinker</p>
                    <p>No messages</p>
                </>
            )}
        </>
    )
}

export default Chatbot2