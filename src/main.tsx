import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AptosWalletProvider } from "@razorlabs/wallet-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import "./index.css";
import "@razorlabs/wallet-kit/style.css";
import "./razorlabs-wallet-kit-custom.css";

const queryClient = new QueryClient({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AptosWalletProvider 
      autoConnect={true}
      chains={[
        {
          name: "Movement Testnet",
          id: "1",
          rpcUrl: "/aptos-bardock"
        }
      ]}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AptosWalletProvider>
  </StrictMode>
);