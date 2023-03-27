# Leadbest Consulting Group - TON Dooby

"Dooby has no master! Dooby is a free elf, and Dooby has come to save Harry Potter and his friends!"

<img src="https://drive.google.com/uc?export=download&id=1MrXKzXaecjjrSJ5MiQ9W1JWPqLP3FNJi" width="300">

## Idea

Our idea is build a telegram bot for community management, it has 3 functionalities:

1. **Missions**: User can **EASILY** take missions for rewards. Project owner can **EASILY** gather user's information without checking messy data.

    <img src="https://upload.cc/i1/2023/02/12/fnq4Ih.png" width="280">
    

2. **Rewards**: User can gather rewards without fee

    <img src="https://upload.cc/i1/2023/02/12/hdJ6cn.png" width="280">
    
    

3. **NFT Store**: User can **EASILY** buy NFTs through dialogue interaction

    <img src="https://upload.cc/i1/2023/02/12/rcFKYx.png" width="280">

## Technical Stacks

1. ton smart contract: Used to issue rewards
2. ton-connect: Used to gather user's information
3. telegram robot: Used to interact with users

## Deployment Steps

### 1. Deploy NFT Collection Contract
```
cd ton-nft-deployer
npm install
npm run start
```
### 2. Run local API Server
```
cd dooby-api
```shell
# 1. build image
$ docker build -t dooby-app .

# 2. test at local
$ docker run -e PORT=80 -p 80:80 dooby-app
```
### 3. Run local Web Server
```
cd webview
npm install
npm start
```
### 4. Put nftCloudFunction into Google Cloud function endpoint
```
cd nftCloudFunction
npm install
npm run start
```
### 5. Put appScript into Google appScipt endpoint
1. Create 4 new project in google appScript
2. Paste the 4 `.gs` files individually into each project
#### Reference
[Google Apps Script](https://developers.google.com/apps-script)
[Google appScript Console](https://script.google.com/home/start)

## Reference

[Idea Agenda](https://docs.google.com/presentation/d/1QEUo_2glJO5DsWRdGZ5p6H0i_8olk6lu865NMJp1fm0/edit#slide=id.g2052594a4f0_2_63)
[Demo Slide](https://pse.is/4ptg7e)
[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40TonDobby)](https://twitter.com/TonDooby)
