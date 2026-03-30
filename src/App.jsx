import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Forms from './pages/Forms'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard/:teamId" element={<Dashboard />} />
          <Route path="/team/:teamId" element={<Team />} />
          <Route path="/forms" element={<Forms />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App