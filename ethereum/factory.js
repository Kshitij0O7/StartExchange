import web3 from './web3';
import StartupList from './build/StartupList.json';

const instance = new web3.eth.Contract(
    StartupList.abi,
    "0x6Fda178606B19b6C5BC9d268C1E1D78a344B6C0e"
)

export default instance;