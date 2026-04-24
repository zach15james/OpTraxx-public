import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import PublicLayout from './layouts/PublicLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Forms from './pages/Forms'
import TaskList from './pages/TaskList'
import Analytics from './pages/Analytics'
import AssignTask from './pages/AssignTask'
import FormBuilder from './pages/FormBuilder'
import Profile from './pages/Profile'
import Escalations from './pages/Escalations'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Features from './pages/Features'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes with shared header */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faq" element={<Faq />} />
                        <Route path="/features" element={<Features />} />
                    </Route>

                    {/* Standalone public routes (no header) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard/:teamId" element={<Dashboard />} />
                            <Route path="/tasks" element={<TaskList />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/assign" element={<AssignTask />} />
                            <Route path="/form-builder" element={<FormBuilder />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/escalations" element={<Escalations />} />
                            <Route path="/team/:teamId" element={<Team />} />
                            <Route path="/forms" element={<Forms />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
