import web3 from './web3';
import Startup from './build/Startup.json';

const StartupInstance = (address) => {
    return new web3.eth.Contract(
        Startup.abi,
        address
    );
}

export default StartupInstance;