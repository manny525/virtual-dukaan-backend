// 'use strict';
var api = require('./src/payment').payment_account_validation_api;
var authCredentials = require('../../../credentials.json');

var payment_account_validation_api = new api(authCredentials);

const validate = async(req,res,next)=>{
    try{
        const payment = await payment_account_validation_api.cardvalidation(getParameters(req))
        next()
    }catch(e){
        res.status(400).send({error:e.body.errorMessage})
    }
}

function getParameters(req) {
    var parameters = {
        "x-client-transaction-id": "{enter appropriate value}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    parameters.payload = {    
        "primaryAccountNumber": req.body.number,  
        "cardExpiryDate": req.body.date,  
        "cardCvv2Value": req.body.cvv,  
    }
    return parameters;
}

const cardcheck = async(req,res,next)=>{
    try{
        const payment = await payment_account_validation_api.cardvalidation(getParameter(req))
        next()
    }catch(e){
        res.status(400).send({error:e.body.errorMessage})
    }
}

function getParameter(req) {
    var parameters = {
        "x-client-transaction-id": "{enter appropriate value}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    parameters.payload = {    
        "primaryAccountNumber": req.body.recipientPrimaryAccountNumber,  
        "cardExpiryDate": req.body.date,  
        "cardCvv2Value": req.body.cvv,  
    }
    return parameters;
}


module.exports = {
    validate,
    cardcheck
}