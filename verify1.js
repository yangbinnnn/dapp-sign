// web3 1.0
const Web3 = require('web3')
const Account = require("eth-lib/lib/account")
const Hash = require("eth-lib/lib/hash")
const utils = require('web3-utils')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)
const SignArtifact = require('./build/contracts/Sign')
const abi = SignArtifact['abi']
const networkId = '4447'
const contractAddr = SignArtifact['networks'][networkId]['address']
const Sign = new web3.eth.Contract(abi, contractAddr)

function signWithoutEthPrefix(hash, privateKey) {
    var signature = Account.sign(hash, privateKey)
    var vrs = Account.decodeSignature(signature)
    return {
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    }
}

const addr= '0x627306090abab3a6e1400e9345bc60c78a8bef57'
const prikey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
var a = '8535772'
var b = '25011601220659508610554516358477837845627677074279442347256125435844690251099'
msg = web3.eth.abi.encodeParameters(['uint40', 'uint256'], [a, b])

// ok
Sign.methods.plus2(
    a,
    b
).call(function(error, data) {
    console.log(`a ----------> ${a}`)
    console.log(`b ----------> ${b}`)
    console.log(`plus2 a,b ---> ${data}`)
    console.log(`add a,b ----> ${msg}`)
})

var hash = web3.utils.soliditySha3({t: 'uint40', v: a}, b)
var signature = signWithoutEthPrefix(hash, prikey)
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

Sign.methods.palce2(
        a,
        b,
        v_decimal,
        signature.r,
        signature.s
    ).call(function(error, data) {
    console.log('-----data uint40------')
    console.log(`input addr ==> ${addr}`)
    console.log(`output addr => ${data}`)
})

// console.log('zzz: ' + web3.eth.abi.encodeParameter('uint40', a))
// console.log('ooo: ' + web3.eth.abi.decodeParameter('uint40', web3.eth.abi.encodeParameter('uint40', a)))
// console.log('yyy: ' + web3.eth.abi.encodeParameters(['uint40', 'uint256'], [a, b]))
// console.log('xxx: ' + web3.eth.abi.decodeParameter('uint40', '0x000000000000000000000000000000000b67e3f2117cf9e3677435b5decfd606'))
// let hex = '0x000000000000000000000000000000000b67e3f2117cf9e3677435b5decfd606'
// let result = '0x' + Buffer.from(hex.substring(2), 'hex').slice(-5).toString('hex')
// console.log(result)
// result = uint256to40('15160937815670851261551314246831166982')
// console.log(result)
// console.log(web3.utils.fromDecimal(result))