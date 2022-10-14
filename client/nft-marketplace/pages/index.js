import React from 'react'
import Header from './components/Header'
import Link from "next/link"
import { useWeb3 } from './context/Web3Provider'
function index() {
  const wallet = useWeb3()
  const style = {
    button: 'bg-theme py-2 px-8 rounded-md'
  }
  return (
    <div>
      <Header />
      {wallet.provider && (<Link href="/market"><button className={style.button}>ENTER</button></Link> )}
    </div>
  )
}

export default index