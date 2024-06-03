import { Input } from '@/components/ui/input'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'


export default function LoginPage() {
  return (
    <form className='w-72 m-auto items-center flex flex-col'>
      <Input className=' text-black my-4' placeholder='Email' id="email" name="email" type="email" required />
      <Input className='text-black my-4' placeholder='Password' id="password" name="password" type="password" required />
      <Button className='my-2' formAction={login}>Log in</Button>
      <Button className='my-2' formAction={signup}>Sign up</Button>
    </form>
  )
}