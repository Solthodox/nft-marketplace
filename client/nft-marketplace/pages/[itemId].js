import { useRouter } from 'next/router'
import Alert from '@mui/material/Alert';
import { useWeb3 } from './context/Web3Provider'
import Header from './components/Header'
import { ethers } from 'ethers'
import { contractAddress , nftAddress, tokenAddress} from '../config'
import { useState , useEffect } from 'react';
import EasyNFT from "../../../src/artifacts/contracts/mock/token.sol/EasyNFT.json"
import Marketplace from "../../../src/artifacts/contracts/Marketplace.sol/Marketplace.json"
import Collection1 from "../../../src/artifacts/contracts/mock/NFTs.sol/Collection1.json"
import Image from 'next/image'
import Loader from './components/Loader'
import Footer from './components/Footer'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';


export default function ItemId() {
    const [formInput, setFormInput] = useState()
    const [data, setData] = useState()
    const [showWindow, setShowWindow] = useState(false)
    const [loadingState, setLoadingState] = useState("not-loaded")
    const [status , setStatus] = useState()
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
      window.ethereum?.on('accountsChanged', () => {
        fetchData()
      })
    })

    async function buy(){
        const instance = new ethers.Contract(contractAddress, Marketplace.abi, wallet.signer)
        try{
          setStatus("buying")
          const token = new ethers.Contract(tokenAddress, EasyNFT.abi, wallet.signer )
          const allowed = (await token.allowance(wallet.address, contractAddress)).toString()
          if(parseInt(allowed) < data.price){
            const approval = await token.approve(contractAddress, data.price)
            await approval.wait()
          } 
          const tx = await instance.buy(itemId)
          await tx.wait()
          setStatus("bougth")
          setTimeout(()=>{console.log("Done")},1000)
          fetchData()
        }catch(e){
          setStatus("buy-failed")
          console.log(e)
        }
    }
      
    async function bid(){
      if(parseInt(formInput)===NaN){
        throw new Error("Wrong input")
      }
      const instance = new ethers.Contract(contractAddress, Marketplace.abi, wallet.signer)
      const token = new ethers.Contract(tokenAddress, EasyNFT.abi, wallet.signer )
      const allowed = (await token.allowance(wallet.address, contractAddress)).toString()
      try{
        setStatus("offering")
        if(parseInt(allowed)<parseInt(formInput)){
          const approval = await token.approve(contractAddress, formInput)
          await approval.wait()
        }
        const tx = await instance.bid(itemId, formInput)
        await tx.wait()
        setStatus("offer-made")
        setShowWindow(false)
        setTimeout(()=>{console.log("Done!")}, 1000)
        fetchData()
      }catch(e){
        setShowWindow(false)
        setStatus("offer-failed")
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
        const owned = (await ERC721.ownerOf(tokenId)) == wallet.address 
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
            bids,
            owned

        }
        setData(object)
        setLoadingState("loaded")
    }
    
return (
    <div>
      {showWindow && (<div className='w-full fixed front h-screen flex items-center justify-center'>
        <div className='p-8 rounded-md bg-main'>
          <CloseIcon className='cursor-pointer mb-8' onClick={()=>{setShowWindow(false)}}/>
          <h1 className='text-xl font-bold'>Offer</h1>
          <input onChange={(e)=>{setFormInput(e.target.value); console.log(e.target.value)}} className='w-full outline-none  bg-secondary text-main px-8 rounded-md py-2 my-8' type="text" placeholder='Amount'></input>
          {status=="offering" 
            ? <button className='w-full rounded-md bg-theme/70 py-2 text-xl font-bold mb-8 '><CircularProgress/></button>
            : <button onClick={bid} className='w-full rounded-md bg-theme py-2 text-xl font-bold mb-8 '>Make offer</button>
          }
        </div>
      </div>)}
        <Header/>
        {status =="bought" && <Alert severity="success">Item bought!</Alert>}
        {status =="offer-made" && <Alert severity="success">Offer made successfully!</Alert>}
        { (status =="offer-failed" || status == "buy-failed") && <Alert severity="warning">Oops! Something went wrong.</Alert>}
          <div className="w-full flex flex-col-reverse md:flex-row  justify-center bg-secondary/5 pt-16 pb-48">
          <div className='w-1/2 mx-32 pl-16'>
            <img 
            className={styles.image}
            src={source}></img>
            <h1 className='mt-8 font-semibold text-2xl'>Description</h1>
            {loadingState=='loaded' 
            ? <p className='mt-4 text-secondary/30'>{data.description}</p> 
            : <Box sx={{width: 400 , height:200}}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
            }
            
          </div>
            <div className="w-full px-16">
            {loadingState=='loaded' 
                ? <h1 className="font-bold text-3xl">{data.name}</h1>
                : <Box sx={{width: 400}}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                </Box>
            }
            {loadingState=='loaded' 
                ? <p className='text-theme mt-12'>Creator: {data.created} </p>
                : <Box sx={{width: 400}}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                </Box>
            }
                <div className='w-full bg-main  rounded-md border border-secondary/10 mt-16 p-8 '>
                    <h3 className='text-secondary/30 font-semibold text-xl'>Current price:</h3>
                    {loadingState=='loaded' 
                    ? <p className='font-bold text-4xl mt-4'> <Image width={30} height={30} src="/eth.svg" /> {data.price} </p>
                    : <Box sx={{width: 400}}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                    </Box>
                    }
                    {(loadingState=="loaded" && !data.owned) && (
                      <div className='w-full mt-8 flex flex-wrap gap-2  '>
                        {status == 'buying' 
                          ? (<div className="py-8 px-24 rounded-md bg-theme/70"> <CircularProgress /> </div> )
                          : <button onClick={buy} className='rounded-md    bg-theme text-xl px-24 py-8 font-bold '>Buy</button>}
                        <button onClick={()=>{setShowWindow(true)}} className='rounded-md    border border-secondary/10 text-xl px-24 py-8 font-bold text-theme'><ConfirmationNumberIcon/> Make offer</button>
                      </div>
                    )}
                    
                </div>
                <div className='w-full mt-16 over'>
                    
                    <h2 className='font-semibold mb-8 text-2xl'>Offers</h2>
                    {loadingState=='loaded' 
                    ? 
                    (<>{ (data.bids.length) ?
                      (<div className='overflow-scroll h-48'>
                        {data.bids.map((bid,i) => (
                          <div key={i} className='w-full flex justify-evenly py-2 bg-main/30 rounded-md mb-2 px-8'>
                            <p className='text-xl font-semibold'><Image className='index-back' width={20} height={20} src="/eth.svg" /> {bid.bid.toNumber()}</p>
                            <p>{bid.offeror.slice(0,20)}...</p>
                            {data.owned && <button className={styles.button}>Accept</button>}
                          </div>))}
                          
                      </div>
                      ):<p>No offers yet</p>}</>)
                    : <Box sx={{width: 400}}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                    </Box>
                    }
                
                </div>
          </div>
        </div>
      <Footer />
    </div>
  )
}

