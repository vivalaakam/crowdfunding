import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter"
import "./tasks/seed";
import "./tasks/get-active";
import "./tasks/get-verifying";
import "./tasks/get-item";
import "./tasks/start";

const CROWDFUNDING_CONTRACTS_PRIVATE_KEY = vars.get("CROWDFUNDING_CONTRACTS_PRIVATE_KEY");


const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    gasReporter: {
        currency: "USD",
        gasPrice: 58,
        enabled: true,
    },
    networks: {
        local: {
            url: "http://localhost:8545/",
            accounts: [
                "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            ],
        },
        te2: {
            url: `https://rpc.eth.testedge2.haqq.network/`,
            accounts: [CROWDFUNDING_CONTRACTS_PRIVATE_KEY],
        }
    },
};

export default config;
