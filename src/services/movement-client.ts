import { createSurfClient } from "@thalalabs/surf";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { ABI as StakingABI } from "./Staking.ts";
import { ABI as VotingABI } from "./Voting.ts";
const aptosConfig = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
  indexer: "",
});
const aptosClient = new Aptos(aptosConfig);
const stakingClient = createSurfClient(aptosClient).useABI(StakingABI);
const votingClient = createSurfClient(aptosClient).useABI(VotingABI);

export { stakingClient, votingClient, aptosClient };
