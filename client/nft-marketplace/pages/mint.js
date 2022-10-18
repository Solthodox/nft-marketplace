import Footer from './components/Footer'
import Header from './components/Header'
import {useState } from 'react'
import {tokenAddress} from '../config'
import EasyNFT from "../../../src/artifacts/contracts/mock/token.sol/EasyNFT.json"
import { ethers } from 'ethers'
import { useWeb3 } from './context/Web3Provider'

export default function mint() {
  const wallet = useWeb3()
  const [formInput , setFormInput] = useState()
  const styles = {
    container : "w-full bg-secondary/5 h-screen flex justify-evenly items-center flex-wrap",
    cardContainer:"w-1/2 flex justify-center",
    card:"rounded-md  py-16 px-8 bg-theme",
    title:'font-bold text-2xl mb-8',
    input:"outline-none bg-secondary text-main rounded-md  px-8 py-4 w-full",
    button:"bg-main w-full mt-8 text-2xl font-bold hover:bg-main/70 rounded-md py-4 px-8"
  }
  async function mint(){
    if(parseInt(formInput)===NaN){
      throw new Error("Wrong input!")
    }
    const instance = new ethers.Contract(tokenAddress, EasyNFT.abi, wallet.signer)
    const tx = await instance.mint(formInput)
    await tx.wait()
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h1 className={styles.title}>Native</h1>
            <p className='text-secondary/70 mb-8'>Get you some tokens so you can interact with the dapp ;)  </p>
            <input onChange={e=>setFormInput(e.target.value)} className={styles.input} placeHolder='Token Amount' type='text'></input>
            <button onClick={()=>mint()} className={styles.button}>Mint</button>
          </div>
        </div>
        {/* <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h1 className={styles.title}>Exchange Tokens</h1>
            <p>You need tokens to buy NFTs  </p>
            <input className={styles.input} placeHolder='Token Amount' type='text'></input>
            <button className={styles.button}>Mint</button>
          </div>
        </div> */}
      </div>
      <Footer />
    </>
  )
}

