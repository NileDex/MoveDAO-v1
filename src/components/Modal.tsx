import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  type?: "info" | "success" | "error";
  title?: string;
  showActionButtons?: boolean;
  onViewTransaction?: () => void;
  step?: "details" | "confirm" | "loading";
}

const modalStyles = {
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#121212',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    padding: 0,
    border: '1px solid #333',
    overflow: 'hidden' as const,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  modalBody: {
    padding: '40px 20px 20px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    textAlign: 'center' as const,
  },
  modalIcon: {
    marginBottom: '24px',
  },
  modalTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 600,
    margin: '0 0 16px',
  },
  modalContentText: {
    color: '#bbb',
    marginBottom: '40px',
    fontSize: '16px',
    lineHeight: 1.5,
  },
  modalFooter: {
    width: '100%',
    marginTop: '20px',
  },
  modalSteps: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: '24px',
  },
  step: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#333',
    color: '#888',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '14px',
    marginBottom: '8px',
  },
  stepNumberActive: {
    backgroundColor: '#2DE2C5',
    color: '#121212',
  },
  stepLabel: {
    fontSize: '12px',
    color: '#888',
  },
  stepLabelActive: {
    color: '#2DE2C5',
  },
  stepLine: {
    height: '2px',
    width: '60px',
    backgroundColor: '#333',
    margin: '0 16px',
    marginBottom: '32px',
  },
  stepLineActive: {
    backgroundColor: '#2DE2C5',
  },
  modalActions: {
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    gap: '12px',
  },
  btnClose: {
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  btnView: {
    backgroundColor: '#5e42ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loader: {
    width: '16px',
    height: '16px',
    border: '2px solid #121212',
    borderBottomColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block',
    boxSizing: 'border-box' as const,
    animation: 'rotation 1s linear infinite',
  },
};

// Define keyframes for the loader animation
const loaderKeyframes = `
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  type = "info",
  title = "Transaction Submitted",
  showActionButtons = true,
  onViewTransaction,
  step = "confirm"
}) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.modalOverlay}>
      {/* Add keyframes for loader animation */}
      <style>
        {loaderKeyframes}
      </style>
      
      <div style={modalStyles.modalContent}>
        <div style={modalStyles.modalBody}>
          {type === "success" && (
            <div style={modalStyles.modalIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 58.6667C46.7276 58.6667 58.6667 46.7276 58.6667 32C58.6667 17.2724 46.7276 5.33334 32 5.33334C17.2724 5.33334 5.33334 17.2724 5.33334 32C5.33334 46.7276 17.2724 58.6667 32 58.6667Z" stroke="#2DE2C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6"/>
                <path d="M42.6667 25.3333L28 40L21.3333 33.3333" stroke="#2DE2C5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          
          {type === "error" && (
            <div style={modalStyles.modalIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="26.6667" stroke="#FF4D4F" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6"/>
                <path d="M40 24L24 40" stroke="#FF4D4F" strokeWidth="4" strokeLinecap="round"/>
                <path d="M24 24L40 40" stroke="#FF4D4F" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          
          {type === "info" && (
            <div style={modalStyles.modalIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="26.6667" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6"/>
                <path d="M32 21.3333V32L38.6667 38.6667" stroke="#2196F3" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          
          <h2 style={modalStyles.modalTitle}>{title}</h2>
          <div style={modalStyles.modalContentText}>{children}</div>
          
          {showActionButtons && (
            <div style={modalStyles.modalFooter}>
              <div style={modalStyles.modalSteps}>
                <div style={{
                  ...modalStyles.step
                }}>
                  <div style={{
                    ...modalStyles.stepNumber,
                    ...(step === "loading" || step === "confirm" ? modalStyles.stepNumberActive : {})
                  }}>
                    {step === "loading" ? (
                      <div style={modalStyles.loader}></div>
                    ) : (
                      "1"
                    )}
                  </div>
                  <div style={{
                    ...modalStyles.stepLabel,
                    ...(step === "loading" || step === "confirm" ? modalStyles.stepLabelActive : {})
                  }}>Details</div>
                </div>
                <div style={{
                  ...modalStyles.stepLine,
                  ...(step === "confirm" ? modalStyles.stepLineActive : {})
                }}></div>
                <div style={{
                  ...modalStyles.step
                }}>
                  <div style={{
                    ...modalStyles.stepNumber,
                    ...(step === "confirm" ? modalStyles.stepNumberActive : {})
                  }}>2</div>
                  <div style={{
                    ...modalStyles.stepLabel,
                    ...(step === "confirm" ? modalStyles.stepLabelActive : {})
                  }}>Confirm</div>
                </div>
              </div>
              <div style={modalStyles.modalActions}>
                <button 
                  style={modalStyles.btnClose} 
                  onClick={onClose}
                >
                  Close
                </button>
                {onViewTransaction && step === "confirm" && (
                  <button 
                    style={modalStyles.btnView} 
                    onClick={onViewTransaction}
                  >
                    View Transaction
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;