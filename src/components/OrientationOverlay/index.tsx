export function OrientationOverlay() {
  return (
    <div className="orientation-overlay">
      <svg className="rotate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="5" y="2" width="14" height="20" rx="2" fill="rgba(255, 255, 255, 0.05)"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18" stroke-width="4" stroke-linecap="round"></line>
      </svg>
      <h1>ROTATE DEVICE</h1>
      <p>Please turn your screen horizontally to play LangQuest.</p>
    </div>
  );
}

export default OrientationOverlay;
