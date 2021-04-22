# Deploying and interacting with Contracts on Celo

In this repo you will go over how to deploy and interact with contracts on the Celo network.

- `lesson.js` shows how to deploy and interact with contracts using basic SDKs (contractkit, web3.js and ethers.js)
- The `./truffle/` directory shows how to deploy contracts using the [Truffle framework](https://www.trufflesuite.com/truffle) for managing contracts.
- The `./webpage/` directory shows how to connect a webpage to deployed contracts using the [Celo extension wallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh).

## Get started

1. Run `yarn install` in the project root.
2. Run `node createAccount.js`. This will print new Celo account details. Copy the private key for your new account into the `PRIVATE_KEY` variable in `.env`.
3. Fund the account address on the Alfajores testnet here: https://celo.org/developers/faucet
4. Create an account on Figment Data Hub [here](https://figment.io/datahub/celo/) and get your API key and add it to the `FIGMENT_API_KEY` in `.env`. This will allow you to connect to the Celo networks.

## Remix Web IDE

You can deploy contracts using the [Remix web-based IDE](https://remix.ethereum.org/). You will need the [Celo extension wallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh) and enable the Celo plugin.

## Hardhat

Deploying contracts with [hardhat](https://hardhat.org/) is not covered in this workshop. The Ubeswap decentralized exchange uses hardhat for contract management. You can see how it is used [here](https://github.com/Ubeswap/ubeswap). It uses the [hardhat-celo plugin](https://github.com/Ubeswap/hardhat-celo).
## Verify Contracts

You can verify your deployed contracts at https://sourcify.dev/. You can get contract metadata files required for verification using Remix or the `solc` compiler.