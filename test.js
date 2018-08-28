let elliptic = require('elliptic');
let sha3 = require('js-sha3');
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
const web3 = new Web3(provider)
let ec = new elliptic.ec('secp256k1');

let privKey = 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
let pubKey = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
console.log(`Private key: ${privKey}`);
console.log("Public key :", pubKey.substr(2));

let msg = 'Message for signing';
let msgHash = sha3.keccak256(msg);
let signature = ec.sign(msgHash, privKey, "hex", {canonical: true});
console.log(`Msg: ${msg}`);
console.log('web3 hash: ' + web3.sha3(msg))
console.log(`Msg hash: ${msgHash}`);
console.log("Signature:", signature);

console.log();

let hexToDecimal = (x) => ec.keyFromPrivate(x, "hex").getPrivate().toString(10);
let pubKeyRecovered = ec.recoverPubKey(
    hexToDecimal(msgHash), signature, signature.recoveryParam, "hex");
console.log("Recovered pubKey:", pubKeyRecovered.encodeCompressed("hex"));

let validSig = ec.verify(msgHash, signature, pubKeyRecovered);
console.log("Signature valid?", validSig);
