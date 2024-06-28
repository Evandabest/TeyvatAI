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
import Image from 'next/image';
  

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
    <div className='flex-row flex justify-evenly top-0 mt-2'>
        <button onClick={goHome}><i className='bx bxs-home-circle bx-sm'></i></button>
        <Image className=' w-20' src="/logo.png" alt="logo" />
        <Sheet>
            <SheetTrigger><i className ='bx bx-menu bx-sm'></i></SheetTrigger>
            <SheetContent className=' max-w-20'>
                    <SheetHeader className='flex flex-col'>
                        <SheetTrigger ><button className='my-2'><i className ='bx bx-menu bx-sm' ></i></button></SheetTrigger>
                        <SheetTrigger ><button className='my-2' onClick={chat}><i className='bx bx-message-rounded-dots bx-sm' ></i></button></SheetTrigger>
                        <SheetTrigger ><button className='my-2' onClick={inventory}><i className='bx bxs-book bx-sm' ></i></button></SheetTrigger>
                        <SheetTrigger><button className='my-2' onClick={profile}><i className='bx bxs-user bx-sm' ></i></button></SheetTrigger>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    </div>
  );
}

export default NavBar;