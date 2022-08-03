const addresses = require('../config/addresses.js')
const getICXBalance = require('../helpers/getICXBalance.js')
const getBalance = require('../helpers/getBalance.js')

module.exports = async function getBalances() {
    const address = process.env.ICON_PUBLIC_KEY

    const balances = {
        icx: { raw: '', formatted: 0 },
        sicx: { raw: '', formatted: 0 },
        cft: { raw: '', formatted: 0 },
        async update() {
            const icx = await getICXBalance(address)
            const sicx = await getBalance({ address: addresses.sICX, owner: address })
            const cft = await getBalance({ address: addresses.CFT, owner: address })

            this.icx = { raw: `0x${icx.toString(16)}`, formatted: parseInt(icx, 10) * 10 ** -18 }
            this.sicx = { raw: sicx, formatted: parseInt(sicx, 16) * 10 ** -18 }
            this.cft = { raw: cft, formatted: parseInt(cft, 16) * 10 ** -18 }
        }
    }

    await balances.update()

    return balances
}