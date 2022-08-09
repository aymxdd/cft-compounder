const addresses = require('../config/addresses.js')
const SCORECallTransaction = require('../helpers/SCORECallTransaction.js')

module.exports = async function transferSICXToBalanced(ammount = 0) {
    console.log('Transfering sICX to balanced...\n')

    const address = process.env.ICON_PUBLIC_KEY

    const sICXTransfer = await SCORECallTransaction({
        _adr: addresses.sICX,
        _method: 'transfer',
        _from: address,
        _params: {
            _to: addresses.balancedPool,
            _value: `0x${ammount.toString(16)}`,
            _data: '0x7b226d6574686f64223a225f6465706f736974227d' // { method: transfer }
        }
    })

    console.log('sICX transfer complete.\n')

    if (sICXTransfer.status === 1) {
        console.log('Depositiing sICX success !')
        return true
    } else {
        console.log('Depositiing sICX failed !')
        console.log(sICXTransfer)
        return false
    }
}