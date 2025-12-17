# CobaltRelay (Built for Base)

## Purpose

CobaltRelay is a minimal Base ecosystem repository that demonstrates:
- Wallet connectivity and account flows via the official Base Account SDK (@base-org/account)
- Reliable onchain reads via Viem on Base networks
- Basescan-ready links for contract deployment and source verification

This repository is designed to be “Built for Base” and can be used to validate Base-compatible tooling and account-abstraction-friendly onboarding.

## Base Networks

Base Mainnet
- chainId (decimal): 8453
- Explorer: https://basescan.org
- Public RPC (rate-limited): https://mainnet.base.org

Base Sepolia (testnet)
- chainId (decimal): 84532
- Explorer: https://sepolia.basescan.org
- Public RPC (rate-limited): https://sepolia.base.org

## Script Summary

File: app/cobaltRelay.ts

The script:
1) Creates a Base Account SDK instance and obtains an EIP-1193 provider
2) Connects to a wallet and requests an address
3) Reads Base chain state using an RPC-backed public client:
   - chainId
   - latest block number
   - native balance (ETH)
4) Prints Basescan links for:
   - the connected account address
   - an optional deployed contract address (if provided)
5) Optionally reads ERC-20 metadata and the connected address token balance:
   - name, symbol, decimals, balanceOf

This provides a compact, practical proof of Base integration using official ecosystem tooling.

## Project Structure

- app/
  - cobaltRelay.ts
    Main script. Base Account SDK connection + Base RPC reads + optional ERC-20 reads and Basescan link output.

Recommended supporting files for a minimal web runtime:
- index.html
  Provides UI elements expected by the script: network selector, contract input, token input, run button, status line, and output area.
- package.json
  Declares dependencies and scripts for a lightweight bundler/dev server (Vite recommended).
- tsconfig.json
  TypeScript configuration.

## Dependencies

Primary:
- @base-org/account
  Base Account SDK used to create an EIP-1193 provider and support account abstraction compatible wallet flows.
- viem
  EVM client library for wallet interactions and onchain reads.

Referenced SDKs:
- OnchainKit: https://github.com/coinbase/onchainkit
- Coinbase Wallet SDK: https://github.com/coinbase/coinbase-wallet-sdk

## Installation

Requirements:
- Node.js 18+ recommended
- A browser environment (the script expects DOM elements and wallet popups)

Install dependencies in the repository root using your preferred package manager.

## Configuration

Optional environment variables:
- VITE_BASE_RPC_URL
  Overrides Base Mainnet RPC (default: https://mainnet.base.org)
- VITE_BASE_SEPOLIA_RPC_URL
  Overrides Base Sepolia RPC (default: https://sepolia.base.org)

Runtime inputs (via UI or your own wrapper):
- Network
  Select Base Mainnet (8453) or Base Sepolia (84532)
- Contract address (optional)
  If provided, the app prints Basescan deployment and verification links
- Token address (optional)
  If provided, the app reads ERC-20 metadata and balance for the connected address

## Running

Run the project as a small browser app:
- Start a dev server (Vite recommended).
- Open the app in a browser with a compatible wallet available.
- Choose a network (Base Sepolia recommended for testing).
- Optionally paste a deployed contract address and/or token address.
- Press Run.

Expected output:
- Connected address + Basescan link
- RPC chainId and latest block number
- Native balance (ETH)
- Optional Basescan links for a provided contract address
- Optional ERC-20 name/symbol/decimals and the connected balance for a provided token contract

## Notes

- Public RPC endpoints are rate-limited and may throttle; use a dedicated Base node provider for production.
- Account connectivity uses popup flows; ensure popups are enabled for your local dev origin.
- If your wallet is on a different network than selected, switch the wallet network and rerun.

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author

GitHub: https://github.com/vlasovbogdan
Public contact (email): studied-02soprano@icloud.com
Public contact (X): https://x.com/vlasovvbogdan

## References

Base Account SDK (createBaseAccountSDK):
https://docs.base.org/base-account/reference/core/createBaseAccount?utm_source=chatgpt.com

Account Abstraction on Base:
https://docs.base.org/base-chain/tools/account-abstraction?utm_source=chatgpt.com

## Testnet Deployment (Base Sepolia)

A smart contract has been deployed to the Base Sepolia test network for validation and testing purposes.
Network: Base Sepolia
chainId (decimal): 84532
Explorer: https://sepolia.basescan.org

Deployed contract addresses:
- 0x43cacbbd419e73eadb8521cf5e99d6bca5c350e7
- 0x25075f33403dd1a80c52050409a330b50197c223

Basescan deployment and verification links:
- Contract "Arrays" address: https://sepolia.basescan.org/address/0x43cacbbd419e73eadb8521cf5e99d6bca5c350e7
- Contract "Structs" address: https://sepolia.basescan.org/address/0x25075f33403dd1a80c52050409a330b50197c223
- Contract "Arrays" verification (source code): https://sepolia.basescan.org/0x43cacbbd419e73eadb8521cf5e99d6bca5c350e7/0#code
- Contract "Structs" verification (source code): https://sepolia.basescan.org/0x25075f33403dd1a80c52050409a330b50197c223/0#code

This deployment is used to validate Base-compatible tooling, account abstraction flows, and onchain read operations in a test environment prior to mainnet usage.
