const { IconBuilder } = require('icon-sdk-js').default
const getService = require('./getService.js')
const service = getService()

module.exports = function SCORECallReadOnly({ _adr, _method, _params }) {
    return new Promise((resolve, reject) => {
        try {
            let tx = new IconBuilder.CallBuilder()
                .to(_adr)
                .method(_method)

            if (_params) tx = tx.params(_params)

            resolve(service.call(tx.build()).execute())
        } catch (err) {
            reject(err)
        }
    })
}