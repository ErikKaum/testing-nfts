import HomePage from '../components/HomePage'
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react'
import Link from 'next/link';

import { ethers } from "ethers";
import MyEpicNft from "../contracts/MyEpicNft.json"

const CONTRACT_ADDRESS = "0xC8179B674090Be9EcaF96C1F5c616b358398d966"

export default function Home() {

  const [account, setAccount] = useState("");
  const [link, setLink] = useState(null)
  const [count, setCount] = useState(0)

  const walletIsConnected = async() => {
    const { ethereum } = window

    if (!ethereum) {
      toast.error('No metamask found')
      return;
    } else {
      console.log(ethereum)
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);
    
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
    	toast.error("You are not connected to the Rinkeby Test Network!");
    }


    const accounts = await ethereum.request({method: 'eth_accounts'})
    
    if (accounts.length !== 0) {
      const currentAccount = accounts[0]
      setAccount(accounts[0])
      console.log(currentAccount)
      eventListener()
    } else {
      console.log('No authorized accounts')
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        toast.error("Metamask required");
        return;
      }

      const accounts = await ethereum.request({method : "eth_requestAccounts" })
      const currentAccount = accounts[0]

      setAccount(accounts[0])
      console.log(currentAccount)

      toast("Wallet connected!", {
        icon: '👏',
      });

      eventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const eventListener = async () => {
    try{
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNft.abi, signer);

        connectContract.on("NewEpicNftMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          console.log(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          // toast(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`, {
          //   icon: '👏'`
          // })
          setLink(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        
        })
           
        console.log('set up event listener')
      } else {
        console.log('No wallet')
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const getNftCount = async () => {

    try {
      const { ethereum } = window
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNft.abi, signer);
        
        let count = await connectContract.getTotalNFTsMintedSoFar()
        setCount(count.toNumber())

      } else {
        console.log("No ethereum object")
      }
    
    
    } catch (error) {
      console.log(error)
    }


  }

  const mintNft = async (event) => {
    event.preventDefault();

    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNft.abi, signer);

        console.log('Pay gas')

        console.log(svg)
        let nftTx = await connectContract.makeAnNft(svg);

        toast.promise(
          nftTx.wait(),
          {
            loading: 'Minting... please wait.',
            success: 'Minted!',
            error: 'Something went wrong',
          },
          
        ).then(
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`),
        )
        
        // console.log("Mining...please wait.")
  

      } else {
        toast.error("No wallet")
      }

    } catch (error) {
      console.log(error)
    }
  }


  const connectWalletButton = () => (
    <button onClick={connectWallet}>
      Connect your wallet
    </button>
  )


  useEffect(() => {
    walletIsConnected();
    getNftCount();
  }, [])

  const [svg, setSvg] = useState("")

  const handleChange = (event) => {
    setSvg(event.target.value)
    console.log(svg)
  }

  return (
    <>
    <div className='h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'>

      {/* HEADER */}
      <div className='flex w-screen h-1/6 items-center justify-center'>
        <h1 className='text-4xl font-extrabold'> Mint your One-Liner NFT!</h1>
      </div>

    {/* MAIN CONTENT */}
    <div className='flex flex-col w-screen h-4/6 space-y-14 items-center'>

      <div>
        <h2 className='text-2xl font-extrabold'>{count}/20 Minted</h2>
      </div>


      <div className='p-20 bg-slate-200 rounded-md items-center justify-center bg-opacity-30 backdrop-blur-lg'>

      { account === "" 
        ? 
        (
          <div className='flex items-center justify-center'>
            <button onClick={connectWallet} className='text-xl text-white font-bold p-2 px-5 rounded-lg bg-indigo-500 hover:bg-indigo-700 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300'>
              Connect Wallet
            </button>
          </div>
        )
        :        
        
        <form onSubmit={mintNft} className='flex flex-col space-y-5'>
          
          <label className='flex flex-col justify-center items-center text-xl font-medium'>
          Type your one-liner:
            <input className='rounded-lg text-center w-72 h-8 border border-black' type="text" value={svg} onChange={handleChange} />
          </label>

          <div className='flex items-center justify-center'>
            <button className='p-2 px-5 rounded-lg drop-shadow-md bg-indigo-500 hover:bg-indigo-700 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300'>
              <input type="submit" value="Mint" className='text-xl text-white font-bold'/>
            </button>
          </div>

        </form>

      }
      </div>
      
      { link === null ?
      null
      :
      <div className='flex'>
        <p className='font-semibold'> Access your nft at: <br/> </p>
        <a target="_blank" href={link}> {link} </a>
      </div>      
      }


    </div>

    {/* FOOTER */}
    <div className='flex w-screen h-1/6 justify-evenly items-center'>
        <h1 className='text-4xl text-white font-semibold'> Footer</h1>

        <div className='flex flex-col'>
        <div className='flex items-center justify-center'>
          <button className='text-white font-semibold p-2 px-5 rounded-lg drop-shadow-md bg-indigo-500 hover:bg-indigo-700 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300'>
          <a target="_blank" href='https://testnets.opensea.io/collection/oneliners-test'>
          View collection on OpenSea
          </a>
          </button>
        </div>
      </div>

    </div>


    </div>
    </>
    )
}




