
import { useState, useEffect, type ReactNode } from "react"
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useSession } from '@/context/session';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from '@tanstack/react-router'


function GoogleOneTap({ signIn }) {
  useGoogleOneTapLogin({
    onSuccess: async (profile) => {
      const decoded = jwtDecode(profile.credential);
     // console.log(decoded);
      const result = await signIn({
        oneTapLogin: {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        }
      })
    //  console.log("result: ", result)
    },
    onError: () => {
      console.log('Login Failed');
    },
  });
  return null
}


export default function App(): ReactNode | null {
  const { isAuthenticated, signIn } = useSession()
  const pathname = useLocation({ select: x => x.pathname })
  return (isAuthenticated || pathname === "/login") ? null : <GoogleOneTap signIn={signIn} />
}