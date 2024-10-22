import React, { useEffect } from "react";

const Modal = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Corrected to use onClose
    }, 3000); // The pop-up will disappear after 3 seconds
    return () => clearTimeout(timer);
  });

  return (
    <div className="fixed flex justify-between items-center fade-in z-50 fade-out  w-[20%] top-8 right-5 bg-gray-200 text-gray-900 rounded-lg shadow-lg p-4">
      <p>{message}</p>
      <span onClick={onClose} className="text-red-500 cursor-pointer text-3xl">
        x
      </span>
    </div>
  );
};

export default Modal;
