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
    #### appScript Reference

    [Google Apps Script](https://developers.google.com/apps-script)

    [Google appScript Console](https://script.google.com/home/start)

## Dooby API Documentation
## 1. Bind user Telagram ID and Ton Address
> [POST] https://app-cplk6yhpaq-de.a.run.app/api/users

```json
// input
{
   "tgUserId"   : "123",
   "tonAddress" : "address"
}

// response (status code: 201)
{
   "data": {
       "tgUserId"   : "123",
       "tonAddress" : "address",
       "updateTime" : "2023-02-11T07:44:52.000000Z",
       "createTime" : "2023-02-11T07:44:52.000000Z"
   }
}
```

## 2. Get user details
> [GET] https://app-cplk6yhpaq-de.a.run.app/api/users/{tgUserId}

```json
// response (status code: 200)
{
   "data": {
       "tgUserId": "123",
       "tonAddress": "address",
       "updateTime": "2023-02-11T07:44:52.000000Z",
       "createTime": "2023-02-11T07:44:52.000000Z"
   }
}
```

## 3. Create new tasks
> [POST] https://app-cplk6yhpaq-de.a.run.app/api/tasks

```json
// input
// --- Task 1 ---
{
    "taskName"    : "Connect Ton Wallet",
    "description" : "Ask User to connect their ton wallet"
}
// --- Task 2 ---
{
    "taskName"    : "Reply Mission",
    "description" : "Ask User reply to specific message"
}
// --- Task 3 ---
{
    "taskName"    : "Reaction Mission",
    "description" : "Ask User react to specific message"
}

// response (status code: 201)
{
    "data": {
        "taskId": 3,
        "taskName": "Reaction Mission",
        "description": "Ask User react to specific message",
        "updateTime": "2023-03-08T09:34:07.000000Z",
        "createTime": "2023-03-08T09:34:07.000000Z"
    }
}
```

## 4. Get user task list
> [GET] https://app-cplk6yhpaq-de.a.run.app/api/tasks/users/{tgUserId}

```json
// response (status code: 200)
{
    "totalRows": 3,
    "totalPages": 1,
    "pageSize": 10,
    "currentPage": 1,
    "data": [
        {
            "taskId": 1,
            "taskName": "Connect Ton Wallet",
            "description": "Ask User to connect their ton wallet",
            "status": "COMPLETE",
            "expiredTime": null,
            "updateTime": "2023-03-08T09:33:47.000000Z",
            "createTime": "2023-03-08T09:33:47.000000Z"
        },
        {
            "taskId": 2,
            "taskName": "Reply Mission",
            "description": "Ask User reply to specific message",
            "status": "PENDING",
            "expiredTime": null,
            "updateTime": "2023-03-08T09:33:59.000000Z",
            "createTime": "2023-03-08T09:33:59.000000Z"
        },
        {
            "taskId": 3,
            "taskName": "Reaction Mission",
            "description": "Ask User react to specific message",
            "status": "PENDING",
            "expiredTime": null,
            "updateTime": "2023-03-08T09:34:07.000000Z",
            "createTime": "2023-03-08T09:34:07.000000Z"
        }
    ]
}
```

## 5. User Claim Nft after complete all tasks
> [GET] https://app-cplk6yhpaq-de.a.run.app/api/users/nfts/{tgUserId}:claim

```json
// response (status code: 204)
```

## 6. Get user claim record url
> [GET] https://app-cplk6yhpaq-de.a.run.app/api/users/nfts/claims/{tgUserId}

```json
// response (status code: 200)
{
    "url": "https://testnet.tonscan.org/nft/EQDB7zFyZ6y9EKF5c72DFw39lFQkgw1H4kdmGLYC3NvTJDZK"
}
```


## Reference

[Demo Slide](https://pse.is/4ptg7e)

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40TonDobby)](https://twitter.com/TonDooby)
