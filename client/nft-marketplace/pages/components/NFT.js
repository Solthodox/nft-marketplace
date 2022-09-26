import React from 'react'
import Image from 'next/image'
export default function NFT({image, name, description, price}) {
    const styles={
        card:`h-[35rem] overflow-hidden cursor-pointer card  shadowed bg-main w-[25rem]  rounded-md `,
        imageContainer:"bg-no-repeat h-96 w-full bg-cover zoom bg-top bg-[url(https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg)]",
        dataContainer:"mx-6 mb-4",
        name:"text-xl font-bold",
        buyButton:" text-main buy  w-full text-center text-xl py-2 font-semibold rounded-b-md"
    }

  return (
    <div className={styles.card} >
        <div className={styles.imageContainer}></div>
        <div className={styles.dataContainer}>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.description}>{description}</p>
            <p className="mt-4 font-bold">Price</p>
            <p className="flex items-center">
                <Image width={20} height={20} src="/eth.svg" />
                {price}
            </p>
        </div>
        <div className={styles.buyButton}>Buy</div>
        
    </div>
  )
}

