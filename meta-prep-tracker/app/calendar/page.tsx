"use client"

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Calendar</h1>
        <p className="text-muted-foreground mb-8">
          View your preparation progress and navigate to specific days
        </p>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">
              ←
            </button>
            <span className="font-medium">December 2024</span>
            <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">
              →
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-2 text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="h-20 border rounded-md p-2 text-sm hover:bg-gray-50 cursor-pointer">
                {i > 0 && i < 32 ? i : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
