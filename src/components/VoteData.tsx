import { FaWallet } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import "@razorlabs/wallet-kit/style.css";
import { AptosConnectButton } from "@razorlabs/wallet-kit";
import { useAptosWallet } from "@razorlabs/wallet-kit";
import { useStake } from "./useStake";
import { useRef, useState } from "react";
import { createEntryPayload } from "@thalalabs/surf";
import { ABI as StakingABI } from "../services/Staking.ts";
import Modal from "./Modal"; // Import the enhanced Modal component

const Votedata = () => {
  const { data: stake, refetch: refetchStake } = useStake();
  const { account, signAndSubmitTransaction } = useAptosWallet();
  const amountRef = useRef<HTMLInputElement>(null);

  // State for controlling modal visibility and message
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"info" | "success" | "error">("info");
  const [modalTitle, setModalTitle] = useState("Transaction Submitted");
  const [modalStep, setModalStep] = useState<"details" | "confirm" | "loading">("confirm");
  const [transactionUrl, setTransactionUrl] = useState("");

  // Function to open modal with a specific message and type
  const openModal = (message: string, type: "info" | "success" | "error" = "info", title = "Transaction Submitted", step: "details" | "confirm" | "loading" = "confirm", txUrl = "") => {
    setModalMessage(message);
    setModalType(type);
    setModalTitle(title);
    setModalStep(step);
    setTransactionUrl(txUrl);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function stakeMove() {
    try {
      const amount = parseFloat(amountRef.current?.value || "0");
      
      if (isNaN(amount) || amount <= 0) {
        openModal("Please enter a valid amount greater than 0", "error", "Invalid Amount", "details");
        return;
      }

      const payload = createEntryPayload(StakingABI, {
        function: "stake",
        typeArguments: [],
        functionArguments: [Math.floor(amount * Math.pow(10, 8)).toString()], // Fixed the BigInt issue here
      });

      openModal("Please confirm this transaction in your wallet...", "info", "Transaction In Progress", "loading");
      
      const response = await signAndSubmitTransaction({
        payload,
      });
      
      // Fixed: Safely access the hash property by checking response type
      let txUrl = "";
      if (response && 'hash' in response && response.hash) {
        txUrl = `https://explorer.aptoslabs.com/txn/${response.hash}`;
      }
      
      openModal(`${amount} MOVE tokens successfully staked as collateral`, "success", "Transaction Submitted", "confirm", txUrl);

      setTimeout(() => {
        refetchStake();
      }, 2000);
    } catch (error: any) {
      if (error.message?.includes("rejected")) {
        openModal("Transaction was rejected by user", "error", "Transaction Failed", "details");
      } else if (error.message?.includes("insufficient balance")) {
        openModal("Insufficient balance to complete transaction", "error", "Transaction Failed", "details");
      } else if (error.message?.includes("timeout")) {
        openModal("Transaction timed out. Please try again", "error", "Transaction Failed", "details");
      } else if (error.message?.includes("BigInt")) {
        openModal("Invalid amount format. Please enter a valid number", "error", "Transaction Failed", "details");
      } else {
        openModal(`Transaction failed: ${error.message || "Unknown error"}`, "error", "Transaction Failed", "details");
      }
    }
  }

  async function unstakeMove() {
    try {
      const amount = parseFloat(amountRef.current?.value || "0");
      
      if (isNaN(amount) || amount <= 0) {
        openModal("Please enter a valid amount greater than 0", "error", "Invalid Amount", "details");
        return;
      }
      
      // Fixed: Compare with the numeric stake value properly
      const currentStake = typeof stake === 'number' ? stake : 0;
      if (amount > currentStake) {
        openModal("Cannot unstake more than your staked amount", "error", "Invalid Amount", "details");
        return;
      }

      openModal("Please confirm this transaction in your wallet...", "info", "Transaction In Progress", "loading");
      
      const response = await signAndSubmitTransaction({
        payload: createEntryPayload(StakingABI, {
          function: `unstake`,
          typeArguments: [],
          functionArguments: [Math.floor(amount * Math.pow(10, 8)).toString()], // Fixed the BigInt issue here
        }),
      });
      
      // Fixed: Safely access the hash property by checking response type
      let txUrl = "";
      if (response && 'hash' in response && response.hash) {
        txUrl = `https://explorer.aptoslabs.com/txn/${response.hash}`;
      }
      
      openModal(`${amount} MOVE tokens successfully unstaked`, "success", "Transaction Submitted", "confirm", txUrl);

      setTimeout(() => {
        refetchStake();
      }, 2000);
    } catch (error: any) {
      if (error.message?.includes("rejected")) {
        openModal("Transaction was rejected by user", "error", "Transaction Failed", "details");
      } else if (error.message?.includes("insufficient")) {
        openModal("You don't have enough staked tokens to unstake this amount", "error", "Transaction Failed", "details");
      } else if (error.message?.includes("timeout")) {
        openModal("Transaction timed out. Please try again", "error", "Transaction Failed", "details");
      } else if (error.message?.includes("network")) {
        openModal("Network error. Please check your connection and try again", "error", "Transaction Failed", "details");
      } else if (error.message?.includes("BigInt")) {
        openModal("Invalid amount format. Please enter a valid number", "error", "Transaction Failed", "details");
      } else {
        openModal(`Unstaking failed: ${error.message || "Unknown error"}`, "error", "Transaction Failed", "details");
      }
    }
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
          <input className="inputfield" placeholder="MOVE" ref={amountRef} />
          {!account?.address && (
            <AptosConnectButton
              className="whit"
              style={{
                margin: "0",
                width: "100%", // Makes the button take full width of its container
                maxWidth: "400px", // Limits the maximum width to 400px
                padding: "10px 5px", // Adjusted padding for responsiveness
                background: 'linear-gradient(45deg, #ffc30d, #b80af7)',
                borderRadius: "13px",
                fontSize: "15px", // Base font size
                fontWeight: "bold",
                boxSizing: "border-box", // Ensures padding and border are included in the total width and height
                border: 'none',
              }}
            />
          )}
          {account?.address && (
            <>
              <button
                type="button"
                style={{
                  margin: "0",
                  width: "100%", // Makes the button take full width of its container
                  maxWidth: "400px", // Limits the maximum width to 400px
                  padding: "10px 5px", // Adjusted padding for responsiveness
                  background: 'linear-gradient(45deg, #ffc30d, #b80af7)',
                  borderRadius: "13px",
                  fontSize: "15px", // Base font size
                  fontWeight: "bold",
                  boxSizing: "border-box", // Ensures padding and border are included in the total width and height
                  border: 'none',
                  color: 'white',
                }}
                onClick={stakeMove}
              >
                Stake
              </button>
              <button
                type="button"
                style={{
                  margin: "15px 0",
                  width: "100%", // Makes the button take full width of its container
                  maxWidth: "400px", // Limits the maximum width to 400px
                  padding: "10px 5px", // Adjusted padding for responsiveness
                  background: 'linear-gradient(45deg, #ffc30d, #b80af7)',
                  borderRadius: "13px",
                  fontSize: "15px", // Base font size
                  fontWeight: "bold",
                  boxSizing: "border-box", // Ensures padding and border are included in the total width and height
                  border: 'none',
                  color: 'white',
                }}
                onClick={unstakeMove}
              >
                Unstake
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal component moved outside the vdata-container to prevent it from following the container when scrolling */}
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
    </>
  );
};

export default Votedata;