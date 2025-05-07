import React, { useState } from 'react';
import './HeaderTabs.css';

function HeaderTabs({ projectName, workspaces }) {
  // start with the first workspace active
  const [activeTab, setActiveTab] = useState(workspaces[0].id);
  const activeWorkspace = workspaces.find(w => w.id === activeTab);

  return (
    <div>
      {/* unified header + tabs card */}
      <div className="header-tabs">
        {/* Header bar */}
        <div className="header">
          <h1 className="project-name">{projectName}</h1>
          <button
            className="login-button"
            onClick={() => {
              /* your login logic here */
              console.log('Login clicked');
            }}
          >
            🔒 Login
          </button>
        </div>

        {/* Tabs row */}
        <div className="tabs">
          {workspaces.map(w => (
            <div
              key={w.id}
              className={`tab${w.id === activeTab ? ' active' : ''}`}
              onClick={() => setActiveTab(w.id)}
            >
              {w.label}
            </div>
          ))}
        </div>
      </div>

      {/* Content for the active workspace */}
      <div className="tab-content">
        {activeWorkspace && activeWorkspace.content}
      </div>
    </div>
  );
}

export default HeaderTabs;
