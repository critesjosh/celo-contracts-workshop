let Web3 = require("web3")
let ContractKit = require("@celo/contractkit")

let HelloWorld = require("../truffle/build/contracts/HelloWorld.json")

let kit
let helloWorldContract
let alfajores_network_id = "44787"

const connectCeloWallet = async function () {
  if (window.celo) {
    try {
      await window.celo.enable()

      const web3 = new Web3(window.celo)
      kit = ContractKit.newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      helloWorldContract = new kit.web3.eth.Contract(HelloWorld.abi, HelloWorld.networks[alfajores_network_id].address)
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