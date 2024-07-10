import React from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <Map />
      <Sidebar />
    </div>
  );
};

export default App;
