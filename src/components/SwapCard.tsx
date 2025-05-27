// // SwapCard.tsx
// import React from "react";


// interface SwapCardProps {
//   onClose: () => void;
//   position: { bottom: number; right: number };
// }

// const SwapCard: React.FC<SwapCardProps> = ({ onClose, position }) => {

//   return (
//     <div className="swap-modal">
//       <div
//         className="swap-modal-content"
//         style={{
//           position: "fixed",
//           bottom: `${position.bottom + 70}px`,
//           right: `${position.right}px`,
//           transform: "translateX(0)",
//           width: "400px",
//           height: "500px",
//           padding: "0",
//           overflow: "hidden"
//         }}
//       >
//         <button className="swap-close-button" onClick={onClose}>
//           ×
//         </button>
//         <iframe
//           style={{
//             width: "100%",
//             height: "100%",
//             border: "none",
//             margin: "0",
//             padding: "0",
//             display: "block"
//           }}
//           src="https://app.mosaic.ag/swap/0xa-0xe161897670a0ee5a0e3c79c3b894a0c46e4ba54c6d2ca32e285ab4b01eb74b66?amount=2&isFeeIn=true&feeInBps=30&feeReceiver=0xb9309aedd0dca69145c51003e32d097b9f8795d0045e26d9bc924dd4c199ec92&apiKey=key"
//         />
//       </div>
//     </div>
//   );
// };

// export default SwapCard;