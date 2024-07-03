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
        <div className="flex-col flex h-5 mt-0 bottom-0 w-full mb-2">
            <div className="flex-row flex justify-evenly">
                <button onClick={notification}><i className='bx bxs-bell bx-sm'></i></button>
                <button onClick={post}><i className='bx bx-plus  bx-sm' ></i></button>
                <button onClick={search}><i className='bx bx-search-alt-2 bx-sm' ></i></button>
            </div>
        </div>
    );
}

export default Bottombar;