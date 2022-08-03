const addresses = require('../config/addresses.js')
const SCORECallTransaction = require('../helpers/SCORECallTransaction.js')
const SCOREReadOnly = require('../helpers/SCOREReadOnly.js')

module.exports = async function depositLpToCraft() {
    const address = process.env.ICON_PUBLIC_KEY

    const lpBalance = await SCOREReadOnly({
        _adr: addresses.balancedPool,
        _method: 'balanceOf',
        _params: {
            _owner: address,
            _id: '0x9'
        }
    })

    console.log('LP token balance: ' + parseInt(lpBalance, 16) * 10 ** -18)
    console.log('\nDepositing into Craft...')

    const deposit = await SCORECallTransaction({
        _adr: addresses.balancedPool,
        _method: 'transfer',
        _from: address,
        _params: {
            _to: addresses.cftStaking,
            _id: '0x9',
            _value: lpBalance,
            _data: '0x7b226d6574686f64223a20227374616b65227d' // { method: transfer }
        }
    })

    if (deposit.status === 1) {
        console.log('Depositing into Craft successfully !')
        return true
    } else {
        console.log('Depositing into Craft failed !')
        console.log(deposit)
        return false
    }
}