import React from 'react';
import HeaderTabs from './components/HeaderTabs';

const workspaces = [
  { id: 'ws1', label: 'Workspace 1', content: <div>👩‍💻 This is WS1</div> },
  { id: 'ws2', label: 'Workspace 2', content: <div>📊 This is WS2</div> },
  { id: 'ws3', label: 'Workspace 3', content: <div>🗂️ This is WS3</div> },
];

function App() {
  return (
    <div style={{ padding: 20, background: '#f0f2f5', minHeight: '100vh' }}>
      <HeaderTabs projectName="My Project" workspaces={workspaces} />
    </div>
  );
}

export default App;
