const {ethers} = require("hardhat") 
const {expect} = require("chai")

describe("Marketplace transactions" , async ()=> {
  let token, nft , marketplace
  let deployer, user1, user2
  beforeEach(async ()=> {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    user1 = accounts[1]
    user2  = accounts[2]

    console.log("Deploying...")
    // Fetch contract factory
    const Collection1 = await ethers.getContractFactory("Collection1")
    const EasyNFT = await ethers.getContractFactory("EasyNFT")
    const Marketplace = await ethers.getContractFactory("Marketplace")

    // Deploy
    nft = await Collection1.deploy()
    token = await EasyNFT.deploy()
    marketplace = await Marketplace.deploy(token.address)

    // mint NFTs
    await (await nft.mint("dhjklsdfk")).wait() //1
    await (await nft.mint("dhjklsdfk")).wait() //2
    await (await nft.connect(user1).mint("dhjklsdfk")).wait() //3
    await (await nft.connect(user1).mint("dhjklsdfk")).wait() //4
    
    // mint tokens
    await (await token.mint(ethers.utils.parseEther("1000"))).wait()
    await (await token.connect(user1).mint(ethers.utils.parseEther("1000"))).wait()
    await (await token.connect(user2).mint(ethers.utils.parseEther("1000"))).wait()

    // approval
    await (await token.approve(marketplace.address, 100)).wait()
    await (await token.connect(user1).approve(marketplace.address, 100)).wait()
    await (await token.connect(user2).approve(marketplace.address, 100)).wait()
    await (nft.approve(marketplace.address, 1))
    console.log("Deployed!")

  })



  describe("Tests" , () => {

    it("Should list item in market", async () =>{
      const blockNumber = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumber);
      const timestamp = blockBefore.timestamp;

      console.log("Block timestamp: ", timestamp)
      await (await marketplace.newMarketItem(nft.address, 1, 20, timestamp + 360000 )).wait()
      const items = await marketplace.getMarketItems()
      expect(items[0].price).to.equal(20)
      console.log(items[0])
    })

    it("Should buy the item" , async() => {
      const blockNumber = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumber);
      const timestamp = blockBefore.timestamp;

      console.log("Block timestamp: ", timestamp)
      await (await marketplace.newMarketItem(nft.address, 1, 20, timestamp + 360000 )).wait()

      await (await marketplace.connect(user2).buy(1)).wait()
      expect(await nft.ownerOf(1)).to.equal(user2.address)

    })

    it("Should accept offers" , async () => {
      const blockNumber = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumber);
      const timestamp = blockBefore.timestamp;

      console.log("Block timestamp: ", timestamp)
      await (await marketplace.newMarketItem(nft.address, 1, 20, timestamp + 360000 )).wait()

      await (await marketplace.connect(user2).bid(1,20)).wait()
      expect((await marketplace.getBids(1))[0].offeror).to.equal(user2.address)
     
      
      await (await marketplace.closeAuction(1,0))
      expect(await nft.ownerOf(1)).to.equal(user2.address)

    })

  
  })









}) 