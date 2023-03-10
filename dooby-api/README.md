# Overview
- Service is deployed to GCP Cloud Run
- DB is on GCP Cloud SQL (PostgreSQL)

# Steps to run at local
```shell
# 1. build image
$ docker build -t dooby-app .

# 2. test at local
$ docker run -e PORT=80 -p 80:80 dooby-app
```

# APIs
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
