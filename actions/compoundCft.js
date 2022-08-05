const { IconValidator } = require('icon-sdk-js').default
const getBalances = require('../hooks/getBalances.js')
const getRewards = require('../hooks/getRewards.js')
const getPoolStats = require('../hooks/getPoolStats.js')
const claimCFTRewards = require('../hooks/claimCFTRewards.js')
const claimICXRewards = require('../hooks/claimICXRewards.js')
const transferCFTToBalanced = require('../hooks/transferCFTToBalanced.js')
const transferSICXToBalanced = require('../hooks/transferSICXToBalanced.js')
const depositLpToCraft = require('../hooks/depositLpToCraft.js')
const mintLpToken = require('../hooks/mintLpToken.js')

const action = {
    name: 'compound-cft',
    label: 'Claim and compound CFT with CFT/sICX pair on balanced',
    execute: async () => {
        try {
            const address = process.env.ICON_PUBLIC_KEY
            
            if (!IconValidator.isAddress(address)) {
                throw new Error('Error: ICON_PUBLIC_KEY env variable is not a valid ICON public key')
            }

            const balances = await getBalances()

            console.log('=============BALANCES=============\n')
            console.log(`ICX balance: ${balances.icx.formatted}`)
            console.log(`sICX balance: ${balances.sicx.formatted}`)
            console.log(`CFT balance: ${balances.cft.formatted}`)

            if (balances.icx.raw <= 0) {
                console.log('Not enough ICX. Stopping now.')
                return false
            }

            if (balances.sicx.raw <= 0) {
                console.log('Not enough sICX. Stopping now.')
                return false
            }

            const rewards = await getRewards()
            
            console.log('\n=============REWARDS=============\n')
            console.log(`LP rewards: ${rewards.lpRewards.formatted} CFT`)
            console.log(`Staking rewards: ${rewards.stakingRewards.formatted} ICX`)
            console.log('\n=============ACTIONS=============\n')

            if (rewards.lpRewards.raw <= 0) {
                console.log('No LP rewards. Stopping now.')
                return false
            } else {
                console.log('LP rewards found. Continuing.')

                if (rewards.stakingRewards.raw > 0) {
                    const claimICXRewardsQuery = await claimICXRewards()
                    if (!claimICXRewardsQuery) return false
                }

                if (rewards.lpRewards.raw > 0) {
                    const claimCFTRewardsQuery = await claimCFTRewards()
                    if (!claimCFTRewardsQuery) return false
                }

                await balances.update()

                const poolStats = await getPoolStats()
                const sICXCost = poolStats.returnData[0].returnData.price * balances.cft.raw

                if (sICXCost > balances.sicx.raw) {
                    console.log('Not enough sICX. Stopping now.')
                    return false
                } else if (balances.cft.raw <= 0) {
                    console.log('Not enough CFT. Stopping now.')
                    return false
                } else {
                    console.log('Enough sICX and CFT. Proceeding.\n')
                    
                    const transferCFTToBalancedQuery = await transferCFTToBalanced()
                    if (!transferCFTToBalancedQuery) return false
    
                    const transferSICXToBalancedQuery = await transferSICXToBalanced(poolStats)
                    if (!transferSICXToBalancedQuery) return false

                    const mintLpTokenQuery = await mintLpToken(poolStats)
                    if (!mintLpTokenQuery) return false

                    const depositLpToCraftQuery = await depositLpToCraft()
                    if (!depositLpToCraftQuery) return false

                    console.log('\n=============COMPOUND DONE ! :)=============\n')
                    return true
                }
            }
        } catch (err) {
            return err
        }
    }
}

module.exports = action