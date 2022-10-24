import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
const TollEntries = lazy(() => import('./pages/TollEntries'));
const Tolls = lazy(() => import('./pages/Tolls'));

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h5 className='App-header-name'>Toll Management Application</h5>
      </header>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Suspense fallback={<></>}>
          <Routes>
            <Route path='/' element={<TollEntries />} />
            <Route path='/toll-list' element={<Tolls />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
