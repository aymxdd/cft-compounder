const ethers = require('ethers')
const SCOREReadOnly = require('../helpers/SCOREReadOnly.js')
const addresses = require('../config/addresses.js')

module.exports = async function getRewards() {
    const address = process.env.ICON_PUBLIC_KEY

    const lpRewards = await SCOREReadOnly({
        _adr: addresses.cftRewards,
        _method: 'queryLpRewards',
        _params: {
            _address: address
        }
    })

    const stakingRewards = await SCOREReadOnly({
        _adr: addresses.cftRewards,
        _method: 'queryStakingRewards',
        _params: {
            _address: address
        }
    })

    const rewards = {
        lpRewards: ethers.BigNumber.from(lpRewards),
        stakingRewards: ethers.BigNumber.from(stakingRewards)
    }

    return rewards
}