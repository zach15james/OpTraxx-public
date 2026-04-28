import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import PublicLayout from './layouts/PublicLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import RoleSelectionPage from './pages/RoleSelectionPage'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import TaskList from './pages/TaskList'
import Analytics from './pages/Analytics'
import AssignTask from './pages/AssignTask'
import Profile from './pages/Profile'
import Escalations from './pages/Escalations'
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Features from './pages/Features'
import FormBuilderSandbox from './zach_contributions/FormBuilderSandbox'
import FormFillSandbox from './zach_contributions/FormFillSandbox'
import FormSubmissionsSandbox from './zach_contributions/FormSubmissionsSandbox'
import SupervisorFormsPage from './zach_contributions/SupervisorFormsPage'
import SupervisorSubmissionsPage from './zach_contributions/SupervisorSubmissionsPage'
import EmployeeFormsPage from './zach_contributions/EmployeeFormsPage'
import EmployeeFormFillPage from './zach_contributions/EmployeeFormFillPage'
import { useTheme } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

function ThemePreferenceSync() {
    const { userProfile } = useAuth()
    const { theme, setThemePreference } = useTheme()

    useEffect(() => {
        const preferredTheme = userProfile?.appearancePreference
        if (!preferredTheme) return
        if (preferredTheme !== theme) {
            setThemePreference(preferredTheme)
        }
    }, [theme, setThemePreference, userProfile?.appearancePreference])

    return null
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ThemePreferenceSync />
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
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/role-selection" element={<RoleSelectionPage />} />

                    {/* Sandbox form builder — no auth required */}
                    <Route path="/sandbox/forms" element={<FormBuilderSandbox />} />
                    <Route path="/sandbox/forms/fill/:formId" element={<FormFillSandbox />} />
                    <Route path="/sandbox/forms/submissions/:formId" element={<FormSubmissionsSandbox />} />

                    {/* Protected routes - authenticated users (all roles) */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/tasks" element={<TaskList />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/escalations" element={<Escalations />} />
                            <Route path="/my-forms" element={<EmployeeFormsPage />} />
                            <Route path="/my-forms/:formId" element={<EmployeeFormFillPage />} />
                        </Route>
                    </Route>

                    {/* Supervisor-only protected routes */}
                    <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard/:teamId" element={<Dashboard />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/assign" element={<AssignTask />} />
                            <Route path="/team/:teamId" element={<Team />} />
                            <Route path="/forms-manage" element={<SupervisorFormsPage />} />
                            <Route path="/forms-manage/submissions/:formId" element={<SupervisorSubmissionsPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
