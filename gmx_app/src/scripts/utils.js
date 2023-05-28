import Web3 from "web3";
import ManagerAbi from "../interfaces/ManagerAbi";
import { zeroAddress } from "viem";

const HttpProviderAvalanche = "https://api.avax.network/ext/bc/C/rpc";
const web3 = new Web3(new Web3.providers.HttpProvider(HttpProviderAvalanche));

// Avalanche 
const decimals = 10**6;
const MANAGER = "0x9CD3e68Db82cE54D240Aad37760a1396600ebe0B";

const createUserAccount = async (user) => {
    const calldata = await web3.eth.abi.encodeFunctionCall({
        "inputs": [],
		"name": "createNewUserAccount",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
    }, []);
    const transaction = {
        'from': user,
        'to': MANAGER,
        'value': "0x00",
        'data': calldata
    }
    await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transaction],
    }).then((result) => {console.log(result)}).catch((error) => {console.log(error)}); 
}

const getUserAccount = async (user) => {
    if (user) {
        const manager = await new web3.eth.Contract(
            ManagerAbi,
            MANAGER
        );
        return await manager.methods.userAccounts(user).call();
    }
}

const approve = async (user, token, amount) => {
    const userAccount = await getUserAccount(user);
    if (userAccount != zeroAddress && amount > 0) {
        const calldata = await web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [userAccount, amount * decimals]);
        const transaction = {
            'from': user,
            'to': token,
            'value': "0x00",
            'data': calldata
        }
        await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transaction],
        }).then((result) => {console.log(result)}).catch((error) => {console.log(error)});
    }
    else alert("You don't have an account or amount to approve is zero");
}

export default { createUserAccount, getUserAccount, approve };