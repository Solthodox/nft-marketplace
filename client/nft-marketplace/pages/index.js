import React from 'react'
import Header from './components/Header'
import Link from "next/link"
import Image from 'next/image'
import { useWeb3 } from './context/Web3Provider'
import Footer from "./components/Footer"

export default function Home() {
  const wallet = useWeb3()
  const styles = {
    button: 'bg-main md:mx-32 hover:bg-theme  py-2 px-8 text-2xl font-bold h-24 w-full md:w-48 rounded-md',
    bg : 'h-screen w-full bg-no-repeat bg-cover bg-[url(https://newevolutiondesigns.com/images/freebies/cool-4k-ipad-wallpaper-5.jpg)]',
    blur: 'h-screen flex flex-col-reverse md:flex-row justify-center w-full backdrop-blur-md md:pt-16',
    title : "md:text-6xl mb-16 hidden md:flex text-3xl font-semibold mx-32",
    image : "w-full md:w-[600px] h-96 rounded-md  ",
  }
  return (
    <div>
      <Header />
      <div className={styles.bg}>
        <div className={styles.blur}>
          <div>
            <h1 className={styles.title}>Discover a whole <br></br> world of fresh,<br></br> expensive  JPEGs <br></br> ;)</h1>
            {wallet.provider ? (
              <Link href="/market"><button className={styles.button}>ENTER</button></Link> 
            ) : (
              <button onClick={wallet.connect} className={styles.button}>CONNECT</button>
            )}

          </div>
          <img src='/nft-free.png' className={styles.image} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
