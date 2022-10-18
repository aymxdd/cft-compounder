const ethers = require('ethers')
const addresses = require('../config/addresses.js')
const getICXBalance = require('../helpers/getICXBalance.js')
const getBalance = require('../helpers/getBalance.js')

module.exports = async function getBalances() {
    const address = process.env.ICON_PUBLIC_KEY

    const balances = {
        icx: ethers.BigNumber.from(0),
        sicx: ethers.BigNumber.from(0),
        cft: ethers.BigNumber.from(0),
        async update() {
            const icx = await getICXBalance(address)
            const sicx = await getBalance({ address: addresses.sICX, owner: address })
            const cft = await getBalance({ address: addresses.CFT, owner: address })

            this.icx = ethers.BigNumber.from(`0x${icx.toString(16)}`)
            this.sicx = ethers.BigNumber.from(sicx)
            this.cft = ethers.BigNumber.from(cft)
        }
    }

    await balances.update()

    return balances
}