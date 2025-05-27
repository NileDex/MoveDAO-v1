import { useState, useEffect } from "react";
import { createEntryPayload } from "@thalalabs/surf";
import { ABI as StakingABI } from "../../../services/Staking";
import { useAptosWallet } from  "@razorlabs/wallet-kit";
import './css/createvote.css';
import { useNavigate } from 'react-router-dom';

interface AlertState {
  message: string | null;
  type: 'info' | 'success' | 'error' | null;
}

const CreateProposal = () => {
  const { signAndSubmitTransaction } = useAptosWallet();
  const navigate = useNavigate();
  const [voteQuestion, setVoteQuestion] = useState("");
  const [voteDescription, setVoteDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [step, setStep] = useState(1); // Track the current step in the form
  const [alert, setAlert] = useState<AlertState>({ message: null, type: null });

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: null, type: null });
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  function dateToSeconds(date: Date) {
    return Math.floor(+date / 1000);
  }

  const createVote = async () => {
    setAlert({ message: null, type: null }); // Clear previous alerts
    if (!startDate || !endDate) {
      setAlert({ message: "Please select both start and end dates.", type: 'error' });
      return;
    }

    const payload = createEntryPayload(StakingABI, {
      function: "create_vote",
      typeArguments: [],
      functionArguments: [
        voteQuestion,
        voteDescription,
        dateToSeconds(startDate),
        dateToSeconds(endDate),
      ],
    });

    try {
      await signAndSubmitTransaction({
        payload,
      });

      // Assuming transaction submission was initiated successfully,
      // you might want a loading state or a temporary message here.
      // The actual success/failure message often comes from the wallet callback
      // or by waiting for the transaction on chain.
      // For now, let's add a placeholder success message.
      setAlert({ message: "Proposal creation transaction sent successfully!", type: 'success' });

      // Clear fields and redirect after a short delay to show success message
      setTimeout(() => {
        setVoteQuestion('');
        setVoteDescription('');
        setStartDate(null);
        setEndDate(null);
        setStep(1);
        setAlert({ message: null, type: null }); // Clear alert before redirect
        navigate('/');
      }, 3000); // Redirect after 3 seconds

    } catch (error) {
      console.error("Failed to create vote:", error);
      setAlert({ message: "Failed to create proposal. Please try again.", type: 'error' });
    }
  };

  const nextStep = () => {
    setAlert({ message: null, type: null }); // Clear previous alerts
    if (step === 1) {
      if (voteQuestion.trim() === '') {
        setAlert({ message: "Please enter a vote question.", type: 'error' });
        return; // Stop here if validation fails
      }
    } else if (step === 2) {
      if (voteDescription.trim() === '') {
        setAlert({ message: "Please enter a vote description.", type: 'error' });
        return; // Stop here if validation fails
      }
    }
    // Add similar validation for other steps if needed here

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="profile-container">
      <div className="eligible-container">
        <h2>Create Proposal</h2>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        {step === 1 && (
          <div className="user-info-form">
            <label>
              Vote Question:
              <input
                type="text"
                value={voteQuestion}
                onChange={(e) => setVoteQuestion(e.target.value)}
                placeholder="Enter the vote question"
              />
            </label>
            <button className="eligibility-button" onClick={nextStep}>
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="user-info-form">
            <label>
              Vote Description:
              <textarea
                value={voteDescription}
                onChange={(e) => setVoteDescription(e.target.value)}
                placeholder="Enter the vote description"
              />
            </label>
            <div className="button-group">
              <button className="eligibility-button" onClick={prevStep}>
                Back
              </button>
              <button className="eligibility-button" onClick={nextStep}>
                Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="user-info-form">
            <label>
              Start Date:
              <input
                type="date"
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </label>
            <div className="button-group">
              <button className="eligibility-button" onClick={prevStep}>
                Back
              </button>
              <button className="eligibility-button" onClick={createVote}>
                Create Vote
              </button>
            </div>
          </div>
        )}
      </div>
      {alert.message && (
        <div className={`custom-alert custom-alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default CreateProposal;