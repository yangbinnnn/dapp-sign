const Web3 = require('web3')
const Account = require("eth-lib/lib/account")
const Hash = require("eth-lib/lib/hash")
const utils = require('web3-utils')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)
const SignInfo = require('./build/contracts/Sign')
const abi = SignInfo['abi']
const contractAddr = SignInfo['networks']['4447']['address']
const Sign = new web3.eth.Contract(abi, contractAddr)

function signWithoutEthPrefix(data, privateKey) {
    var message = utils.isHexStrict(data) ? utils.hexToBytes(data) : data;
    var ethMessage = Buffer.from(message);
    var hash = Hash.keccak256s(ethMessage);
    var signature = Account.sign(hash, privateKey);
    var vrs = Account.decodeSignature(signature);
    return {
        message: data,
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    }
}

const addr = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
const prikey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
var msg = '123'
msg = web3.utils.padLeft(web3.utils.numberToHex(msg), 64)
var signature = signWithoutEthPrefix(msg, prikey)
var v_decimal = web3.utils.toDecimal(signature.v)
if (v_decimal != 27 && v_decimal != 28) {
    v_decimal += 27
}
console.log(`address -----> ${addr}`)
console.log(`msg ---------> ${msg}`)
console.log(`sig ---------> ${signature.signature}`)
console.log(`r -----------> ${signature.r}`)
console.log(`s -----------> ${signature.s}`)
console.log(`v -----------> ${signature.v}`)
console.log(`vd ----------> ${v_decimal}`)

var commit = web3.eth.accounts.sign(msg, prikey)
var reveal = web3.eth.accounts.recover(msg, commit.signature)
console.log(`reveal ------> ${reveal}`)

Sign.methods.recoverAddr(
        msg,
        v_decimal,
        signature.r,
        signature.s
    ).call(function(error, data) {
    console.log('-----data from hash------')
    console.log(`input addr ==> ${addr}`)
    console.log(`output addr => ${data}`)
})

// msg is in 32bytes
// signature = msg + addr
// addr = msg + signature
