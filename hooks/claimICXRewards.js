const SCORECallTransaction = require('../helpers/SCORECallTransaction.js')
const addresses = require('../config/addresses.js')
const getBalances = require('./getBalances.js')
const { formatUnits } = require('ethers/lib/utils.js')

module.exports = async function claimICXRewards() {
    console.log('\nClaiming ICX...')

    const address = process.env.ICON_PUBLIC_KEY
    const claimICXRewardsQuery = await SCORECallTransaction({
        _adr: addresses.cftRewards,
        _method: 'claimStakingRewards',
        _from: address,
        _params: {
            _days: '20'
        }
    })

    if (claimICXRewardsQuery.status === 1) {
        console.log('\nClaiming ICX success !')
        const balances = await getBalances()
        console.log(`New ICX balance: ${formatUnits(balances.icx)}`)
        return true
    } else {
        console.log('\nClaiming ICX failed !')
        console.log(claimICXRewardsQuery)
        return false
    }
}