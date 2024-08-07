'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'


export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  })

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const redirectUrl =`${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`
  const { data,error } = await supabase.auth.signInWithOAuth({
     provider: 'google', 
     options: { 
      redirectTo: redirectUrl, 

    }})

  if (error) {
    console.log(error)
    redirect('/error')
  }

  redirect(data.url)
}
