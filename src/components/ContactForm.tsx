
import { useState } from "react"
import { Link } from "@tanstack/react-router";

/*
const AnyReactComponent = ({ text }) => <div>{text}</div>;


function GoogleMap() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBBX5fS1Vgtm3tEBs8i75nfr7HjFQRuqqA" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          // lat={59.955413}
          //  lng={30.337844}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}
*/


export default function App() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  })
  const handleInput = (key: string, setFn: Function, val: string) => {
    setFn(val)
    setTouched(x => ({
      ...x,
      [key]: false
    }))
  }
  const handleSubmit = () => {
    window.location.href = `mailto: info@bfanelindustries.com?subject=${name.trim()}&email=${email}&body=${encodeURIComponent(message)}`
  }
  return (
    <div id="contact" className="!text-white container [&_strong]:txt-primary [&_p_:not(strong)]:text-sm py-5">
      {/*<GoogleMap />*/}
      <div className="bg-black/60 rounded-lg px-3 py-5">
        <h2 className="text-2xl font-bold mb-6 uppercase w-fit mx-auto">Contact Us</h2>
        <p className="mb-4 leading-5">
          <strong>Location:</strong> <span>At NO.16 Kilometer 10 Orlu-Ihiala road, Awo-Idemili, Imo state.</span>
        </p>
        <p className="mb-4">
          <strong>Phone:</strong> <Link to="tel:+234-703-845-0694" className="underline underline-offset-2">+234-703-845-0694</Link>
        </p>
        <p className="mb-4">
          <strong>Email:</strong> <Link to="mailto: info@bfanelindustries.com" className="underline underline-offset-2">info@bfanelindustries.com</Link>
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="inline-block">Your Name</label>
            <input
              type="text"
              id="name"
              required
              name="name"
              className={`${touched.name && name ? "invalid:border-red-500" : ""} peer mt-1 block w-full border outline-none py-2 px-3 focus:border-secondary border-white/30 rounded-md shadow-sm bg-white/20 dark:shadow-none`}
              value={name}
              onInput={e => handleInput("name", setName, e.target.value)}
              onBlur={() => setTouched(x => ({ ...x, name: true }))}
              pattern="^[A-z]{2,20}(\s[A-z]{2,20}){0,3}\s*$"
            />
            {name && <span className={`hidden ${touched.name ? "peer-invalid:block" : ""} text-red-500 text-xs`}>Invalid Name! [sample: John Doe]</span>}
          </div>
          <div>
            <label htmlFor="email" className="inline-block">Your Email</label>
            <input
              type="email"
              id="email"
              required
              name="email"
              className={`${touched.email ? "invalid:border-red-500" : ""} peer mt-1 block w-full border border-white/30 outline-none py-2 px-3 focus:border-secondary rounded-md shadow-sm bg-white/20`}
              value={email}
              onInput={e => handleInput("email", setEmail, e.target.value)}
              onBlur={() => setTouched(x => ({ ...x, email: true }))}
            />
            {email && <span className={`hidden ${touched.email ? "peer-invalid:block" : ""} text-red-500 text-xs`}>Wrong Email Address.</span>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="message" className="inline-block">Your Message</label>
            <textarea id="message" required name="message" rows="4" className={`${touched.message && message ? "invalid:border-red-500" : ""} peer mt-1 block w-full border border-white/30 outline-none py-2 px-3 focus:border-secondary rounded-md shadow-sm bg-white/20`} value={message} onInput={e => handleInput("message", setMessage, e.target.value)}></textarea>
            {message && <span className={`hidden ${touched.message ? "peer-invalid:block" : ""} text-red-500 text-xs`}>Enter your message.</span>}
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-6 py-2 bg-secondary-dark transition-all text-white font-bold rounded-md ">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}