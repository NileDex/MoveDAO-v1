import { FaWallet } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import "@razorlabs/wallet-kit/style.css";
import { AptosConnectButton } from "@razorlabs/wallet-kit";
import { useAptosWallet } from "@razorlabs/wallet-kit";
import { useStake } from "./useStake";
import { useRef, useState } from "react";
import { createEntryPayload } from "@thalalabs/surf";
import { ABI as StakingABI } from "../services/Staking.ts";
import Modal from "./Modal";

const Votedata = () => {
  const { data: stake, refetch: refetchStake } = useStake();
  const { account, signAndSubmitTransaction } = useAptosWallet();
  const amountRef = useRef<HTMLInputElement>(null);

  // State for controlling modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"info" | "success" | "error">("info");
  const [modalTitle, setModalTitle] = useState("Transaction Submitted");
  const [modalStep, setModalStep] = useState<"details" | "confirm" | "loading">("confirm");
  const [transactionUrl, setTransactionUrl] = useState("");

  const openModal = (
    message: string,
    type: "info" | "success" | "error" = "info",
    title = "Transaction Submitted",
    step: "details" | "confirm" | "loading" = "confirm",
    txUrl = ""
  ) => {
    setModalMessage(message);
    setModalType(type);
    setModalTitle(title);
    setModalStep(step);
    setTransactionUrl(txUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function handleTransaction(
    action: "stake" | "unstake",
    successMessage: string
  ) {
    try {
      const amount = parseFloat(amountRef.current?.value || "0");
      
      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        openModal("Please enter a valid amount greater than 0", "error", "Invalid Amount", "details");
        return;
      }

      // Additional validation for unstake
      if (action === "unstake") {
        const currentStake = typeof stake === 'number' ? stake : 0;
        if (amount > currentStake) {
          openModal("Cannot unstake more than your staked amount", "error", "Invalid Amount", "details");
          return;
        }
      }

      // Convert to atomic units (8 decimals)
      const amountInAtomicUnits = Math.floor(amount * Math.pow(10, 8)).toString();
      console.log(`${action} amount (atomic units):`, amountInAtomicUnits);

      // Create transaction payload
      const payload = createEntryPayload(StakingABI, {
        function: action,
        typeArguments: [],
        functionArguments: [amountInAtomicUnits],
      });

      console.log("Transaction payload:", payload);

      openModal("Please confirm this transaction in your wallet...", "info", "Transaction In Progress", "loading");
      
      // Submit transaction
      const response = await signAndSubmitTransaction({ payload });
      console.log("Transaction response:", response);

      if (!response || 'error' in response) {
        throw new Error("Transaction failed - no hash returned");
      }

      const txUrl = `https://explorer.aptoslabs.com/txn/${(response as unknown as { hash: string }).hash}`;
      console.log("Transaction URL:", txUrl);
      
      openModal(
        successMessage.replace("{amount}", amount.toString()),
        "success",
        "Transaction Submitted",
        "confirm",
        txUrl
      );

      // Wait for chain to update then refetch
      setTimeout(() => {
        refetchStake();
      }, 5000); // Increased delay for chain propagation

    } catch (error: any) {
      console.error(`${action} error:`, error);
      
      let errorMessage = `${action} failed: ${error.message || "Unknown error"}`;
      let errorType: "error" = "error";
      
      if (error.message?.includes("rejected")) {
        errorMessage = "Transaction was rejected by user";
      } else if (error.message?.includes("insufficient")) {
        errorMessage = action === "stake" 
          ? "Insufficient balance to complete transaction" 
          : "You don't have enough staked tokens";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Transaction timed out. Please try again";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection";
      } else if (error.message?.includes("BigInt")) {
        errorMessage = "Invalid amount format. Please enter a valid number";
      }

      openModal(errorMessage, errorType, "Transaction Failed", "details");
    }
  }

  async function stakeMove() {
    await handleTransaction(
      "stake",
      "{amount} MOVE tokens successfully staked as collateral"
    );
  }

  async function unstakeMove() {
    await handleTransaction(
      "unstake",
      "{amount} MOVE tokens successfully unstaked"
    );
  }

  return (
    <>
      <div className="vdata-container">
        <div className="vdata-info-one">
          <div className="vote-power">
            <p>Staked: {stake !== undefined ? stake : 0}</p>
            <span>
              <ImPower />
            </span>
          </div>
          <h3>
            Lock MOVE tokens to receive your voting power.{" "}
            <a href="https://movedao-1.gitbook.io/movedao/">Learn more</a>
          </h3>
        </div>

        <div className="vdata-info">
          <div className="vdata-wallet-action">
            <p>Amount</p>
            <div className="vdata-wallet-action-flex">
              <p>
                <FaWallet />
                MOVE
              </p>
            </div>
          </div>
          <h3>
            Connect your wallet below to lock MOVE and vote on Proposals & LFG!
          </h3>
          <input 
            className="inputfield" 
            placeholder="MOVE" 
            ref={amountRef}
            type="number"
            min="0"
            step="0.00000001"
          />
          
          {!account?.address ? (
            <AptosConnectButton
              className="whit"
              style={{
                margin: "0",
                width: "100%",
                maxWidth: "400px",
                padding: "10px 5px",
                background: 'linear-gradient(45deg, #ffc30d, #b80af7)',
                borderRadius: "13px",
                fontSize: "15px",
                fontWeight: "bold",
                boxSizing: "border-box",
                border: 'none',
              }}
            />
          ) : (
            <>
              <button
                type="button"
                className="action-button"
                onClick={stakeMove}
              >
                Stake
              </button>
              <button
                type="button"
                className="action-button"
                onClick={unstakeMove}
                style={{ marginTop: "15px" }}
              >
                Unstake
              </button>
            </>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        type={modalType}
        title={modalTitle}
        step={modalStep}
        showActionButtons={true}
        onViewTransaction={transactionUrl ? () => window.open(transactionUrl, '_blank') : undefined}
      >
        {modalMessage}
      </Modal>

      <style>
        {`
          .action-button {
            margin: 0;
            width: 100%;
            max-width: 400px;
            padding: 10px 5px;
            background: linear-gradient(45deg, #ffc30d, #b80af7);
            border-radius: 13px;
            font-size: 15px;
            font-weight: bold;
            box-sizing: border-box;
            border: none;
            color: white;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          
          .action-button:hover {
            opacity: 0.9;
          }
          
          .action-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .inputfield {
            width: 100%;
            max-width: 400px;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ccc;
            margin: 10px 0;
            font-size: 16px;
          }
        `}
      </style>
    </>
  );
};

export default Votedata;