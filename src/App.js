import SignUp from './pages/SignUp.js';
import SignIn from './pages/SignIn.js';
import { Route, BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Landing from './pages/landingPage/LandingPage.js';


function App() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  return (
    <div className="App">
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
