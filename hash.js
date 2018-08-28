const contract = require('truffle-contract')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)

const SignArtifact = require('./build/contracts/Sign')
const Sign = contract(SignArtifact)
Sign.setProvider(provider)

function padHex(n) {
    z = 0;
    width = 64;
    n = n.startsWith('0x')? n.substr(2) : n;
    n = n + '';
    _n = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    return '0x' + _n;
}

const msg = '123'
let hex_msg = padHex(web3.toHex(msg))
let hash = web3.sha3(hex_msg, {encoding: 'hex'})
// step0
Sign.deployed().then(instance => {
    return instance.echo.call(
        msg
    )
}).then(data => {
    console.log('-------echo--------')
    console.log('output: ' + data)
})

// step1
Sign.deployed().then(instance => {
    return instance.encode.call(
        msg
    )
 }).then(data => {
    console.log('-----encode-------')
    console.log(`input encode => ${hex_msg}`)
    console.log(`output encode => ${data}`)
 })

 // step2
Sign.deployed().then(instance => {
    return instance.hash.call(
        msg
    )
}).then(data => {
    console.log('-----data------')
    console.log(`input hash => ${hash}`)
    console.log(`output hash => ${data}`)
}).catch(e => {
    console.log('i got an error')
    console.log(e)
})
