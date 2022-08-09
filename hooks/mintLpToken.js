const addresses = require('../config/addresses.js')
const SCORECallTransaction = require('../helpers/SCORECallTransaction.js')

module.exports = async function mintLpToken(balances, ammount = 0) {
    console.log('Minting LP token... \n')

    const address = process.env.ICON_PUBLIC_KEY

    console.log('Minting LP token... \n')
    const lpTokenMinting = await SCORECallTransaction({
        _adr: addresses.balancedPool,
        _method: 'add',
        _from: address,
        _params: {
            _baseToken: addresses.CFT,
            _quoteToken: addresses.sICX,
            _baseValue: balances.cft.raw,
            _quoteValue: `0x${ammount.toString(16)}`
        }
    })

    if (lpTokenMinting.status === 1) {
        console.log('Minting LP token success !')
        return true
    } else {
        console.log('Minting LP token failed !')
        console.log(lpTokenMinting)
        return false
    }
}