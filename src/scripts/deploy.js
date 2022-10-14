
const hre = require("hardhat");

async function main() {
    const accounts = await ethers.getSigners()
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2  = accounts[2]

    console.log("Deploying...")
    // Fetch contract factory
    const Collection1 = await ethers.getContractFactory("Collection1")
    const EasyNFT = await ethers.getContractFactory("EasyNFT")
    const Marketplace = await ethers.getContractFactory("Marketplace")

    // Deploy
    let nft = await Collection1.deploy()
    await nft.deployed()
    let token = await EasyNFT.deploy()
    await token.deployed()
    let marketplace = await Marketplace.deploy(token.address)
    await marketplace.deployed()
    console.log("MARKETPLACE: ",marketplace.address)
    console.log("TOKEN: ",token.address)
    console.log("NFT: ",nft.address)


    // mint NFTs
    await (await nft.mint("https://ca6zaodpij3jjrl6qkfa7fxgyvdyna5ktxz2ntvrqiq4idqhgpkq.arweave.net/ED2QOG9CdpTFfoKKD5bmxUeGg6qd86bOsYIhxA4HM9U")).wait() //1
    await (await nft.mint("https://arweave.net/khp7qgg-ncS4iaSAaF3Mys8n96LYungRr8ehkaajMvE")).wait() //2
    await (await nft.mint("https://arweave.net/rXN7_L8pOTBDk7ftXc3Hb2K2eaba98At3cD_yhitHW4")).wait() //3
    await (await nft.mint("https://arweave.net/rXN7_L8pOTBDk7ftXc3Hb2K2eaba98At3cD_yhitHW4")).wait() //4
    
    const balance = await nft.balanceOf(deployer.address)
    console.log(balance)
    // mint tokens
    await (await token.mint(ethers.utils.parseEther("1000"))).wait()
    

    // approval
    await (await token.approve(marketplace.address, 100)).wait()
    await (nft.approve(marketplace.address, 1))
    console.log("Deployed!")


    const blockNumber = await ethers.provider.getBlockNumber()
    const blockBefore = await ethers.provider.getBlock(blockNumber);
    const timestamp = blockBefore.timestamp;

    const sell1 = await marketplace.newMarketItem(nft.address, 1, 20, timestamp + 360000)
    await sell1.wait()

    const sell2 = await marketplace.newMarketItem(nft.address, 2, 200, timestamp + 360000)
    await sell2.wait()

    const sell3 = await marketplace.newMarketItem(nft.address, 3, 10, timestamp + 360000)
    await sell3.wait()

    const sell4 = await marketplace.newMarketItem(nft.address, 4, 5, timestamp + 360000)
    await sell4.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
