pragma solidity ^0.4.24;

// https://kovan.etherscan.io/tx/0x80b51247e6a796c9ddcea6c6e541ad4adc5ce81a7b132fbc30cdea7f626c42f1
contract Sign {
    // step0
    function echo(bytes32 addr) public pure returns (bytes32) {
        return addr;
    }

    // step1
    function encode(uint256 _msg) public pure returns (bytes) {
        return abi.encodePacked(_msg); 
    }

    // step2
    function hash(uint256 _msg) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_msg));
    }

    // step2.1
    function hashBytes(bytes _msg) public pure returns (bytes32) {
        return keccak256(_msg);
    }
    
    // step3.1
    function recoverAddr(uint256 _msg, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        bytes32 _msgHash = keccak256(abi.encodePacked(_msg));
        return ecrecover(_msgHash, v, r, s);
    }

    // step3.2
    function recoverAddrFromHash(bytes32 _msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        return ecrecover(_msgHash, v, r, s);
    }

    // step3.3
    function recoverAddrByPrefix(bytes32 _msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 preHash = keccak256(abi.encodePacked(prefix, _msgHash));
        return ecrecover(preHash, v, r, s);
    }

    function getPrefix(string _msgHash) public pure returns (bytes) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return abi.encodePacked(prefix, _msgHash);
    }
}
