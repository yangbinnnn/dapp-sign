const contract = require('truffle-contract')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)

const SignArtifact = require('./build/contracts/Sign')
const abi = SignArtifact['abi']
const networkId = '4447'
const contractAddr = SignArtifact['networks'][networkId]['address']
const Sign = new web3.eth.Contract(abi, contractAddr)

function splitSign(sign) {
    sign = sign.startsWith('0x')? sign.substr(2): sign;
    const r = '0x' + sign.slice(0, 64)
    const s = '0x' + sign.slice(64, 128)
    const v = '0x' + sign.slice(128, 130)
    var v_decimal = web3.utils.toDecimal(v)
    if (v_decimal != 27 && v_decimal != 28) {
        v_decimal += 27
    }

    return {r, s, v, v_decimal}
}

const addr = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
const msg = '123'
var hex_msg = web3.utils.padLeft(web3.utils.toHex(msg), 64)

async function simulator() {
    web3.eth.sign(hex_msg, addr).then(data => {
    signature = data
    console.log(signature)
    var {r, s, v, v_decimal} = splitSign(signature)
    console.log(`address -----> ${addr}`)
    console.log(`msg ---------> ${msg}`)
    console.log(`hex(msg) ----> ${hex_msg}`)
    console.log(`sig ---------> ${signature}`)
    console.log(`s -----------> ${s}`)
    console.log(`v -----------> ${v}`)
    console.log(`vd ----------> ${v_decimal}`)

    var signMsg = "\x19Ethereum Signed Message:\n32" + hex_msg
    console.log("signMsg: " + signMsg)
    var signMsgHash = web3.utils.sha3(signMsg)
    Sign.methods.recoverAddrFromHash(
            signMsgHash,
            v_decimal,
            r,
            s
    ).call(function(error, data) {
        console.log('-----data from hash------')
        console.log('input hash ==>' + signMsgHash)
        console.log(`input addr ==> ${addr}`)
        console.log(`output addr => ${data}`)
    })
    }).catch(err => {
        console.log(err)
    })
}

simulator()
// signature = msg + addr
// addr = msg + signature
