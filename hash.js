const contract = require('truffle-contract')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)

const SignArtifact = require('./build/contracts/Sign')
const abi = SignArtifact['abi']
const networkId = '4447'
const contractAddr = SignArtifact['networks'][networkId]['address']
const Sign = new web3.eth.Contract(abi, contractAddr)

// value -> hex value -> bytes32 value

const msg = web3.utils.toHex('123')
console.log(msg)
// step0
Sign.methods.echo(msg).call(function(error, data) {
    console.log('-------echo--------')
    console.log('output: ' + data)
})

let encode_msg = web3.eth.abi.encodeParameter('bytes32', msg)
// step1
Sign.methods.encode(msg).call(function(error, data) {
    console.log('-----encode-------')
    console.log(`input encode ==> ${encode_msg}`)
    console.log(`output encode => ${data}`)
 })

 // step2
let hash = web3.utils.sha3(encode_msg, {encoding: 'hex'})
Sign.methods.hash(encode_msg).call(function(error, data) {
    console.log('-----hash------')
    console.log(`input hash ==> ${hash}`)
    console.log(`output hash => ${data}`)
})

var res = Sign.methods.hash(encode_msg).call()
res.then(data => {
    console.log(`output hash => ${data}`)
})
