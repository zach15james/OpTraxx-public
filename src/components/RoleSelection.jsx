import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { Users, CheckCircle } from 'lucide-react'

export default function RoleSelection({ onRoleSelect, loading }) {
  const [selectedRole, setSelectedRole] = useState(null)

  const roles = [
    {
      id: 'supervisor',
      title: 'Supervisor',
      description: 'Assign tasks, build forms, and monitor your team',
      icon: Users,
      accentColor: 'from-blue-50 to-blue-100/50',
      borderColor: 'border-blue-200',
      selectedBorder: 'border-blue-500',
      selectedRing: 'ring-2 ring-blue-500/30',
      iconColor: 'text-blue-600',
    },
    {
      id: 'employee',
      title: 'Employee',
      description: 'View assignments, complete forms, and submit work',
      icon: CheckCircle,
      accentColor: 'from-emerald-50 to-emerald-100/50',
      borderColor: 'border-slate-200',
      selectedBorder: 'border-emerald-500',
      selectedRing: 'ring-2 ring-emerald-500/30',
      iconColor: 'text-emerald-600',
    },
  ]

  const handleConfirm = async () => {
    if (selectedRole) {
      await onRoleSelect(selectedRole)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Logo className="h-8 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome to OpTraxx
          </h1>
          <p className="text-lg text-slate-600">
            Let's get you set up. What's your role?
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative group transition-all duration-200 ${
                  isSelected
                    ? `${role.selectedBorder} ${role.selectedRing}`
                    : role.borderColor
                }`}
              >
                <Card
                  className={`p-8 text-center h-full cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? `${role.selectedBorder} shadow-lg`
                      : `${role.borderColor} shadow-sm hover:shadow-md`
                  }`}
                >
                  {/* Background accent */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${role.accentColor} opacity-0 group-hover:opacity-50 transition-opacity duration-200`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div
                        className={`p-4 rounded-lg transition-colors duration-200 ${
                          isSelected
                            ? role.id === 'supervisor'
                              ? 'bg-blue-100'
                              : 'bg-emerald-100'
                            : 'bg-slate-100 group-hover:bg-slate-200'
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${role.iconColor}`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {role.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="mt-6 flex items-center justify-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            role.id === 'supervisor'
                              ? 'bg-blue-600'
                              : 'bg-emerald-600'
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            role.id === 'supervisor'
                              ? 'text-blue-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          SELECTED
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </button>
            )
          })}
        </div>

        {/* Confirm Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleConfirm}
            disabled={!selectedRole || loading}
            className={`flex-1 h-12 text-base font-semibold transition-all duration-200 ${
              selectedRole
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Setting up your account...' : 'Continue'}
          </Button>
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          You can change your role anytime in settings
        </p>
      </div>
    </div>
  )
}
