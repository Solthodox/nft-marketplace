import {useState, useEffect, useContext, createContext} from "react"
import Web3Modal from 'web3modal'
import {ethers} from "ethers"

const Web3Context = createContext()

export function useWeb3(){
    return useContext(Web3Context)
}



export function Web3Provider({children}) {
  const [provider , setProvider] = useState()
  const [signer , setSigner] = useState()
  const [address , setAddress] = useState()

  const connect = async() => {
    if(window.ethereum){
      try{
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const ethersProvider = new ethers.providers.Web3Provider(connection)
        const ethersSigner = ethersProvider.getSigner()
        const ethersAccount = await ethersSigner.getAddress()
        
        
        setProvider(ethersProvider)
        setSigner(ethersSigner)
        setAddress(ethersAccount)
        
        localStorage.setItem("isWalletConnected",true)
        console.log("Connected")
      }catch(e){
        console.log(e)
      }
    }else alert("Please install Metamask")
  }

  const forget = async() => {
    setProvider()
    setAddress()
    setSigner()
    localStorage.setItem("isWalletConnected",false)
  }

  useEffect(()=>{

    if(!provider && localStorage?.getItem("isWalletConnected",true)==='true') connect()
    
    provider?.on("accountsChanged" , (accounts)=>{
      connect()
    })

  },[provider])
    
  return (
    <Web3Context.Provider value={{connect, signer, provider, address, forget}}>
      {children}
    </Web3Context.Provider>
  )
}

