const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const startupPath = path.resolve(__dirname, 'contracts','Startup.sol');
const source = fs.readFileSync(startupPath, 'utf8');
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

fs.ensureDirSync(buildPath);

console.log(output);
for(let contract in output){
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
