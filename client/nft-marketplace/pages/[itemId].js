import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useWeb3 } from './context/Web3Provider'
import Header from './components/Header'
import { ethers } from 'ethers'
import { contractAddress , nftAddress, tokenAddress} from '../config'
import EasyNFT from "../../../src/artifacts/contracts/mock/token.sol/EasyNFT.json"
import Marketplace from "../../../src/artifacts/contracts/Marketplace.sol/Marketplace.json"
import Collection1 from "../../../src/artifacts/contracts/mock/NFTs.sol/Collection1.json"
import Image from 'next/image'
export default function ItemId() {
    const [data, setData] = useState()
    const [loadingState, setLoadingState] = useState("not-loaded")
    const wallet = useWeb3()
    const styles = {
        mainContainer:"w-full flex justify-center bg-secondary/5 pt-16 pb-48",
        nftContainer:"grid md:grid-cols-2 lg:grid-cols-4 gap-4 grid-cols-1",
        image:"w-[96]  rounded-md"
    }
    const router = useRouter()
    const source = Object.keys(router.query)[0]
    const itemId = router.query.itemId
    
    useEffect(()=>{
        fetchData()
    })

    async function buy(itemID){
        const instance = new ethers.Contract(contractAddress, Marketplace.abi, wallet.signer)
        try{
          const token = new ethers.Contract(tokenAddress, EasyNFT.abi, wallet.signer )
          const approval = await token.approve(contractAddress, data.price)
          await approval.wait()
          const tx = await instance.buy(itemId)
          await tx.wait()
          fetchData()
        }catch(e){
          console.log(e)
        }
    }
      
    async function bid(itemid, amount){
      const instance = new ethers.Contract(contractAddress, Marketplace.abi, wallet.signer)
      const token = new ethers.Contract(tokenAddress, EasyNFT.abi, wallet.signer )
      try{
        const approval = await token.approve(contractAddress, amount)
        await approval.wait()
        const tx = await instance.bid(itemId, amount)
        await tx.wait()
        fetchData()
      }catch(e){
        console.log(e)
      }
    }
    
    const fetchData = async() => {
        const instance = new ethers.Contract(contractAddress, Marketplace.abi, wallet.signer)
        const data = await instance.getMarketItems()
        const wanted = data.find(item => item.itemId.toNumber()==itemId)
        const bids = await instance.getBids(itemId)
        const ERC721 = new ethers.Contract(nftAddress, Collection1.abi, wallet.signer)
        const uri = await ERC721.tokenURI(wanted.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()

        const tokenId = wanted.tokenId.toNumber()
        const price = wanted.price.toString()
        const object = {
            name:metadata.name,
            description:metadata.description,
            created: metadata.created_by,
            image : metadata.image,
            itemId,
            seller:wanted.seller,
            contractAddress:wanted.contractAddress,
            tokenId,
            price,
            bids

        }
        setData(object)
        setLoadingState("loaded")
    }
    
if(loadingState == "loaded") return (
    <div>
        <Header/>
        <div className="w-full flex flex-col-reverse md:flex-row  justify-center bg-secondary/5 pt-16 pb-48">
          <div className='w-1/2 mx-32 pl-16'>
            <img 
            className={styles.image}
            src={source}></img>
            <h1 className='mt-8 font-semibold text-2xl'>Description</h1>
            <p className='mt-4 text-secondary/30'>{data.description}</p>
            
          </div>
            <div className="w-full px-16">
                <h1 className="font-bold text-3xl">{data.name}</h1>
                <p className='text-theme mt-12'>Creator: {data.created} </p>
                <div className='w-full bg-main  rounded-md border border-secondary/10 mt-16 p-8 '>
                    <h3 className='text-secondary/30 font-semibold text-xl'>Current price:</h3>
                    <p className='font-bold text-4xl mt-4'> <Image width={30} height={30} src="/eth.svg" /> {data.price} </p>
                    <div className='w-full mt-8 flex flex-wrap gap-2  '>
                        <button onClick={()=> buy(itemId)} className='rounded-md    bg-theme text-xl px-24 py-8 font-bold '>Buy</button>
                        <button onClick={()=> bid(itemId, 100)} className='rounded-md    border border-secondary/10 text-xl px-24 py-8 font-bold text-theme'>Make offer</button>
                    </div>
                    
                </div>
                <div className='w-full mt-16'>
                    <h2 className='font-semibold text-2xl'>Offers</h2>
                    { (data.bids.length) && data.bids(bid => (
                        <p>{bid.offer.toNumber()}</p>
                    ))}
                </div>
              
          </div>
         
          
        </div>
    </div>
  )
}

