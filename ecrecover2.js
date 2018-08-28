const contract = require('truffle-contract')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')

const web3 = new Web3(provider)

const SignArtifact = require('./build/contracts/Sign')
const Sign = contract(SignArtifact)
Sign.setProvider(provider)

function splitSign(sign) {
    sign = sign.startsWith('0x')? sign.substr(2): sign;
    const r = '0x' + sign.slice(0, 64)
    const s = '0x' + sign.slice(64, 128)
    const v = '0x' + sign.slice(128, 130)
    var v_decimal = web3.toDecimal(v)
    if(v_decimal != 27 && v_decimal != 28) {
        v_decimal += 27
    }
    return {r, s, v, v_decimal}
}

const addr = web3.eth.accounts[0]
const msg = '123'
var msg_hash = web3.sha3(msg)
var signature = web3.eth.sign(addr, msg_hash)

console.log(`address -----> ${addr}`)
console.log(`msg ---------> ${msg}`)
console.log(`hex(msg) ----> ${msg_hash}`)
console.log(`sig ---------> ${signature}`)

var {r, s, v, v_decimal} = splitSign(signature)

console.log(`r -----------> ${r}`)
console.log(`s -----------> ${s}`)
console.log(`v -----------> ${v}`)
console.log(`vd ----------> ${v_decimal}`)
console.log("-------------------------------------------")

Sign.deployed().then(instance => {
    return instance.recoverAddrByPrefix.call(
        msg_hash,
        v_decimal,
        r,
        s
    )
}).then(data => {
    console.log('-----data------')
    console.log(`input addr ==> ${addr}`)
    console.log(`output addr => ${data}`)
}).catch(e => {
    console.log('i got an error')
    console.log(e)
})

Sign.deployed().then(instance => {
    return instance.echo.call(
        msg_hash
    )
}).then(data => {
    console.log(`echo output: ${data}`)
})

// signature = msg_hash + addr
// addr = msg_hash + signature
