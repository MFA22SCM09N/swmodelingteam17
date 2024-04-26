import SignUp from './pages/SignUp.js';
import SignIn from './pages/SignIn.js';
import { Route, BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Landing from './pages/landingPage/LandingPage.js';
import Dashboard from '../src/Dashboard/Dashboard.js';
import { AccountsProvider } from "./Context/AccountsContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";


function App() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  return (
    <div className="App">
      <BrowserRouter>
      <AccountsProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={<SignIn />
            }
          ></Route>
          <Route
            path="/signup"
            element={<SignUp />
            }
          ></Route>
          <Route
            path="/landing"
            element={<Landing />
            }
          ></Route>
            <Route
            path="/dashboard"
            element={<Dashboard />
            }
          ></Route>
        </Routes>
        </AuthProvider>
        </AccountsProvider>
      </BrowserRouter>
    </div>

  );
}

export default App;
