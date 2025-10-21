import React, { useEffect } from 'react';
import FullPageDialog from './FullPageDialog';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      createConfetti();
      const timer = setTimeout(() => {
        onClose();
        removeConfetti();
      }, 4000); // Close after 4 seconds
      return () => {
        clearTimeout(timer);
        removeConfetti();
      };
    }
  }, [isOpen, onClose]);

  const createConfetti = () => {
    const container = document.getElementById('root'); // Or a specific confetti container
    if (!container) return;

    const confettiCount = 50;
    const colors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece absolute'; // Added absolute for positioning
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.width = `${Math.random() * 6 + 4}px`; // Random width 4-10px
      confetti.style.height = `${Math.random() * 12 + 8}px`; // Random height 8-20px
      confetti.style.opacity = '0'; // Start invisible
      confetti.style.top = '100%'; // Start from bottom
      // Using Tailwind's animation utility if defined, or custom keyframes
      confetti.style.animation = `confetti-fall ${5 + Math.random() * 3}s linear infinite forwards`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`; // Initial random rotation
      container.appendChild(confetti);
    }
  };

  const removeConfetti = () => {
    document.querySelectorAll('.confetti-piece').forEach((el) => el.remove());
  };

  // Define keyframes for confetti fall
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement('style')).sheet;
  if (styleSheet && !styleSheet.cssRules[0]?.cssText?.includes('confetti-fall')) {
    styleSheet.insertRule(`
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
        100% { transform: translateY(-120vh) rotateZ(720deg); opacity: 0; }
      }
    `, 0);
  }

  return (
    <FullPageDialog isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center justify-center h-full text-center p-6 relative z-10">
        <svg
          className="w-28 h-28 animate-scale-in"
          viewBox="0 0 87 87"
        >
          <circle
            className="stroke-green-500 fill-none stroke-4"
            style={{ strokeDasharray: 290, strokeDashoffset: isOpen ? 0 : 290, transition: 'stroke-dashoffset 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards' }}
            cx="43.5"
            cy="43.5"
            r="40.5"
          />
          <path
            className="stroke-green-500 fill-none stroke-5"
            style={{ strokeDasharray: 70, strokeDashoffset: isOpen ? 0 : 70, transition: 'stroke-dashoffset 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards' }}
            d="M25.5,43.5 L41,59 L62.5,28"
          />
        </svg>
        <h2 className="mt-8 text-3xl font-bold text-gray-900">Order Placed Successfully!</h2>
        <p className="mt-2 text-lg text-gray-600">Thank you for your purchase!</p>
      </div>
    </FullPageDialog>
  );
};

export default SuccessDialog;