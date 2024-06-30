"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"


const Chatbot = () => {
    const [chats, setChats] = useState<any>([])
    const [current_id, setCurrentId] = useState("")
    const [message, setMessage] = useState<string>("");
    const supabase = createClient()
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

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
            const { data: chats, error } = await supabase
                .from('chatbot')
                .select('messages')
                .eq('id', current_id);

            const messages = chats?.map(chat => chat.messages);
            if (messages) {
                const message = messages[0]
                setChats(message);
            }
            else {
                console.error('Error fetching messages:', error);
                return;
            }
        }
        getInfo()
    }, [supabase])

    useEffect(() => {        
        const channel = supabase
                .channel('table-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'chatbot',
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
    }, [supabase])
    useEffect(() => {
        scrollToBottom()
    }, [chats])

    const sendMessage = async (event: React.MouseEvent) => {
        event.preventDefault();
        console.log(message)
    
        const chatMessage = {
            sender: current_id,
            message: message,
            timestamp: new Date().toISOString()
        }
    
        let latestMessage = chats ? [...chats.flat(), chatMessage] : [chatMessage];
    
        console.log(chats, chatMessage)
        const { data: newMessage, error } = await supabase
            .from('chatbot')
            .update({ messages: latestMessage})
            .eq('id', current_id);
    
        if (error) {
            console.error('Error sending message:', error);
        } else {
            setMessage('');
        }

        const url = `http://127.0.0.1:5000/api/chat`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: message,
                id: current_id
            })
        });
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger className="bottom-0 sticky flex">Teyvat Tinker</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Teyvat Tinker</AlertDialogTitle>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogHeader>
                    <>
                        {chats ? (
                            <>
                         <AlertDialogDescription>
                            <div className="flex flex-col m-auto rounded-md bg-slate-700">
                                <p className="m-auto my-4 text-white">Chat With Teyvat&apos;s Tinker</p>
                                <div className="mx-4 flex flex-grow flex-col bg-white overflow-scroll">
                                {chats?.map((message : any , index : any) => (
                                    message.sender === current_id ? (
                                        <p className=" text-end mx-4 text-black my-2" key={index}>{message.message}</p>
                                    ) : (
                                        <>
                                            <p className="text-start text-gray-500 mx-4 text-sm">Teyvat&apos;s Tinker</p>
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
                        </AlertDialogDescription>
                        </>
                            )  : (
                        <>
                                <p>No messages</p>
                                <div className="flex my-4 flex-row m-auto w-full">
                                    <Input className="w-full mx-2" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    <Button  className = "mx-2" onClick={(event) => sendMessage(event)}>Send</Button>
                                </div>
                            </>
                        )}
                    </>
                    <AlertDialogFooter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export default Chatbot