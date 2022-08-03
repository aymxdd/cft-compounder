const { HttpProvider } = require('icon-sdk-js').default

module.exports = function getNetworkConfig() {
    const network = process.env.ICON_NETWORK

    const networkConfig = {
        nid: null,
        url: null,
        tracker: null,
        provider: null
    }

    switch (networl) {
        case 'testnet':
            networkConfig.nid = '83'
            networkConfig.url = 'https://sejong.net.solidwallet.io/'
            networkConfig.tracker = 'https://sejong.tracker.solidwallet.io/'
            networkConfig.provider = new HttpProvider(`${networkConfig.url}api/v3`)
            break;
        case 'mainnet':
            networkConfig.nid = '1'
            networkConfig.url = 'https://ctz.solidwallet.io/'
            networkConfig.tracker = 'https://tracker.icon.foundation/'
            networkConfig.provider = new HttpProvider(`${networkConfig.url}api/v3`)
        default:
            networkConfig.nid = '1'
            networkConfig.url = 'https://ctz.solidwallet.io/'
            networkConfig.tracker = 'https://tracker.icon.foundation/'
            networkConfig.provider = new HttpProvider(`${networkConfig.url}api/v3`)
            break;
    }

    return { ...networkConfig, network }
}
