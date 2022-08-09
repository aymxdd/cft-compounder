const getService = require('./getService.js')

module.exports = function waitTransactionResult(txHash) {
    return new Promise(async (resolve, reject) => {
        if (!txHash) reject('txHash is required')
        
        const service = getService()
        let lastStatus = ''

        const loop = setInterval(async () => {
            try {
                const result = await service.getTransactionResult(txHash).execute()
                if (result !== '[RPC ERROR] Pending : Pending' && result !== '[RPC ERROR] Executing : Executing') {
                    clearInterval(loop)
                    resolve(result)
                }
            } catch (err) {
                if (lastStatus !== err) {
                    lastStatus = err
                }
            }
        }, 500)
    })
}