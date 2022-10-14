import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
export default function NFT({image, name, description, price, buy, itemId, created}) {
    const router = useRouter()
    const styles={
        card:`h-[35rem] overflow-hidden cursor-pointer card flex flex-col justify-between shadowed bg-main w-[25rem]  rounded-md `,
        imageContainer:`bg-no-repeat h-96 w-full bg-cover zoom bg-top bg-[url(https://midfmfgslnxtxorkap3ykfeumrhcq4qc77om2ttf4k2o7f6jcumq.arweave.net/YgZWFNJbbzu6KgP3hRSUZE4ocgL_3M1OZeK075fJFRk)]`,
        dataContainer:"mx-6 mb-4",
        name:" font-bold pt-4",
        description:"text-sm text-secondary/30 pt-4z",
        buyButton:" text-main buy  w-full text-center text-xl py-2 font-semibold rounded-b-md"
    }
  return(
    <div 
    onClick={()=>{
        router.push({
            pathname:`/${itemId}`,
            query:image
        })
    }}
    className={styles.card} >
        <div className={styles.imageContainer}></div>
        <div className={styles.dataContainer}>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.description}>{description.slice(0,50)}...</p>
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

