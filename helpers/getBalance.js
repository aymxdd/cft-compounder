const SCOREReadOnly = require('./SCOREReadOnly.js')

module.exports = async function getBalance({ address, owner }) {
    try {
        const res = await SCOREReadOnly({
            _adr: address,
            _method: 'balanceOf',
            _params: {
                _owner: owner
            }
        })
    
        return res
    } catch (err) {
        return err
    }
}