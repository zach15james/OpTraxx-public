import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [today, setToday] = useState(new Date())

  // Update today's date each day (for proper "today" highlighting)
  useState(() => {
    const timer = setInterval(() => {
      setToday(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(timer)
  })

  const parseDate = (dateString) => {
    if (!dateString) return null
    // Parse ISO date string (YYYY-MM-DD) in local timezone
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return isNaN(date.getTime()) ? null : date
  }

  const selectedDate = parseDate(value)

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Convert local date to ISO string without timezone conversion
  const toLocalISOString = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const todayAtMidnight = new Date(today)
    todayAtMidnight.setHours(0, 0, 0, 0)

    // Only allow selection of today or future dates
    if (newDate >= todayAtMidnight) {
      onChange(toLocalISOString(newDate))
      setIsOpen(false)
    }
  }

  const isPastDate = (day) => {
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const todayAtMidnight = new Date(today)
    todayAtMidnight.setHours(0, 0, 0, 0)
    return dateToCheck < todayAtMidnight
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-slate-50 transition-colors"
      >
        {selectedDate ? formatDate(selectedDate) : 'Select a date'}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg p-4 z-50 w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-slate-900">{monthName}</h3>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-semibold text-slate-600 text-center py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="text-center py-1" />
            ))}
            {days.map(day => {
              const isSelected = selectedDate &&
                selectedDate.getFullYear() === currentMonth.getFullYear() &&
                selectedDate.getMonth() === currentMonth.getMonth() &&
                selectedDate.getDate() === day

              const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              const isToday = today.toDateString() === checkDate.toDateString()

              const isPast = isPastDate(day)

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={isPast}
                  className={`text-sm py-1 rounded transition-colors ${
                    isPast
                      ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : isToday
                      ? 'border border-blue-400 text-blue-600 font-semibold'
                      : 'text-slate-900 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Close on outside click helper text */}
          <p className="text-xs text-slate-500 mt-3 text-center">Click a date to select</p>
        </div>
      )}
    </div>
  )
}
