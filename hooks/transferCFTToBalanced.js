const addresses = require('../config/addresses.js')
const SCORECallTransaction = require('../helpers/SCORECallTransaction.js')
const getBalances = require('./getBalances.js')

module.exports = async function transferCFTToBalanced() {
    console.log('Transfering CFT to balanced...\n')

    const address = process.env.ICON_PUBLIC_KEY
    const balances = await getBalances()

    const CFTTransfer = await SCORECallTransaction({
        _adr: addresses.CFT,
        _method: 'transfer',
        _from: address,
        _params: {
            _to: addresses.balancedPool,
            _value: balances.cft.toHexString(),
            _data: '0x7b226d6574686f64223a225f6465706f736974227d' // { method: transfer }
        }
    })

    console.log('CFT transfer complete.\n')

    if (CFTTransfer.status === 1) {
        console.log('Depositiing CFT success !')
        return true
    } else {
        console.log('Depositiing CFT failed !')
        console.log(CFTTransfer)
        return false
    }
}