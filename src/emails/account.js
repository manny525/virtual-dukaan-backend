const sgMail=require('@sendgrid/mail')
const { response } = require('express');
sgMail.setApiKey(require('../../config').SENDGRID_API_KEY);


const welcomemail=async(email,name,otp)=>{
    try{
        await sgMail.send({
            to:email,
            from:'aagrawal1@student.nitw.ac.in',
            subject:'Account Verification!',
            text:`Welcome to the app,${name}.
            OTP is ${otp}`,
        })
    }catch(e){
        console.log('error');
    }
}

const generateVerificationCode = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sendVerificationCode = async (email) => {
    const vCode = await generateVerificationCode(100000, 999999)
    try {
        await sgMail.send({
            to: email,
            from: 'aagrawal1@student.nitw.ac.in',
            subject: 'Verificaton Code',
            text: `Your verification code is ${vCode}`
        })
    } catch (e) {
        console.log(e)
        return e
    }
    return vCode
}

const sendPaymentOTP = async (email, otp, merchantName) => {
    try {
        await sgMail.send({
            to: email,
            from: 'aagrawal1@student.nitw.ac.in',
            subject: 'Verificaton Code',
            text: `Your OTP for payment to ${merchantName} is ${otp}. 
            Give this code to the merchant to pickup your order or end your service request.`
        })
    } catch (e) {
        console.log(e)
        return e
    }
    return otp
}

module.exports={
    welcomemail,
    sendVerificationCode,
    sendPaymentOTP
}