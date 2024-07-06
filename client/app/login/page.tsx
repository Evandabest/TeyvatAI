import { Input } from '@/components/ui/input'
import { login, signup, signInWithGoogle } from './actions'
import { Button } from '@/components/ui/button'


export default function LoginPage() {
  return (
    <form className='w-72 m-auto items-center shadow-md shadow-black border-2 rounded-md p-10 flex flex-col mt-20'>
      <h1 className='text-2xl my-4 text-center'>Supercharge your game with Ai</h1>
      <Input className=' text-black my-4' placeholder='Email' id="email" name="email" type="email" />
      <Input className='text-black my-4' placeholder='Password' id="password" name="password" type="password" />
      <div className = "flex flex-row">
        <Button className='my-2 mx-2' formAction={login}>Log in</Button>
        <Button className='my-2 mx-2' formAction={signup}>Sign up</Button>
        {//<Button className = "my-2 mx-2" formAction={signInWithGoogle}>Google</Button>
}
      </div>
    </form>
  )
}