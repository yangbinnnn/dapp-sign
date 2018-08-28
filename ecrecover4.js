// not working now

const contract = require('truffle-contract')
const Web3 = require('web3')
const Account = require("eth-lib/lib/account")
const Hash = require("eth-lib/lib/hash")
const utils = require('web3-utils')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)

const SignArtifact = require('./build/contracts/Sign')
const abi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "_msgHash",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "recoverAddrFromHash",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_msg",
				"type": "uint256"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "recoverAddr",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_msg",
				"type": "bytes"
			}
		],
		"name": "hashBytes",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_msgHash",
				"type": "string"
			}
		],
		"name": "getPrefix",
		"outputs": [
			{
				"name": "",
				"type": "bytes"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_msg",
				"type": "uint256"
			}
		],
		"name": "hash",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "bytes32"
			}
		],
		"name": "echo",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_msg",
				"type": "uint256"
			}
		],
		"name": "encode",
		"outputs": [
			{
				"name": "",
				"type": "bytes"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_msgHash",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "recoverAddrByPrefix",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	}
]
const Sign = new web3.eth.Contract(abi, '0xbbe595df857805ab3734f15be990f9a30cbb89f3')

function hashMessage(data) {
    var message = utils.isHexStrict(data) ? utils.hexToBytes(data) : data;
    var ethMessage = Buffer.from(message);
    return Hash.keccak256s(ethMessage);
}

function signWithoutPrefix(data, privateKey) {
    var hash = hashMessage(data);
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
var signature = signWithoutPrefix(msg, prikey)
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

var data = Sign.methods.recoverAddr(
        msg,
        v_decimal,
        signature.r,
        signature.s
    ).call(function(error, data) {
    console.log('-----data from hash------')
    console.log(`input addr ==> ${addr}`)
    console.log(`output addr => ${data}`)
})
// signature = msg + addr
// addr = msg + signature
