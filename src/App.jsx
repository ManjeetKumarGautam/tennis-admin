import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";

import Dashboard from "./pages/Dashboard";
import Player from "./pages/players/Players";
import ScoreBoard from "./pages/score/ScoreBoard";
import Matches from "./pages/matches/Matches";
import LiveMatches from "./pages/matches/LiveMatches";
import MatchDetails from "./components/MatchDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import RootRedirect from "./pages/RootRedirect";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<RootRedirect />} />

        {/* AUTH ROUTES (FULL SCREEN) */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* APP ROUTES (AFTER LOGIN) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/player" element={<Player />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/live-matches" element={<LiveMatches />} />
            <Route path="/matches/:matchId" element={<MatchDetails />} />
            <Route path="/matches/:matchId/scoreboard" element={<ScoreBoard />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
