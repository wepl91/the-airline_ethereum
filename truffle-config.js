module.exports = {
  networks: {
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    }
  },
  compilers: {
    solc: {
      version: '0.7.0',
    }
 }
}