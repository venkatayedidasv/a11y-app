import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';

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

      if (response.status >= 200 && response.status < 300) {
        // Read the log.json file from the ZIP
        const zipBlob = response.data;
        const zip = new JSZip(); // Use the imported JSZip constructor
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

  const renderTable = () => {
    if (!jsonData || !jsonData.length) {
      return <p>No data available.</p>;
    }

    // Assuming the JSON data is an array of objects with the same structure
    const headers = Object.keys(jsonData[0]);

    return (
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jsonData.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{item[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Artifact Viewer</h2>
      <button onClick={handleClick}>View Results</button>
      {showData && jsonData ? (
        <div>
          <h3>log.json Contents</h3>
          {renderTable()}
        </div>
      ) : (
        <p>Click the button to view results.</p>
      )}
    </div>
  );
}

export default ArtifactViewer;
