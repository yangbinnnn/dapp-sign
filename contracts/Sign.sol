pragma solidity ^0.4.24;

// https://kovan.etherscan.io/tx/0x80b51247e6a796c9ddcea6c6e541ad4adc5ce81a7b132fbc30cdea7f626c42f1
contract Sign {
    // step0
    function echo(bytes32 addr) public pure returns (bytes32) {
        return addr;
    }

    // step1
    function encode(bytes32 _msg) public pure returns (bytes) {
        return abi.encodePacked(_msg); 
    }

    // step2
    function hash(bytes32 _msg) public pure returns (bytes32) {
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

    function palce(uint256 a, uint256 b, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        bytes32 _hash = keccak256(abi.encodePacked(a, b));
        return ecrecover(_hash, v, r, s);
    }

    function plus2(uint256 a, uint256 b) public pure returns (bytes) {
        return abi.encodePacked(uint40(a), b);
    }

    function palce2(uint a, uint256 b, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        bytes32 _hash = keccak256(abi.encodePacked(uint40(a), b));
        return ecrecover(_hash, v, r, s);
    }

    function palce3(uint lastBlock, uint commit, bytes32 r, bytes32 s) public pure returns (address) {
        bytes32 _hash = keccak256(abi.encodePacked(uint40(lastBlock), commit));
        return ecrecover(_hash, 27, r, s);
    }

    function isSigned(address _addr, uint256 a, uint256 b, uint8 v, bytes32 r, bytes32 s) public pure returns (bool) {
        return _addr == palce(a, b, v, r, s);
    }

    function plus(uint256 a, uint256 b) public pure returns (bytes) {
        return abi.encodePacked(a, b);
    }

}
