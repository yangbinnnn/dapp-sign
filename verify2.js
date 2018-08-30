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
    var vd = web3.utils.toDecimal(vrs[0])
    if (vd != 27 && vd != 28) {
        vd += 27
    }
    return {
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature,
        vd: vd
    }
}

const addr= '0x627306090abab3a6e1400e9345bc60c78a8bef57'
const prikey = '0F7CE88B341854B46FB11EC7087D8A8CC3917A3CB56D37FCA55B893B24D57CC4'
var lastBlock = '8535772'
var commit = '25011601220659508610554516358477837845627677074279442347256125435844690251099'
var hash = web3.utils.soliditySha3({t: 'uint40', v: lastBlock}, {t: 'uint': v: commit})
var signature = signWithoutEthPrefix(hash, prikey)
console.log(`address -----> ${addr}`)
console.log(`sig ---------> ${signature.signature}`)
console.log(`r -----------> ${signature.r}`)
console.log(`s -----------> ${signature.s}`)
console.log(`v -----------> ${signature.v}`)
console.log(`vd ----------> ${signature.vd}`)

Sign.methods.palce3(
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