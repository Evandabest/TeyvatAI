"use client"

import { useRouter } from "next/navigation"
  
const Bottombar = () => {
    const router = useRouter()
    const notification = () => {
        router.push('/notifications')
    }
    const post = () => {
        router.push('/post')
    }
    const search = () => {
        router.push('/search')
    }
    return (
        <>
        <div className="flex-row flex justify-evenly sticky bottom-0">
            <button onClick={notification}><i className='bx bxs-bell'></i></button>
            <button onClick={post}><i className='bx bx-plus' ></i></button>
            <button onClick={search}><i className='bx bx-search-alt-2' ></i></button>
        </div>
        </>
    );
}

export default Bottombar;