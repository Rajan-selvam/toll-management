import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import TollEntries from './pages/TollEntries';
import Tolls from './pages/Tolls';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h5 className='App-header-name'>Toll Management Application</h5>
      </header>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<TollEntries />} />
        <Route path='/toll-list' element={<Tolls />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
