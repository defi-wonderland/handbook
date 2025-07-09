import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

function SimpleModal({ isOpen, onClose, children }: SimpleModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--ifm-background-color)",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
          position: "relative",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--ifm-color-emphasis-600)",
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

interface RootProps {
  children: React.ReactNode;
  disclaimerContent?: React.ReactNode | string;
  showDisclaimer?: boolean;
}

export default function Root({
  children,
  disclaimerContent = "This handbook is not intended to replace official documentation. This is internal material used for onboarding new team members. We open source it in the hopes that it helps somebody else, but beware it can be outdated on the latest updates.",
  showDisclaimer = false,
}: RootProps) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = useCallback(() => setShowModal(false), []);

  useEffect(() => {
    if (!showDisclaimer) return;

    const handleNavbarClick = () => {
      setShowModal(true);
    };

    // Add listener when component mounts
    const disclaimerBtn = document.getElementById("disclaimer-btn");
    if (disclaimerBtn) {
      disclaimerBtn.addEventListener("click", handleNavbarClick);
    }

    // Cleanup listener when component unmounts
    return () => {
      const disclaimerBtn = document.getElementById("disclaimer-btn");
      if (disclaimerBtn) {
        disclaimerBtn.removeEventListener("click", handleNavbarClick);
      }
    };
  }, [showDisclaimer]);

  return (
    <>
      {children}
      {showDisclaimer && (
        <SimpleModal isOpen={showModal} onClose={handleCloseModal}>
          <h2>Disclaimer</h2>
          {typeof disclaimerContent === "string" && <p>{disclaimerContent}</p>}
          {typeof disclaimerContent === "object" && disclaimerContent}
        </SimpleModal>
      )}
    </>
  );
}
