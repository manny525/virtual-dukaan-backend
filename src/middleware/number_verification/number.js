const request = require('request')
const apikey = require('../../../config').number_verification_apikey;

const check = async (req, res, next) => {
    try {
        const url = 'http://apilayer.net/api/validate?access_key=' + apikey + '&number=' + req.body.contact + '&country_code=IN&format=1'

        request({ url, json: true }, function (error, { body } = {}) {
            if (error) {
                return res.status(500).send(error)
            }
            if (!body.valid) {
                return res.status(400).send({ error: 'Invalid Number' })
            }
            next()
        })
    } catch (e) {
        res.status(400).send({ error: 'Invalid Number' })
    }
}

module.exports = check