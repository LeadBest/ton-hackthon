[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40TonDobby)](https://twitter.com/TonDooby) [![Github](https://img.shields.io/badge/github-%23181717.svg?&style=for-the-badge&logo=github&logoColor=white)](https://github.com/LeadBest/ton-hackthon/tree/master) [<img src="https://icodrops.com/wp-content/uploads/2022/05/vQ_AAwon_400x400.jpg" width=100>](https://dorahacks.io/buidl/4315) [<img src="https://media.microfusion.cloud/wp-content/uploads/2020/05/LCG-logo-2_72dpi.png" width=150>](https://www.leadbestconsultant.com/)

# Leadbest Consulting Group - TON Dooby

"Dooby has no master! Dooby is a free elf, and Dooby has come to save Harry Potter and his friends!"

<img src="https://drive.google.com/uc?export=download&id=1MrXKzXaecjjrSJ5MiQ9W1JWPqLP3FNJi" width="300">

## Demo Video

[<img src="https://drive.google.com/uc?export=download&id=1-tzmU_EYwAkAfVqicDbroKJDLfI-b0EW" width="300">](https://drive.google.com/file/d/1F-4XFDROHhUH6lD_dkWlBl09LN9OVWNh/view)


## Idea

Our idea is build a telegram bot for community management, it has 3 functionalities:

1. **Missions**: User can **EASILY** take missions for rewards. Project owner can **EASILY** gather user's information without checking messy data.

    <img src="https://drive.google.com/uc?export=download&id=1FH7IFkMRzbO5FNNm_fIFAb5FGsll0SIG">
    

2. **Rewards**: User can gather rewards without fee

    <img src="https://drive.google.com/uc?export=download&id=1qrzF4CmsR8YkSKZ5VEDij7qbQJW0bf_5">
    
    

3. **NFT Store**: User can **EASILY** buy NFTs through dialogue interaction

    <img src="https://drive.google.com/uc?export=download&id=14jdIoERsO_6GBJolLwWfC_EWtliTEBoP">

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
    #### appScript Reference

    [Google Apps Script](https://developers.google.com/apps-script)

    [Google appScript Console](https://script.google.com/home/start)

## Dooby API Documentation
- [Link to documentation](https://github.com/LeadBest/ton-hackthon/blob/master/dooby-api/README.md)


## Reference

[Demo Slide](https://pse.is/4ptg7e)
