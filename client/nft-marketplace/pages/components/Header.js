import { useWeb3 } from '../context/Web3Provider'
import Image from "next/image"
import Link from "next/link"
import {BsSearch} from "react-icons/bs"

function Header() {
    const wallet = useWeb3()
    const styles={
        header:"w-screen space-x-4 header sticky top-0 bg-main text-secondary mx-auto py-4 px-16 flex justify-between items-center",
        sections:"hidden md:flex gap-4 ml-16",
        title:"text-2xl text-white font-bold mr-16 cursor-pointer",
        searchbar:"px-6 py-2 w-full flex items-center space-x-4 rounded-md  bg-secondary/10",
        button:"py-2 px-6 bg-theme rounded-md font-bold"
    }

  return (
    <div className={styles.header}>
        <Link href="/market">
            <h1 className={styles.title}>
                EasyNFT
            </h1>
        </Link>   
        <div className={styles.searchbar} >
            <BsSearch />
            <input className='outline-none w-full' type="text" placeholder="Search for name, price or collection" />
        </div>
        <div className={styles.sections}>
            <Link href="/market"><a className='font-semibold mx-4'>Market</a></Link>
            <Link href="/create"><a className='font-semibold mx-4'>Create</a></Link>
            <Link href="/create"><a className='font-semibold mx-4'>Create</a></Link>
        </div>
        {
            !wallet.provider ? <button onClick={wallet.connect} className={styles.button}>Connect</button>
            : <button 
            onClick={wallet.forget}
            className={styles.button}>{wallet.address.slice(0,5)}...{wallet.address.slice(20,25)}</button>
        }
        
    </div>
  )
}

export default Header