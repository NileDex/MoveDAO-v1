import { useAptosWallet } from  "@razorlabs/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { stakingClient } from "../services/movement-client";

export function useStake() {
  const { account } = useAptosWallet();

  return useQuery({
    queryKey: ["stake", account?.address],
    refetchInterval: 1000 * 60 * 30,
    queryFn: async () => {
      if (!account?.address) {
        return 0;
      }
      try {
        const response = await stakingClient.view.get_staked_balance({
          typeArguments: [],
          functionArguments: [account?.address as `0x${string}`],
        });

        const result = parseInt(response[0]);
        // return the correct value at the return value has no decimals
        return result / Math.pow(10, 8);
      } catch (error) {
        console.error(error);
        return 0;
      }
    },
  });
}