import { useAptosWallet } from  "@razorlabs/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { aptosClient } from "../services/movement-client";
import { MODULE_ADDRESS } from "../constants";
import { MoveStructId } from "@aptos-labs/ts-sdk";

interface Vote {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  total_yes_votes: string;
  total_no_votes: string;
  completed: boolean;
  voters: string[]; // Add this field to track who has voted
}

export function useVotes() {
  const { account } = useAptosWallet();

  return useQuery({
    queryKey: ["votes", account?.address],
    refetchInterval: 1000 * 60 * 30,
    queryFn: async () => {
      if (!account?.address) {
        return [];
      }

      const resource = await aptosClient.getAccountResource({
        accountAddress: MODULE_ADDRESS,
        resourceType: ("0x" +
          MODULE_ADDRESS +
          "::Staking::VoteRepository") as MoveStructId,
      });
      console.log(resource);

      return resource.votes as Vote[];
    },
  });
}
