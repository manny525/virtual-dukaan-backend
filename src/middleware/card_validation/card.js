const valid = require('card-validator')
const card = async(req,res,next)=>{
    try{
        const numb=valid.number(req.body.number)
        if((!numb.isPotentiallyValid)||(!numb.isValid))
        {
            throw new Error()
        }
        exp=valid.expirationDate(req.body.date)
        if((!exp.isPotentiallyValid) || (!exp.isValid))
        {
            throw new Error()
        }
        req.card=numb.card
        next()
        }catch(e){
        res.status(400).send({erroe:'Invalid card details'})
    }
}


module.exports=card
