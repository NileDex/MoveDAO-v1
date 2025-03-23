import { createSurfClient } from "@thalalabs/surf";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { ABI as StakingABI } from "./Staking.ts";
import { ABI as VotingABI } from "./Voting.ts";
import {DaoABI as DaoABI } from "./dao.ts"; // Added this import
const aptosConfig = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
  indexer: "",
});
const aptosClient = new Aptos(aptosConfig);
const stakingClient = createSurfClient(aptosClient).useABI(StakingABI);
const votingClient = createSurfClient(aptosClient).useABI(VotingABI);
const daoClient = createSurfClient(aptosClient).useABI(DaoABI); // Added this line

export { stakingClient, votingClient, daoClient,  aptosClient };
