import React, { ReactNode, useEffect } from "react";
import { RoundedCross } from "../../ui-icons";

interface ModalProps {
  isModalOpen: boolean;
  onModalClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onModalClose,
  children,
}) => {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-8 ">
      <div
        className="absolute inset-0 bg-black opacity-75"
        onClick={onModalClose}
      ></div>
      <div className="relative bg-white p-0 shadow-xl w-auto h-auto z-10 max-w-full max-h-full  ">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onModalClose}
        >
          <RoundedCross />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
