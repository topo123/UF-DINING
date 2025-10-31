import { useState, useEffect } from 'react'
import './App.css'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Signed up successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Logged in successfully!");
      }
      navigate('/restaurants');
    } catch (err) {
      console.error("Authentication failed:", err);
      setError("Invalid email or password.");
    }

  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
  }
  
  return (
    <div className="App">
      <h1 className='title'>
        Dinr        
      </h1>
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className='login-title'>{isSignup ? "Sign Up" : "Log In"}</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            {isSignup ? "Sign Up" : "Log In"}
          </button>

          <button
            type="button"
            className="switch-button"
            onClick={toggleMode}
            >
            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
            
        </form>
      </div>
    </div>
  );
}

export default App;
