import { useState } from 'react';
import ClientView from '../src/Components/ClientViews/ClientApp/index';
import AdminViews from './Components/AdminViews/AdminApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
//State Lifted: Role
function App() {
  const [role, setRole] = useState("none");
  return (
    <Router>
      <div className="App">
        <Routes>
          {role === "admin" ? (
            <Route path="/*" element={<AdminViews setRole={setRole} />} />
          ) : (
            
              <Route path="/*" element={<ClientView setRole={setRole} />} />
            
          )}
        </Routes>
      </div>
    </Router>

  );
}

export default App;
