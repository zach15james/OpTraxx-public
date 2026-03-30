import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing Page</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/signup" element={<div>Sign Up</div>} />
        <Route path="/dashboard/:teamId" element={<div>Dashboard</div>} />
        <Route path="/team/:teamId" element={<div>Team Page</div>} />
        <Route path="/forms" element={<div>Forms</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App