/**
 * Shared Docusaurus configuration constants
 */

/**
 * Disclaimer button HTML with embedded styles
 * Used across multiple Docusaurus sites for consistent disclaimer functionality
 */
export const DISCLAIMER_BUTTON_HTML = `
<style>
#disclaimer-btn::before { 
  content: ""; 
  width: 1rem; 
  height: 1rem; 
  background-image: url("/common/img/icons/information-circle.svg"); 
  background-size: contain; 
  background-repeat: no-repeat; 
  margin-right: 0.5rem; 
} 
#disclaimer-btn:hover { 
  color: #d1d5db; 
} 
@media (max-width: 996px) { 
  #disclaimer-btn { 
    display: none !important; 
  } 
}
</style>
<button id="disclaimer-btn" style="background: none; border: none; color: #5D6B98; cursor: pointer; margin-left: 0.5rem; display: flex; align-items: center; font-size: 0.875rem; font-family: inherit; transition: color 0.2s ease;">
  Disclaimer
</button>
`;
