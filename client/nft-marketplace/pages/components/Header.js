import { useWeb3 } from '../context/Web3Provider'
import Link from "next/link"

function Header() {
    const wallet = useWeb3()
    const styles={
        header:"w-screen space-x-4 header sticky top-0 bg-main text-secondary mx-auto py-4 px-16 flex justify-between items-center",
        sections:"hidden md:flex gap-4 ",
        title:"text-2xl text-white font-bold mr-16 cursor-pointer",
        button:"py-2 px-6 bg-theme rounded-md font-bold"
    }

  return (
    <div className={styles.header}>
        <Link href="/">
            <h1 className={styles.title}>
                EasyNFT
            </h1>
        </Link>   
       {wallet.provider && (
            <div className={styles.sections}>
                <Link href="/market"><a className='font-semibold mx-4'>Market</a></Link>
                <Link href="/mint"><a className='font-semibold mx-4'>Mint</a></Link>
            </div>
        )}
        {
            !wallet.provider 
            ? <button onClick={wallet.connect} className={styles.button}>Connect</button>
            : <button 
            onClick={wallet.forget}
            className={styles.button}>
                {wallet.address.slice(0,5)}...{wallet.address.slice(20,25)}
            </button>
        }
        
    </div>
  )
}

export default Header