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

    let isListenerAttached = false;
    let pollInterval: NodeJS.Timeout | undefined;
    let currentButton: HTMLElement | null = null;
    let mutationObserver: MutationObserver | null = null;

    const attachListener = () => {
      const disclaimerBtn = document.getElementById("disclaimer-btn");

      // Check if this is a different button or if we need to reattach
      if (
        disclaimerBtn &&
        (disclaimerBtn !== currentButton || !isListenerAttached)
      ) {
        // Remove listener from old button if it exists
        if (currentButton && isListenerAttached) {
          currentButton.removeEventListener("click", handleNavbarClick);
        }

        disclaimerBtn.addEventListener("click", handleNavbarClick);
        currentButton = disclaimerBtn;
        isListenerAttached = true;

        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = undefined;
        }
        return true;
      }
      return false;
    };

    const resetAndReattach = () => {
      isListenerAttached = false;
      currentButton = null;

      // Try to attach immediately
      if (!attachListener()) {
        // If button not found, start polling
        if (!pollInterval) {
          pollInterval = setInterval(() => {
            attachListener();
          }, 100);
        }
      }
    };

    // Try to attach immediately
    resetAndReattach();

    // Set up MutationObserver to watch for DOM changes
    if (typeof window !== "undefined") {
      mutationObserver = new MutationObserver((mutations) => {
        let shouldReattach = false;

        mutations.forEach((mutation) => {
          // Check if nodes were added or removed
          if (mutation.type === "childList") {
            // Check if our current button is still in the DOM
            if (currentButton && !document.contains(currentButton)) {
              shouldReattach = true;
            }
            // Check if a new disclaimer button was added
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (
                  element.id === "disclaimer-btn" ||
                  element.querySelector("#disclaimer-btn")
                ) {
                  shouldReattach = true;
                }
              }
            });
          }
        });

        if (shouldReattach) {
          resetAndReattach();
        }
      });

      // Start observing the navbar area specifically
      const navbar = document.querySelector(
        "[role='banner'], .navbar, .navbar__inner"
      );
      if (navbar) {
        mutationObserver.observe(navbar, {
          childList: true,
          subtree: true,
        });
      } else {
        // Fallback to observing the entire body
        mutationObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }

      // Also listen for route change events specific to Docusaurus
      const handleDocusaurusRouteChange = () => {
        setTimeout(resetAndReattach, 100);
      };

      // Listen for various navigation events
      window.addEventListener("popstate", handleDocusaurusRouteChange);

      // Listen for custom events that might be fired by Docusaurus
      window.addEventListener("routeUpdate", handleDocusaurusRouteChange);

      // Intercept history methods for programmatic navigation
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(history, args);
        handleDocusaurusRouteChange();
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(history, args);
        handleDocusaurusRouteChange();
      };

      // Cleanup function
      return () => {
        if (pollInterval) {
          clearInterval(pollInterval);
        }

        if (currentButton && isListenerAttached) {
          currentButton.removeEventListener("click", handleNavbarClick);
        }

        if (mutationObserver) {
          mutationObserver.disconnect();
        }

        window.removeEventListener("popstate", handleDocusaurusRouteChange);
        window.removeEventListener("routeUpdate", handleDocusaurusRouteChange);

        // Restore original methods
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    }

    // Fallback cleanup for server-side rendering
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (currentButton && isListenerAttached) {
        currentButton.removeEventListener("click", handleNavbarClick);
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
