import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Calendar,
  FileUp,
  CheckSquare,
  Star,
  Camera,
  MapPin,
  QrCode,
} from 'lucide-react'

export default function FormBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: 'Daily Safety Checklist',
    description: 'End-of-shift safety verification for field teams',
    priority: 'high',
    fields: [
      { id: 1, type: 'text', label: 'Employee Name', placeholder: 'Your full name', required: true },
      { id: 2, type: 'checkbox', label: 'Safety Issues Observed', placeholder: '', required: false },
      { id: 3, type: 'photo', label: 'Site Photo', placeholder: '', required: false },
    ],
    rules: [],
    assignees: ['team-1'],
    schedule: 'daily',
  })

  const steps = [
    { number: 1, title: 'Details', description: 'Form info' },
    { number: 2, title: 'Build', description: 'Add fields' },
    { number: 3, title: 'Logic', description: 'Set rules' },
    { number: 4, title: 'Assign', description: 'Deploy form' },
  ]

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: Type, description: 'Short text' },
    { type: 'number', label: 'Number', icon: '🔢', description: 'Numeric value' },
    { type: 'date', label: 'Date', icon: Calendar, description: 'Pick a date' },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Yes/No' },
    { type: 'photo', label: 'Photo', icon: Camera, description: 'Take photo' },
    { type: 'gps', label: 'GPS', icon: MapPin, description: 'Location' },
    { type: 'qr', label: 'QR Scanner', icon: QrCode, description: 'Scan code' },
    { type: 'file', label: 'File Upload', icon: FileUp, description: 'Upload file' },
    { type: 'rating', label: 'Rating', icon: Star, description: '1-5 stars' },
  ]

  const addField = (type, label) => {
    const newField = {
      id: Math.max(...formData.fields.map(f => f.id), 0) + 1,
      type,
      label,
      placeholder: 'Placeholder text',
      required: false,
    }
    setFormData({ ...formData, fields: [...formData.fields, newField] })
  }

  const removeField = (id) => {
    setFormData({ ...formData, fields: formData.fields.filter(f => f.id !== id) })
  }

  const updateField = (id, updates) => {
    setFormData({
      ...formData,
      fields: formData.fields.map(f => f.id === id ? { ...f, ...updates } : f),
    })
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const jumpToStep = (step) => {
    setCurrentStep(step)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white">
      {/* Stepper Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Form Builder</h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-blue-600">Step {currentStep} of 4</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Button */}
              <button
                onClick={() => jumpToStep(step.number)}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                  currentStep === step.number
                    ? 'bg-blue-600 text-white shadow-lg'
                    : currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </button>

              {/* Step Label */}
              <div className="ml-3 cursor-pointer" onClick={() => jumpToStep(step.number)}>
                <p className="text-xs font-semibold text-slate-600 uppercase">{step.title}</p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-3 rounded transition-colors ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Form Details & Settings</h2>
              <p className="text-slate-600">Define the basic information about your form</p>
            </div>

            <div className="space-y-6">
              {/* Form Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Form Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Daily Safety Checklist"
                />
                <p className="text-xs text-slate-500 mt-2">This is what employees will see as the form title</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="4"
                  placeholder="Provide context or instructions for employees..."
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        formData.priority === p
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Build Your Form</h2>
              <p className="text-slate-600">Add fields that employees will fill out</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fieldTypes.map((field) => (
                <button
                  key={field.type}
                  onClick={() => addField(field.type, field.label)}
                  className="p-4 rounded-lg border border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{typeof field.icon === 'string' ? field.icon : <field.icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{field.label}</p>
                      <p className="text-xs text-slate-500">{field.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Current Fields */}
            {formData.fields.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Form Fields ({formData.fields.length})</h3>
                <div className="space-y-3">
                  {formData.fields.map((field) => (
                    <div key={field.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        <p className="text-xs text-slate-500">{field.type}</p>
                      </div>
                      <button onClick={() => removeField(field.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Logic & Conditional Rules</h2>
              <p className="text-slate-600">Set up if/then rules to make your form smarter</p>
            </div>

            <Card className="p-6 border-slate-200">
              <div className="text-center space-y-4">
                <div className="text-4xl">⚡</div>
                <p className="text-slate-600">Conditional logic coming soon!</p>
                <p className="text-sm text-slate-500">You'll be able to set rules like:<br />"If Safety Issue is checked, require Photo upload"</p>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Assign & Deploy</h2>
              <p className="text-slate-600">Choose who receives this form and when</p>
            </div>

            <div className="space-y-6">
              {/* Assignees */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Assign To</label>
                <div className="space-y-2">
                  {['Team 1: Engineering', 'Team 2: Operations', 'Team 3: Safety'].map((team) => (
                    <label key={team} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm font-medium text-slate-900">{team}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Recurrence</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Once', 'Daily', 'Weekly', 'Monthly'].map((sched) => (
                    <button
                      key={sched}
                      onClick={() => setFormData({ ...formData, schedule: sched.toLowerCase() })}
                      className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        formData.schedule === sched.toLowerCase()
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sched}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="font-bold text-slate-900 mb-4">Review Before Publishing</h4>
                <div className="space-y-2 text-sm">
                  <p>📝 <strong>Form:</strong> {formData.name}</p>
                  <p>📋 <strong>Fields:</strong> {formData.fields.length}</p>
                  <p>🎯 <strong>Priority:</strong> {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}</p>
                  <p>📅 <strong>Schedule:</strong> {formData.schedule.charAt(0).toUpperCase() + formData.schedule.slice(1)}</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between">
        <Button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-sm text-slate-600">
          Step {currentStep} of {steps.length}
        </div>

        {currentStep === 4 ? (
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Check className="w-4 h-4" />
            Publish Form
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
