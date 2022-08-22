const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledStartupList = require('./build/StartupList.json');
const provider = new HDWalletProvider(
  'present canoe trouble myself rude into receive bronze profit casino bronze gossip',
  'https://polygon-mumbai.g.alchemy.com/v2/LaOZxNXt4zbb1S1259-DwE9n1M6HxpSH'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account ', accounts[0]);

  const result = await new web3.eth.Contract(compiledStartupList.abi)
    .deploy({ data: compiledStartupList.evm.bytecode.object })
    .send({from: accounts[0], gas: '1400000'});

  console.log('Contract deployed to ', result.options.address);

  provider.engine.stop();
};

deploy();
