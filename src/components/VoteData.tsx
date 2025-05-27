import { ImPower } from "react-icons/im";
import { FiMoreVertical } from "react-icons/fi";
import "@razorlabs/wallet-kit/style.css";
import { AptosConnectButton } from "@razorlabs/wallet-kit";
import { useAptosWallet } from "@razorlabs/wallet-kit";
import { useStake } from "./useStake";
import { useRef, useState, useEffect } from "react";
import { createEntryPayload } from "@thalalabs/surf";
import { ABI as StakingABI } from "../services/Staking.ts";
import Modal from "./Modal";
import movementtoken from './images/movementtoken.png';

// Custom hook for count-up animation
const useCountUp = (target: number, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    // Calculate increment time based on target value
    const frames = Math.min(Math.max(Math.floor(duration / 16), 30), 120);
    const increment = end / frames;
    
    if (end === 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, duration / frames);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

const Votedata = () => {
  const { data: stake, refetch: refetchStake } = useStake();
  const { account, signAndSubmitTransaction } = useAptosWallet();
  const amountRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for controlling modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"info" | "success" | "error">("info");
  const [modalTitle, setModalTitle] = useState("Transaction Submitted");
  const [modalStep, setModalStep] = useState<"details" | "confirm" | "loading">("confirm");
  const [transactionUrl, setTransactionUrl] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    type: "stake" | "unstake";
    amount: number;
  } | null>(null);

  // Use the count-up animation for stake display
  const animatedStake = useCountUp(typeof stake === 'number' ? stake : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

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
    setPendingAction(null);
  };

  const handleConfirmTransaction = async () => {
    if (!pendingAction) return;

    try {
      const { type: action, amount } = pendingAction;

      const amountInAtomicUnits = Math.floor(amount * Math.pow(10, 8)).toString();
      console.log(`${action} amount (atomic units):`, amountInAtomicUnits);

      const payload = createEntryPayload(StakingABI, {
        function: action,
        typeArguments: [],
        functionArguments: [amountInAtomicUnits],
      });

      console.log("Transaction payload:", payload);

      openModal("Please confirm this transaction in your wallet...", "info", "Transaction In Progress", "loading");
      
      const resp = await signAndSubmitTransaction({ payload });
      console.log("Transaction response:", resp);

      if (!resp || 'error' in resp) {
        throw new Error("Transaction failed - no hash returned");
      }

      const txUrl = `https://explorer.movementlabs.xyz/?network=bardock+testnet${(Response as unknown as { hash: string }).hash}`;
      console.log("Transaction URL:", txUrl);
      
      const successMessage = action === "stake" 
        ? `${amount} MOVE tokens successfully staked as collateral`
        : `${amount} MOVE tokens successfully unstaked`;
      
      openModal(
        successMessage,
        "success",
        "Transaction Submitted",
        "confirm",
        txUrl
      );

      setInputValue("");
      setPendingAction(null);

      setTimeout(() => {
        refetchStake();
      }, 5000);

    } catch (error: any) {
      console.error(`${pendingAction.type} error:`, error);
      
      let errorMessage = `${pendingAction.type} failed: ${error.message || "Unknown error"}`;
      let errorType: "error" = "error";
      
      if (error.message?.includes("rejected")) {
        errorMessage = "Transaction was rejected by user";
      } else if (error.message?.includes("insufficient")) {
        errorMessage = pendingAction.type === "stake" 
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
      setPendingAction(null);
    }
  };

  const initiateTransaction = (action: "stake" | "unstake") => {
    const amount = parseFloat(inputValue);
    
    if (isNaN(amount) || amount <= 0) {
      openModal("Please enter a valid amount greater than 0", "error", "Invalid Amount", "details");
      return;
    }

    if (action === "unstake") {
      const currentStake = typeof stake === 'number' ? stake : 0;
      if (amount > currentStake) {
        openModal("Cannot unstake more than your staked amount", "error", "Invalid Amount", "details");
        return;
      }
    }

    setPendingAction({ type: action, amount });
    
    const confirmationMessage = action === "stake" 
      ? `Are you sure you want to stake ${amount} MOVE tokens as collateral?`
      : `Are you sure you want to unstake ${amount} MOVE tokens?`;
    
    openModal(
      confirmationMessage,
      "info",
      "Confirm Transaction",
      "details"
    );
  };

  async function stakeMove() {
    initiateTransaction("stake");
  }

  async function unstakeMove() {
    initiateTransaction("unstake");
  }

  return (
    <>
      <div className="vdata-container">
        {!account?.address ? (
          <div className="vdata-info">
            <h3 className="connect-wallet-text">
              Connect your wallet below to lock MOVE and vote on Proposals & LFG!
            </h3>
            <AptosConnectButton
              className="whit"
              label="Connect Wallet"
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
          </div>
        ) : (
          <>
            <div className="vdata-info-one">
              <div className="vote-power">
                <span className="staked-label">Staked:</span>
                <span className="staked-value">
                  {animatedStake.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
                <span>
                  <ImPower />
                </span>
              </div>
              <h3 className="lock-tokens-text">
                Lock MOVE tokens to receive your voting power.{" "}
                <a href="https://movedao-1.gitbook.io/movedao/">Learn more</a>
              </h3>
            </div>

            <div className="vdata-info">
              <div className="vdata-wallet-action">
                <div className="vdata-wallet-action-flex">
                  <p></p>
                </div>
              </div>
              
              <div className="movement-branding">
                <div className="movement-logo">
                  <img src={movementtoken} alt="Movement" className="movement-logo-img" />
                </div>
                <span className="movement-text">Movement</span>
              </div>
              
              <div className="input-container">
                <input 
                  className="inputfield" 
                  placeholder="MOVE" 
                  ref={amountRef}
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={handleInputChange}
                  min="0"
                  step="0.00000001"
                />
              </div>
              
              <div className="action-buttons-container">
                <button
                  type="button"
                  className="action-button"
                  onClick={stakeMove}
                >
                  Stake
                </button>
                <div className="dropdown-container">
                  <button 
                    type="button" 
                    className="options-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FiMoreVertical size={20} />
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-card">
                      <button
                        type="button"
                        className="action-button dropdown-item"
                        onClick={() => {
                          unstakeMove();
                          setIsDropdownOpen(false);
                        }}
                      >
                        Unstake
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        type={modalType}
        title={modalTitle}
        step={modalStep}
        showActionButtons={true}
        onViewTransaction={transactionUrl ? () => window.open(transactionUrl, '_blank') : undefined}
        onConfirm={pendingAction && modalStep === "details" && modalType === "info" && modalTitle === "Confirm Transaction" ? handleConfirmTransaction : undefined}
        confirmText={pendingAction?.type === "stake" ? "Yes, Stake" : "Yes, Unstake"}
      >
        {modalMessage}
      </Modal>
    </>
  );
};

export default Votedata;