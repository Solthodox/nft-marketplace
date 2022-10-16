import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
export default function NFT({image, name, description, price, buy, itemId, created}) {
    const router = useRouter()
    const styles={
        card:`h-[35rem] overflow-hidden cursor-pointer card flex flex-col justify-between shadowed bg-main   rounded-md `,
        imageContainer:` h-96 w-full  `,
        dataContainer:"px-6 mb-4 data-container bg-main w-full",
        name:" font-bold pt-4",
        description:"text-sm text-secondary/30 pt-4z",
        buyButton:" text-main buy  w-full text-center text-xl py-2 font-semibold rounded-b-md"
    }
  return(
    <div className={styles.card} >
        <div 
        onClick={()=>{
            router.push({
                pathname:`/${itemId}`,
                query:image
            })
        }}
        className={styles.imageContainer}>
            <img className='h-full zoom w-full' src={image} />
        </div>
        <div 
        onClick={()=>{
            router.push({
                pathname:`/${itemId}`,
                query:image
            })
        }}
        className={styles.dataContainer}>
            <h1 className={styles.name}>{name}</h1>
            {description &&  <p className={styles.description}>{description.slice(0,50)}...</p>}
            <p className="mt-4 font-bold">Price</p>
            <p className="flex items-center">
                <Image width={20} height={20} src="/eth.svg" />
                {price}
            </p>
        </div>
        <div onClick={buy} className={styles.buyButton}>Buy</div>
        
    </div>
  )
}

