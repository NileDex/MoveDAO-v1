import { useState } from "react";
import { createEntryPayload } from "@thalalabs/surf";
import { ABI as StakingABI } from "../../../services/Staking";
import { useAptosWallet } from "@razorlabs/wallet-kit";
import './css/createvote.css';
const CreateProposal = () => {
  const { signAndSubmitTransaction } = useAptosWallet();
  const [voteQuestion, setVoteQuestion] = useState("");
  const [voteDescription, setVoteDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [step, setStep] = useState(1); // Track the current step in the form

  function dateToSeconds(date: Date) {
    return Math.floor(+date / 1000);
  }

  const createVote = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
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

    await signAndSubmitTransaction({
      payload,
    });
  };

  const nextStep = () => {
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
    </div>
  );
};

export default CreateProposal;