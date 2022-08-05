const SCORECallTransaction = require('../helpers/SCORECallTransaction.js')
const addresses = require('../config/addresses.js')
const getBalances = require('./getBalances.js')

module.exports = async function claimCFTRewards() {
    console.log('\nClaiming CFT...')

    const address = process.env.ICON_PUBLIC_KEY
    const claimCFTRewardsQuery = await SCORECallTransaction({
        _adr: addresses.cftRewards,
        _method: 'claimRewards',
        _from: address,
        _params: {
            _isRestake: '0x0'
        }
    })

    if (claimCFTRewardsQuery.status === 1) {
        console.log('\nClaiming CFT success !')
        const balances = await getBalances()
        console.log(`New CFT balance: ${balances.cft.formatted}`)
        return true
    } else {
        console.log('\nClaiming CFT failed !')
        console.log(claimCFTRewardsQuery)
        return false
    }
}