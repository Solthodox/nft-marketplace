import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/Header'
import NFT from './components/NFT'

export default function Home() {
  const styles={
    mainContainer:"w-full flex justify-center bg-secondary/5 pt-16",
    nftContainer:"grid md:grid-cols-2 lg:grid-cols-4 gap-4 grid-cols-1"
  }
  return (
    <div className="bg-main "> 
      <Header/>
      <div className={styles.mainContainer}>
        <div className={styles.nftContainer}>
          <NFT image="https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg" name="Bored Ape" description="dsfsd" price={2}   />
          <NFT image="https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg" name="Bored Ape" description="dsfsd" price={2}   />
          <NFT image="https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg" name="Bored Ape" description="dsfsd" price={2}   />
          <NFT image="https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg" name="Bored Ape" description="dsfsd" price={2}   />
          <NFT image="https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg" name="Bored Ape" description="dsfsd" price={2}   />
          <NFT image="https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg" name="Bored Ape" description="dsfsd" price={2}   />
          <NFT image="https://ichef.bbci.co.uk/news/640/cpsprodpb/DBB7/production/_122074265_hi071843849.jpg" name="Bored Ape" description="dsfsd" price={2}   />
        </div>
      </div>
    </div>
  )
}
