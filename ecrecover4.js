// not working now

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
    if (v_decimal != 27 && v_decimal != 28) {
        v_decimal += 27
    }
    return {r, s, v, v_decimal}
}

const addr = web3.eth.accounts[0]
const msg = '123'
var hex_msg = web3.sha3(web3.fromAscii(msg))
var signature = web3.eth.accounts.sign(hex_msg, 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3')

console.log(`address -----> ${addr}`)
console.log(`msg ---------> ${msg}`)
console.log(`hex(msg) ----> ${hex_msg}`)
console.log(`sig ---------> ${signature}`)

var {r, s, v, v_decimal} = splitSign(signature)

console.log(`r -----------> ${r}`)
console.log(`s -----------> ${s}`)
console.log(`v -----------> ${v}`)
console.log(`vd ----------> ${v_decimal}`)
console.log("-------------------------------------------")

// var signMsg = "\x19Ethereum Signed Message:\n" + hex_msg.toString().substr(2).length + hex_msg.toString().substr(2)
// console.log("signMsg: " + signMsg)
// var signMsgHash = web3.sha3(signMsg)
// var inputMsg = web3.fromAscii(signMsg)
Sign.deployed().then(instance => {
    return instance.recoverAddr.call(
        hex_msg,
        v_decimal,
        r,
        s
    )
}).then(data => {
    console.log('-----data from hash------')
    console.log(`input msg ==> ${inputMsg}`)
    console.log(`input addr ==> ${addr}`)
    console.log(`output addr => ${data}`)
}).catch(e => {
    console.log('i got an error')
    console.log(e)
})
// signature = msg + addr
// addr = msg + signature
