
import { useState, useEffect } from "react"
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import { useSession } from '@/context/session';



const client_id = '910193991072-542kbb03f4b1o8th2k2bui06u8eh9jng.apps.googleusercontent.com'

const options = {
  client_id, // required
  auto_select: false, // optional
  cancel_on_tap_outside: false, // optional
  context: 'signin', // optional
};

export default function App(): null {
  // const [loginData, setLoginData] = useState()
  const { signIn } = useSession()
  if (globalThis.window) {
    useGoogleOneTapLogin({
      googleAccountConfigs: options,
      onError: (error) => {
        console.error(error)
      },
      onSuccess: async (profile) => {
        console.log("profile: ", profile)
        const result = await signIn({
          oneTapLogin: {
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
          }
        })
        console.log("result: ", result)
      }
    })
  }
  return null
}