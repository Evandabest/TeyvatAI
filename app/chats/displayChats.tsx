"use client"
import { useRouter } from "next/navigation";

interface DisplayChatsProps {
    chats: string;
    chatid: string;
}

const DisplayChats: React.FC<DisplayChatsProps> = ({ chats, chatid }) => {
    const router = useRouter()
    const openChat = async (chatid: string) => {
        router.push(`/chats/${chatid}`)
    }

    return (
        <button className="flex bg-red-400 rounded-md w-1/2 my-4 items-center justify-center p-10" onClick={() => openChat(chatid)}>
            <p className="m-auto text-white">{chats}</p>
        </button>
    )
}

export default DisplayChats;