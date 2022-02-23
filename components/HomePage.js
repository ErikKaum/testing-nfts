import Head from "next/head"

const HomePage = () => {
    return(

        <div className={styles.container}>
        <Head>
          <title>Square collection</title>
          <meta name="Mint your square" content="Mint yout square" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to minting NFTs!
          </h1>
  
          <p className={styles.description}>
            Scroll our NFTs and mint your favourite
          </p>
  
          <div className={styles.grid}>
            
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h2>Mint &rarr;</h2>
              <p>Some placeholder txt</p>
            </a>
  
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h2>Mint &rarr;</h2>
              <p>Some placeholder txt</p>
            </a>
  
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h2>Mint &rarr;</h2>
              <p>Some placeholder txt</p>
            </a>
  
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h2>Mint &rarr;</h2>
              <p>Some placeholder txt</p>
            </a>
  
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h2>Mint &rarr;</h2>
              <p>Some placeholder txt</p>
            </a>
  
  
  
  
          </div>
        </main>
  
        <footer className={styles.footer}>
            Powered by none
        </footer>
      </div>
    )

}

export default HomePage