const { IconConverter, IconBuilder, SignedTransaction } = require('icon-sdk-js').default
const getNetworkConfig = require('./getNetworkConfig.js')
const getWallet = require('./getWallet.js')
const getService = require('./getService.js')
const waitTransactionResult = require('./waitTransactionResult.js')

const { CallTransactionBuilder } = IconBuilder
const { nid } = getNetworkConfig()
const service = getService()

module.exports = function SCORECallWrite({ _adr, _method, _from, _params = {} }) {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = getWallet()

            const tx = new CallTransactionBuilder()
                .from(_from)
                .to(_adr)
                .stepLimit(IconConverter.toBigNumber('13000000'))
                .nid(IconConverter.toBigNumber(nid))
                .nonce(IconConverter.toBigNumber('1'))
                .method(_method)
                .version(IconConverter.toBigNumber('3'))
                .timestamp((new Date()).getTime() * 1000)
                .params(_params)

            const signedTx = new SignedTransaction(tx.build(), wallet)
            const txHash = await service.sendTransaction(signedTx).execute()
            const result = await waitTransactionResult(txHash)
            const { status, to, eventLogs } = result

            if (result.status === 1) {
                resolve({ status, to, eventLogs })
            } else {
                resolve(result)
            }
        } catch (err) {
            reject(err)
        }
    })
}