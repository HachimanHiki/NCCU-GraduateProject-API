var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

let allTransaction = [];
let result = [];

/**
* @swagger
* /geth:
*    get:
*      description: It is for consensus engine to get all transactions from Geth
*      operationId: replaceProduct
*      summary: Get transactions from Geth
*      tags: [geth]
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
router.get('/geth', function(req, res, next) {
  try {
    res.send({
      transaction: allTransaction
    })
  }
  catch (error) {
    res.send("fail")
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
router.get('/consensus', function(req, res, next) {
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
router.post('/geth', upload.array(), function(req, res, next) {
  try {
    allTransaction = req.body.transaction
    //result = []
    // to replace consensus engine
    /*
    if(allTransaction.length>2){
      result = allTransaction.slice(0, -2)
    }
    else{
      result = allTransaction
    }*/
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
router.post('/consensus', upload.array(), function(req, res, next) {
  try {
    result = req.body.transaction
    res.send("success")
  }
  catch (error) {
    res.send("fail")
  }
});

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
