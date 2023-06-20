# CELO MARKETPLACE
- Demo: [Marketplace](https://celo-frontend-eta.vercel.app/)

## About The Project
- A simple marketplace dapp built on the Celo blockchain. The decentralized marketplace application will allow users to list their items for sale, purchase items, view listed items and lookup products they purchased or uploaded on their profile. It is built on the pre-existing marketplace smart contract with added functionalities and an improved frontend page. The following functionalities were added

1. To the smart contract
- `supply` property to the `Product` struct
- `userProducts` mapping to store all the products bought by a user
- `buyAllProduct()` frunction: It enables users to buy all available supply of a particular product at the specified price


2. To the frontend
- Available supply of a particular product
- `Profile.tsx` component: to display all the products uploaded and purchased by a user
- `Buy all` button: to allow users by all the available supply o a particular product
- `useOwner` hook: to get all the products purchased by a user from the smart contract
- `useBuyAllProduct` hook: to buy all the available supply of a particular product

## Built With

Celo Composer is built on Celo to make it simple to build dApps using a variety of front-end frameworks, and libraries.

- [Celo](https://celo.org/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.19/)
- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Rainbowkit-celo](https://github.com/celo-org/rainbowkit-celo)

## Prerequisites

- Node
- Git (v2.38 or higher)

## Quick Start

To get this project up running locally, follow these simple steps:

1. Clone the repository:

```bash
git clone https://github.com/ozo-vehe/celo-frontend.git
```

2. Navigate to the `react-app` directory:

```bash
cd celo-frontend/packages/react-app
```

3. Install the dependencies:

```bash
yarn install
```

4. Run the dapp:

```bash
yarn run dev
```

<!-- TESTING APP -->

To properly test the dapp you will need to have a Celo wallet with testnet tokens.
This learning module [NFT Contract Development with Hardhat](https://hackmd.io/exuZTH2hTqKytn2vxgDmcg) will walk you through the process of creating a Metamask wallet and claiming Alfajores testnet tokens.
   
<!-- CONTRIBUTING -->

## :writing_hand: Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your new feature branch (`git checkout -b feature/new_feature`)
3. Commit your changes (`git commit -m 'icluded a new feature(s)'`)
4. Push to the branch (`git push origin feature/new_feature`)
5. Open a pull request


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

#  Thank you
