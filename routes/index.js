var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

let allTransaction = [];
let result = [];

router.get('/get/geth', function(req, res, next) {
  try {
    res.send({
      transaction: allTransaction
    })
  }
  catch (error) {
    res.send("fail")
  }
});

router.get('/get/consensus', function(req, res, next) {
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

router.post('/post/geth', upload.array(), function(req, res, next) {
  try {
    allTransaction = req.body.transaction
    //result = []
    if(allTransaction.length>2){
      result = allTransaction.slice(0, -2)
    }
    else{
      result = allTransaction
    }
    res.send("success")
  }
  catch (error) {
    res.send("fail")
  }
});

router.post('/post/consensus', upload.array(), function(req, res, next) {
  try {
    result = req.body.transaction
    res.send("success")
  }
  catch (error) {
    res.send("fail")
  }
});

module.exports = router;
