const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledStartupList = require('../ethereum/build/StartupList.json');
const compiledStartup = require('../ethereum/build/Startup.json');

let accounts;
let startupList;
let startupAddress;
let startup;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  startupList = await new web3.eth.Contract(compiledStartupList.abi)
    .deploy({ data: compiledStartupList.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1400000" });

  await startupList.methods.addMyStartup("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [startupAddress] = await startupList.methods.getStartupList().call();
  startup = await new web3.eth.Contract(compiledStartup.abi, startupAddress);
});

describe("Startup", () => {
  it("deploys a list and a startup", () => {
    assert.ok(startupList.options.address);
    assert.ok(startup.options.address);
  });

  it("marks caller as the startup owner", async () => {
    const manager = await startup.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to invest money and marks them as investors", async () => {
    await startup.methods.invest().send({
      value: "200",
      from: accounts[1],
    });
    const isInvestor = await startup.methods.investors(accounts[1]).call();
    assert(isInvestor);
  });

  it("requires a minimum investment", async () => {
    try {
      await startup.methods.invest().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await startup.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await startup.methods.requests(0).call();

    assert.equal("Buy batteries", request.description);
  });

  it("processes requests", async () => {
    await startup.methods.invest().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await startup.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await startup.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await startup.methods.finaliseRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
