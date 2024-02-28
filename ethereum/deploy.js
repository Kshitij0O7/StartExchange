const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledStartupList = require('./build/StartupList.json');
let provider;
try{
  provider = new HDWalletProvider(
  'decline impact cannon tape entry lens maid coast dream symbol wine dose',
  'https://eth-sepolia.g.alchemy.com/v2/qsmBqL-17wbolk3wYM-Lw4QkMhZzinqb'
);
}catch(error){
  console.log(error);
}
let web3;
try {
  web3 = new Web3(provider);
} catch (error) {
  console.log(error);
}

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account ', accounts[2]);

  try {
    const result = await new web3.eth.Contract(compiledStartupList.abi)
      .deploy({ data: compiledStartupList.evm.bytecode.object })
      .send({from: accounts[2], gas: '1400000'});    

    console.log('Contract deployed to ', result.options.address);
    
  } catch (error) {
    console.log(error)
  }

  provider.engine.stop();
};

deploy();
