// src/App.js

import React from 'react';
import './App.css';
import GitHubActionsTrigger from './GitHubActionsTrigger';
import ArtifactViewer from './ArtifactViewer'; // Import the new component

function App() {
  return (
    <div className="App">
      <h1>Test your website for Accessibility issues in one click</h1>
      <GitHubActionsTrigger />
      <ArtifactViewer /> {/* Add the new component here */}
    </div>
  );
}

export default App;
