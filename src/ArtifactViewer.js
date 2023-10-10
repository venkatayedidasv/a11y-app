import React, { useState } from 'react';
import axios from 'axios';

function ArtifactViewer() {
  const [jsonData, setJsonData] = useState(null);
  const [showData, setShowData] = useState(false);

  const handleClick = async () => {
    await downloadArtifactZip();
    setShowData(true);
  };

  const downloadArtifactZip = async () => {
    // Replace with your GitHub repository details
    const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
    const owner = process.env.REACT_APP_OWNER;
    const repo = process.env.REACT_APP_REPO;
    const runId = process.env.REACT_APP_RUN_ID;

    // Construct the URL to download the artifact ZIP file
    const artifactUrl = `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${runId}/zip`;

    try {
      // Use axios to make the HTTP request
      const response = await axios.get(artifactUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
        responseType: 'blob',
      });

      if (response.status === 302) {
        // Read the log.json file from the ZIP
        const zipBlob = response.data;
        const zip = new window.JSZip();
        await zip.loadAsync(zipBlob);

        // Get the content of log.json
        const logJsonFile = await zip.file('log.json').async('string');
        const logJson = JSON.parse(logJsonFile);

        // Set the JSON data in state
        setJsonData(logJson);
      } else {
        console.error('Error downloading artifact:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading artifact:', error);
    }
  };

  return (
    <div>
      <h2>Artifact Viewer</h2>
      <button onClick={handleClick}>View Results</button>
      {showData && jsonData ? (
        <div>
          <h3>log.json Contents</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      ) : (
        <p>Click the button to view results.</p>
      )}
    </div>
  );
}

export default ArtifactViewer;
