import '../styles/globals.css'
import {Web3Provider} from "./context/Web3Provider"

export default function MyApp({ Component, pageProps }) {

  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  )
    

}


