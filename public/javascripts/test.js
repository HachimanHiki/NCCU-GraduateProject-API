'use strict'

var request = require('request')

let array = []

while(true){
    console.log('aaa')
    request('http://localhost:3000/get/flag', function(error, response, body){
        //if(!error && response.statusCode == 200){
            console.log(body)
        //}
    })
    sleep(10000)
    /*
    $.get('/get', {}, function (result) {
        if(result.flag == 2){
            
            $.get('/get', function (result1) {
                array = result1.transaction
                array = array.slice(0, -2)
                console.log(array)
                if(array.length>2){
                    
                    //console.log(array)
                }    
            })

            console.log(array)

            $.post('/post2', {
                transaction: array
            }, function (result2) {
                //console.log(result2.transaction)
            })
            
            sleep(1000)
        }
    })
    */
}

function f(){
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }