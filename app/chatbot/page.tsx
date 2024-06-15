"use client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


const Chatbot2 = () => {
    const [chats, setChats] = useState<any>([])
    const [id, setId] = useState<string>("")
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const supabase = createClient()

    useEffect(() => {
        const getInfo = async () => {
            const {data: {user}} = await supabase.auth.getUser()
            const userId = user?.id;
            if (userId) setId(userId)

            try { 
            const {data , error} = await supabase.from("chatbot").select("messages").eq("id", userId)
            if (data) console.log(data[0])
            console.log(userId)
            } catch (error) {
                console.error('Error fetching messages:', error);
                return;
            }

            //const message = messages?.map(message => messages.messages);
            //if (message) {
            //    const confirmedMessage = messages[0]
            //    setChats(confirmedMessage);
            //    console.log(messages)
            //}
            //else {
            //    console.error('Error fetching messages:', error);
            //    return;
            //}
        }
        getInfo()
        }, [])


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    useEffect(() => {
        scrollToBottom()
    }, [])

    
    return (
        <>
            {chats ? (
                <>
                <div className="flex flex-col m-auto rounded-md bg-slate-700 w-1/2 h-screen">
                    <p className="m-auto my-4 text-white">Chat With Teyvat's Tinker</p>
                    <div className="mx-4 flex flex-grow flex-col bg-white overflow-auto">
                    {chats?.map((message : any , index : any) => (
                        message.sender === id? (
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
                    {//<div className="flex my-4 flex-row m-auto w-full">
                     //   <Input className="w-full mx-2" value={message} onChange={(e) => setMessage(e.target.value)} />
                     //   <Button  className = "mx-2" onClick={(event) => sendMessage(event)}>Send</Button>
                    //</div>
}
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