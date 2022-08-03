const SCOREReadOnly = require('../helpers/SCOREReadOnly.js')
const addresses = require('../config/addresses.js')

module.exports = async function getPoolStats() {
    const poolStats = await SCOREReadOnly({
        _adr: addresses.balancedRouter,
        _method: 'tryAggregate',
        _params: {
            calls: [{
                method: 'getPoolStatsForPair',
                target: addresses.balancedRouter,
                params: [addresses.sICX, addresses.CFT]
            }],
            requireSuccess: '0x0'
        }
    })

    return poolStats
}