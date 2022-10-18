const { IconValidator } = require('icon-sdk-js').default
const { BigNumber } = require('ethers')
const { formatUnits } = require('ethers/lib/utils.js')
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
            console.log(`ICX balance: ${formatUnits(balances.icx)}`)
            console.log(`sICX balance: ${formatUnits(balances.sicx)}`)
            console.log(`CFT balance: ${formatUnits(balances.cft)}`)

            if (balances.icx.lte(BigNumber.from(0))) {
                console.log('Not enough ICX. Stopping now.')
                return false
            }

            if (balances.sicx.lte(BigNumber.from(0))) {
                console.log('Not enough sICX. Stopping now.')
                return false
            }

            const rewards = await getRewards()
            
            console.log('\n=============REWARDS=============\n')
            console.log(`LP rewards: ${formatUnits(rewards.lpRewards)} CFT`)
            console.log(`Staking rewards: ${formatUnits(rewards.stakingRewards)} ICX`)
            console.log('\n=============ACTIONS=============\n')

            if (rewards.lpRewards.lte(BigNumber.from(0))) {
                console.log('No LP rewards. Stopping now.')
                return false
            } else {
                console.log('LP rewards found. Continuing.')

                if (rewards.stakingRewards.gt(BigNumber.from(0))) {
                    const claimICXRewardsQuery = await claimICXRewards()
                    if (!claimICXRewardsQuery) return false
                }

                if (rewards.lpRewards.gt(BigNumber.from(0))) {
                    const claimCFTRewardsQuery = await claimCFTRewards()
                    if (!claimCFTRewardsQuery) return false
                }

                await balances.update()

                const poolStats = await getPoolStats()
                const sICXCost = BigNumber.from(parseInt(formatUnits(BigNumber.from(poolStats.returnData[0].returnData.price).mul(balances.cft))).toString())

                console.log(sICXCost)

                if (sICXCost.gt(balances.sicx)) {
                    console.log('Not enough sICX. Stopping now.')
                    return false
                } else {
                    console.log('Enough sICX and CFT. Proceeding.\n')

                    const transferCFTToBalancedQuery = await transferCFTToBalanced()
                    if (!transferCFTToBalancedQuery) return false
    
                    const transferSICXToBalancedQuery = await transferSICXToBalanced(sICXCost)
                    if (!transferSICXToBalancedQuery) return false

                    const mintLpTokenQuery = await mintLpToken(balances, sICXCost)
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