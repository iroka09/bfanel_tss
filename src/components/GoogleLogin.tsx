
import { useEffect } from "react"
import googleOneTap from 'google-one-tap';
//import { useGoogleOneTapLogin } from 'react-google-one-tap-login';


const client_id = '910193991072-542kbb03f4b1o8th2k2bui06u8eh9jng.apps.googleusercontent.com'

const options = {
  client_id, // required
  auto_select: false, // optional
  cancel_on_tap_outside: false, // optional
  context: 'signin', // optional
};

export default function App(): null {
  //const [loginData, setLoginData] = useState()
  // if (typeof window)
  //   useGoogleOneTapLogin({
  //     googleAccountConfigs: {
  //       client_id
  //     },
  //     onError: error => console.log(error),
  //     onSuccess: response => console.log(response),
  //   })
  useEffect(() => {
    setTimeout(() => {
      googleOneTap(options, (response: Record<string, any>) => {
        // Send response to server
        alert(JSON.stringify(response, null, 2));
        console.log(response);
      });
    }, 2000)
  }, [])
  return null
}