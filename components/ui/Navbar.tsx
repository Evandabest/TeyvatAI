"use client"
import 'boxicons/css/boxicons.min.css'; 
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';
  

const NavBar = () => {
    const router = useRouter()
    const goHome = () => {
        router.push('/home')
    }
    const chat = () => {
      router.push('/chats')
  }
  const inventory = () => {
    router.push('/inventory')
  }
  const profile = () => {
    router.push('/profile')
  }
  return (
    <div className='flex-row flex justify-evenly top-0'>
        <button onClick={goHome}><i className='bx bxs-home-circle'></i></button>
        <img className=' w-20' src="/logo.png" alt="logo" />
        <Sheet>
            <SheetTrigger><i className ='bx bx-menu'></i></SheetTrigger>
            <SheetContent className=' max-w-20'>
                    <SheetHeader>
                        <SheetTrigger><button><i className ='bx bx-menu' ></i></button></SheetTrigger>
                        <SheetTrigger><button onClick={chat}><i className='bx bx-message-rounded-dots' ></i></button></SheetTrigger>
                        <SheetTrigger><button onClick={inventory}><i className='bx bxs-book' ></i></button></SheetTrigger>
                        <SheetTrigger><button onClick={profile}><i className='bx bxs-user' ></i></button></SheetTrigger>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    </div>
  );
}

export default NavBar;