/*

    Setup

*/


const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
const celo_ethers = require('@celo-tools/celo-ethers-wrapper')
const { ethers } = require('ethers')

require('dotenv').config({path: '.env'})

const web3 = new Web3(`https://alfajores-forno.celo-testnet.org`)

// Import the file that includes the contract ABI and deployment code
// Read more about the ABI here https://docs.soliditylang.org/en/latest/abi-spec.html
const HelloWorld = require('./truffle/build/contracts/HelloWorld.json')

const kit = ContractKit.newKitFromWeb3(web3)
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)

kit.connection.addAccount(account.privateKey)
kit.defaultAccount = account.address

/*

    Basic Deployment

    Step 1.

    Before you run this basic deployment, you need the compiled Solidity smart contract.
    This examples uses the HelloWorld.sol contract and the corresponding HelloWorld.json Truffle artifact.

*/

let contractAddress
let helloWorldContract

async function deployContract(){

    let CeloTx = {
        to: null,                    // to "null" address indicates a contract deployment tx
        data: HelloWorld.bytecode    // data to send for smart contract execution
    }

    let tx = await kit.sendTransaction(CeloTx)
    let receipt = await tx.waitReceipt()

    console.log(receipt)
    console.log(`deploy tx: https://alfajores-blockscout.celo-testnet.org/tx/${receipt.transactionHash}`)

    // Save the deployed contract address so you can reference it later
    contractAddress = receipt.contractAddress
}
// deployContract()

/*

    Step 2.

    Read the deployed contract.

    Initialize the contract with the contract ABI and the address.

*/

async function readContract(){

    await deployContract()

    // web3js Contract instance
    // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#new-contract
    helloWorldContract = new kit.web3.eth.Contract(HelloWorld.abi, contractAddress)

    let name = await helloWorldContract.methods.getName().call()

    console.log(`HelloWorld stored name: ${name}\n`)
}
// readContract()

/*

    Step 3.

    Update the contract

    - call `setName()` on the initialized contract
    - specify the from account and the gas amount

*/

async function updateContract(){
    await readContract()

    let tx = await helloWorldContract.methods.setName("Hello Celo Camp!").send({from: account.address,gas: 200000 })

    console.log(tx)
    console.log(`Update name tx: https://alfajores-blockscout.celo-testnet.org/tx/${tx.transactionHash}/token_transfers \n\n`)

    console.log(`New name: ${await helloWorldContract.methods.getName().call()}`)

}
// updateContract()

/*

    Using Ethers.js

    */

let ethers_wallet

async function deployWithEthers(){

    const provider = new celo_ethers.CeloProvider(`https://celo-alfajores--rpc.datahub.figment.io/apikey/${process.env.FIGMENT_API_KEY}/`)
    await provider.ready
    ethers_wallet = new celo_ethers.CeloWallet(account.privateKey, provider)

    const txResponse = await ethers_wallet.sendTransaction({
        to: null,
        data: HelloWorld.bytecode
    })

    const txReceipt = await txResponse.wait()

    contractAddress = txReceipt.contractAddress
    console.log(`celo-ethers deployment: https://alfajores-blockscout.celo-testnet.org/tx/${txReceipt.transactionHash}/`)
}
// deployWithEthers()

/*

    Read the contract using Ethers.js

*/

async function readWithEthers(){
    await deployWithEthers()
    helloWorldContract = new ethers.Contract(contractAddress, HelloWorld.abi, ethers_wallet)
    console.log(await helloWorldContract.getName())
}
// readWithEthers()


/*

    Update the contract using Ethers

*/

async function writeWithEthers(){
    await readWithEthers()

    let txResponse = await helloWorldContract.setName("hi!!", { gasLimit: 200000})
    const txReceipt = await txResponse.wait()
    console.log(`update: https://alfajores-blockscout.celo-testnet.org/tx/${txReceipt.transactionHash}/`)

    console.log(await helloWorldContract.getName())
}
// writeWithEthers()
