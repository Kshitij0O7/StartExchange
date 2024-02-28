import web3 from './web3';
import StartupList from './build/StartupList.json';

const instance = new web3.eth.Contract(
    StartupList.abi,
    "0x723714C6F15DcDC8A12dEd2A9029793b3F2d7c36"
)

export default instance;