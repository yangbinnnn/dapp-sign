/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    pnet: {
      host: "pnet.taoke93.com/rpc",
      port: 80,
      network_id: "1000" ,// Match any network id
      gas: 4600000
    },
    kovan: {
      host: "kovan.infura.io/v3/0d53687fabef4eab916d0e65a44c3db8",
      port: 443,
      network_id: "*",
      gas: 460000
    }
  }
};
