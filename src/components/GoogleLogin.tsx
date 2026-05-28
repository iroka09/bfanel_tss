
import { useState, useEffect, type ReactNode } from "react"
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useAppSession, refreshSession } from '@/context/session';
import { veryCredentialWithGoogle } from '@/server/actions/veryCredentialWithGoogle';
import { useLocation } from '@tanstack/react-router'



function GoogleOneTap() {
  useGoogleOneTapLogin({
    onSuccess: async (profile) => {
      const result = await veryCredentialWithGoogle({
        data: { credential: profile.credential }
      })
      if (result.success) {
        await refreshSession()
      }
    },
    onError: () => {
      console.log('Login Failed');
    },
  });
  return null
}


export default function App(): ReactNode | null {
  const { isAuthenticated } = useAppSession()
  const pathname = useLocation({ select: x => x.pathname })
  return (isAuthenticated || pathname === "/login") ? null : <GoogleOneTap />
}