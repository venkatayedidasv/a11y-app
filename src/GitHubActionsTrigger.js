// src/GitHubActionsTrigger.js

import React, { useState } from 'react';

function GitHubActionsTrigger() {
  const [url, setUrl] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the JSON body with user input
    const requestBody = {
      ref: 'main', // Replace with the desired branch name
      inputs: {
        my_variable: url,
      },
    };

    // Replace 'YOUR_GITHUB_TOKEN' with your actual GitHub personal access token
    const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
    const owner = process.env.REACT_APP_OWNER;
    const repo = process.env.REACT_APP_REPO;
    const workflowName = process.env.REACT_APP_WORKFLOW_NAME;

    const workflowUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowName}/dispatches`;


    // Trigger GitHub Actions workflow using GitHub API
    try {
      const response = await fetch(workflowUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        setApiResponse('Test triggered successfully!');
      } else {
        setApiResponse('Failed to trigger GitHub Actions workflow.');
      }
    } catch (error) {
      console.error('Error:', error);
      setApiResponse('An error occurred.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Website URL you want us to test for accessibility:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.cypress.io"
            required
          />
        </label>
        <button type="submit">Test</button>
      </form>
      {apiResponse && <p>{apiResponse}</p>}
    </div>
  );
}

export default GitHubActionsTrigger;
