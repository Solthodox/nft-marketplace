import React from 'react'

export default function Footer() {
const styles = {
    container:'w-full bg-main  px-24 md:px-36 lg:px-48 py-16',
    title:" font-semibold text-2xl border-b border-secondary"
}
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>EasyNFT</h1>
    </div>
  )
}

