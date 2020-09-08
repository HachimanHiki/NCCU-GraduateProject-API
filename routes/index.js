var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

const fs = require('fs');
EC = require('elliptic').ec;
ec = new EC('secp256k1');
const axios = require('axios');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

let flag = 0
let allTransaction = [];
let result = [];
let publicKeyList = [];
const consensusIP = ['54.209.224.158', '54.224.45.72', '54.164.99.38', '54.237.56.147', '52.201.212.99', '54.145.83.62'];
const consensusPort = ':1050';

fs.readFile('publicKey.txt', function (err, data) {	//建立公鑰
  if (err) return console.log(err);
  readfile2 = data.toString().split('\n');
  for (i = 0; i < 6; i++) {
    publicKeyList[i] = readfile2[i].replace(/[\r\n]/g, "");
  }
});


/**
* @swagger
* /consensus:
*    get:
*      description: It is for Geth to know the result after consensus algorithm
*      operationId: replaceProduct
*      summary: Get result from consensus engine
*      tags: [consensus]
*      responses:
*         200:
*           description: array of transaction hashs
*           content:
*             application/json:
*               schema:
*                 type: string
*                 example: {
*                            transaction: [
*                              "0xac8a5a7899d4d995ef2054220cf1980af4d2afd48c3a7cb2ee845c9a60d3a3a3", 
*                              "0xb5e2737e053512ec8c376482bd024e2c8b6860907664cc9796bf7150fdd08dc3"
*                            ]
*                          }
*         400:
*           description: fail
*/
router.get('/consensus', function (req, res, next) {
  try {
    //console.log(result)
    res.send({
      transaction: result
    })
  }
  catch (error) {
    res.send("fail")
  }
});


/**
* @swagger
* /geth:
*    post:
*      description: It is for Geth to post all transactions
*      operationId: replaceProduct
*      summary: Post transactions from Geth
*      tags: [geth]
*      requestBody:
*        description: array of transactions hash    
*        required: true
*        content:
*          application/json:
*            schema:
*               type: string
*               example: {
*                            transaction: [
*                              "0xac8a5a7899d4d995ef2054220cf1980af4d2afd48c3a7cb2ee845c9a60d3a3a3", 
*                              "0xb5e2737e053512ec8c376482bd024e2c8b6860907664cc9796bf7150fdd08dc3"
*                            ]
*                        }
*      responses:
*         200:
*           description: success
*         400:
*           description: fail
*/
router.post('/geth', upload.array(), function (req, res, next) {
  try {
    allTransaction = req.body.transaction
    if (flag != req.body.blockHeight) {
      flag = req.body.blockHeight
      result = []
      // to replace consensus engine
      /*
      if(allTransaction.length>2){
        result = allTransaction.slice(0, -2)
      }
      else{
        result = allTransaction
      }*/
      consensusIP.forEach(async ip => {

        await axios({
          method: 'post',
          url: 'http://' + ip + consensusPort + '/Height',
          data: {
            transaction: allTransaction,
            receiverAddress: req.body.receiverAddress,
            height: req.body.blockHeight,
            parentHash: req.body.parentHash
          }
        })
        .then(function (responses) {
          console.log(responses.data)
        })
        .catch(function (error) {
          console.log(error.data)
        })
      })
    }
    res.send("success")
  }
  catch (error) {
    res.send("fail")
  }
});


/**
* @swagger
* /post/consensus:
*    post:
*      description: It is for consensus engine to post the result
*      operationId: replaceProduct
*      summary: Post result from consensus engine
*      tags: [consensus]
*      requestBody:
*        description: array of transactions hash    
*        required: true
*        content:
*          application/json:
*            schema:
*               type: string
*               example: {
*                            transaction: [
*                              "0xac8a5a7899d4d995ef2054220cf1980af4d2afd48c3a7cb2ee845c9a60d3a3a3", 
*                              "0xb5e2737e053512ec8c376482bd024e2c8b6860907664cc9796bf7150fdd08dc3"
*                            ]
*                        }
*      security:
*        - bearerAuth: []
*      responses:
*         200:
*           description: success
*         400:
*           description: error
*/
router.post('/consensus', upload.array(), function (req, res, next) {
  try {
    blockHash = req.body.blockHash
    voteArr = req.body.vote // array
    count = 0
    /*
    vote : {
      sender: ID,
      voteHash: voteHash,
      blockHash: blockHash,
      signature: signature
    }
    */
    // voteArr is a object
    /*
     voteArr.foreach(vote => {
       if (customVerify(vote) && vote.blockHash == blockHash) {
         count += 1
       }
     })
     */
    for (i = 0; i < voteArr.length; i++) {
      vote = voteArr[i]
      if (customVerify(vote) && vote.blockHash == blockHash) {
        count += 1
      }
    }


    if (flag >= 1 && count >= 5) {
      flag = 0
      result = req.body.transaction
      if (result.length == 0) {
        result = ['0xabc']
      }
    }

    res.send("success")
  }
  catch (error) {
    res.send("fail")
  }
});

function customVerify(message) {
  const publicKey = ec.keyFromPublic(publicKeyList[message.sender], 'hex');
  return publicKey.verify(message.voteHash, message.signature);
}

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API for Geth and other consensus engine",
      version: "1.0.0",
      description:
        "Though API we can get all transactions from Geth to consensus engine and receive result from consensus engine to Geth"
    },
    servers: [
      {
        url: "http://localhost:3000/"
      }
    ]
  },
  apis: ['./routes/index.js']
};
const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(specs, { explorer: true }));

module.exports = router;
