import {useState, useEffect, useContext, createContext} from "react"
import {ethers} from "ethers"


const Web3Context = createContext()

export function useWeb3(){
    return useContext(Web3Context)
}



export function Web3Provider({children}) {
  async function connect(){
    if(window.ethereum){
      try{
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]
        const ethersProvider = new ethers.providers.Web3Provider(account)
        const ethersSigner = ethersProvider.getSigner()
        const ethersAccount = await ethersSigner.getAddress()
      }catch(e){
        console.log(e)
      }
    }else alert("Please install Metamask")
  }
  return (
    <Web3Context.Provider value={{connect}}>
      {children}
    </Web3Context.Provider>
  )
}

