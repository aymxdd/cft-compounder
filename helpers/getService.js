const IconService = require('icon-sdk-js').default
const getNetworkConfig = require('./getNetworkConfig.js')

module.exports = function getService() {
    const { provider } = getNetworkConfig()
    return new IconService(provider)
}