import React from 'react';
import HeaderTabs from './components/HeaderTabs';
import Calculator from './components/Calculator';
import TransactionsList from './components/TransactionsList';
import './App.css';

function App() {
  // you can customize these labels or add more workspaces
  const workspaces = [
    {
      id: 'ws1',
      label: 'Workspace 1',
      content: (
        <div className="content">
          <Calculator />
          <TransactionsList />
        </div>
      ),
    },
    {
      id: 'ws2',
      label: 'Workspace 2',
      content: (
        <div className="content">
          <Calculator />
          <TransactionsList />
        </div>
      ),
    },
    {
      id: 'ws3',
      label: 'Workspace 3',
      content: (
        <div className="content">
          <Calculator />
          <TransactionsList />
        </div>
      ),
    },
  ];

  return (
    <HeaderTabs projectName="My Project" workspaces={workspaces} />
  );
}

export default App;
