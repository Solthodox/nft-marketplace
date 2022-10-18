import Alert from '@mui/material/Alert';
import Header from './components/Header'
import NFT from './components/NFT'
import { useState, useEffect} from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '../context/Web3Provider';
import { contractAddress , nftAddress, tokenAddress} from '../config'
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json"
import Collection1 from "../artifacts/contracts/mock/NFTs.sol/Collection1.json"
import EasyNFT from "../artifacts/contracts/mock/token.sol/EasyNFT.json"
import Loader from './components/Loader'
import Footer from './components/Footer'

export default function Market() {
  const wallet = useWeb3()
  const [status , setStatus] = useState()
  const [items,setItems] = useState()
  const [loadingState, setLoadingState] = useState("not-loaded")
  const styles={
    mainContainer:"w-full flex justify-center bg-secondary/5 pt-16 pb-48",
    nftContainer:"grid md:grid-cols-2  lg:grid-cols-4 gap-4 grid-cols-1",
    image:"w-[96] mx-16 rounded-md"
  } 
  useEffect(()=>{
    fetchItems()
  },[])

  async function fetchItems(){
    try{
      const instance = new ethers.Contract(contractAddress, Marketplace.abi, wallet.signer)
      const data = await instance.getMarketItems()
      console.log(data)
      const ERC721 = new ethers.Contract(nftAddress, Collection1.abi, wallet.signer)
      
      const itemData = await Promise.all(data
          .filter(i => !i.sold)
          .map(async i => {
              const itemId = i.itemId.toNumber()
              const tokenId = i.tokenId.toNumber()
              const price = i.price.toString()

              const uri = await ERC721.tokenURI(tokenId)
              const response = await fetch(uri)
              const metadata = await response.json()
              console.log(metadata)

              const item = {
                  name:metadata.name,
                  description:metadata.description,
                  image : metadata.image,
                  itemId,
                  contractAddress:i.contractAddress,
                  tokenId,
                  price,
              }

              return item
          }
      ))
        
      setItems(itemData)
      setLoadingState("loaded")
    }catch(e){
      console.log(e)
    }
  }

  async function buy(item){
    const instance = new ethers.Contract(contractAddress, Marketplace.abi, wallet.signer)
    try{
      const token = new ethers.Contract(tokenAddress, EasyNFT.abi, wallet.signer )
      const allowed = (await token.allowance(wallet.address, contractAddress)).toString()
      console.log(allowed.toString())
      if(parseInt(allowed) < item.price){
        const approval = await token.approve(contractAddress, item.price)
        await approval.wait()
      }
      const tx = await instance.buy(item.itemId)
      await tx.wait()
      fetchItems()
    }catch(e){
      setStatus("buy-failed")
      console.log(e)
    }
  }
  
  return (
    <div className="bg-main "> 
      <Header/>
      {status == "buy-failed" && <Alert severity="warning">Oops! Something went wrong.</Alert>}
      {loadingState!="loaded"  
      ? <Loader/>
      : (
      <div className={styles.mainContainer}>
        <div className={styles.nftContainer}>
          {items.map((item,i)=>
          <NFT 
          key={i} 
          itemId={item.itemId}
          buy={()=>{buy(item)}} 
          image={item.image} 
          name={item.name} 
          price={item.price} 
          description={item.description}
          />)}
         </div>
        </div>
      )}
    <Footer />
    </div>
  )
}
