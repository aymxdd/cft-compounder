const { IconValidator, IconWallet } = require('icon-sdk-js').default

module.exports = function getWallet() {
    const publicKey = process.env.ICON_PUBLIC_KEY
    const privateKey = process.env.ICON_PRIVATE_KEY

    if (IconValidator.isAddress(publicKey) && IconValidator.isPrivateKey(privateKey)) {
        const wallet = IconWallet.loadPrivateKey(privateKey)
        return wallet
    } else {
        throw new Error('No valid public key or private key set in enviroment variables')
    }
}