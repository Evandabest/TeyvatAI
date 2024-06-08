'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

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
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

export async function google() {
  const supabase = createClient()
  const origin = headers().get('origin')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}`
    },
  })
  console.log(process.env.NEXT_PUBLIC_ORIGIN)
  //queryParams: {
  //  redirect_uri: `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`,
  //  access_type: 'offline',
  //  prompt: 'consent',
  //},
  if (error) {
    console.log(error)
    redirect('/error')
  }
  redirect(data?.url)
  revalidatePath('/', 'layout')
  redirect('/home')
}  