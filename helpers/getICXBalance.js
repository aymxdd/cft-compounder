const getService = require('./getService.js')
const service = getService()

module.exports = function getICXBalance(address) {
    return new Promise((resolve, reject) => {
        try {
            resolve(service.getBalance(address).execute())
        } catch (err) {
            reject(err)
        }
    })
}