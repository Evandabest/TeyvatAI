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
        <div onClick={() => openChat(chatid)}>
            <p>{chats}</p>
        </div>
    )
}

export default DisplayChats;