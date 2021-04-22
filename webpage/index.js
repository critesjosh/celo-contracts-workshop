let Web3 = require("web3")
let ContractKit = require("@celo/contractkit")

// Import the truffle contract artifact, so you can get the ABI and the deployed contract address

let HelloWorld = require("../truffle/build/contracts/HelloWorld.json")

let kit
let helloWorldContract

// Connect to the celo extension wallet
// Get the users account
// Initialize the contract that you want to interact with on the appropriate network

const connectCeloWallet = async function () {
  if (window.celo) {
    try {

      // Enable the extension to access the page if it isn't already enabled
      await window.celo.enable()

      // Get the Celo provider injected by the extension wallet
      const web3 = new Web3(window.celo)
      kit = ContractKit.newKitFromWeb3(web3)

      // Get the users accounts
      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      // Get the network that the user is connected to
      let chainId = await kit.web3.eth.getChainId()
      
      // Initalize the contract
      helloWorldContract = new kit.web3.eth.Contract(HelloWorld.abi, HelloWorld.networks[chainId].address)
      
      // Read the contract storage
      await getName()
    } catch (error) {
      console.log(`⚠️ ${error}.`)
    }
  } else {
    console.log("⚠️ Please install the CeloExtensionWallet.")
  }
}

async function setName() {
  let newName = document.getElementById("newName").value
  let tx = await helloWorldContract.methods.setName(newName).send({ from: kit.defaultAccount, gas: 200000 })
  getName()
}

const getName = async function () {
  let name = await helloWorldContract.methods.getName().call()
  document.querySelector("#name").textContent = name
}

document.querySelector("#login").addEventListener("click", async (e) => {
  connectCeloWallet()
})  

document.querySelector("#setName").addEventListener("click", async (e) => {
  setName()
}) 