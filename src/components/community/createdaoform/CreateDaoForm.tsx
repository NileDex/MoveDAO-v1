import React from "react";
import './css/createvote.css';

const CreateDao = () => {
  const [daoName, setDaoName] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState("");
  const [backdropUrl, setBackdropUrl] = React.useState("");
  const [councilMembers, setCouncilMembers] = React.useState("");
  const [step, setStep] = React.useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="profile-container">
      <div className="eligible-container">
        <h2>Create DAO</h2>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        {step === 1 && (
          <div className="user-info-form">
            <label>
              DAO Name:
              <input
                type="text"
                value={daoName}
                onChange={(e) => setDaoName(e.target.value)}
                placeholder="Enter DAO name"
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
              Logo URL:
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Enter logo URL or image data"
              />
            </label>
            <label>
              Backdrop URL:
              <input
                type="text"
                value={backdropUrl}
                onChange={(e) => setBackdropUrl(e.target.value)}
                placeholder="Enter backdrop URL or image data"
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
              Council Members:
              <textarea
                value={councilMembers}
                onChange={(e) => setCouncilMembers(e.target.value)}
                placeholder="Enter council member addresses (one per line, max 7)"
              />
              <small>Maximum of 7 council members allowed</small>
            </label>
            <div className="button-group">
              <button className="eligibility-button" onClick={prevStep}>
                Back
              </button>
              <button className="eligibility-button">
                Create DAO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDao;



