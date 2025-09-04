"use client"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Track your daily progress and stay focused on your Meta interview preparation
        </p>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold">6</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold">0%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Pomodoros</div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
            <div className="space-y-3">
              {[
                { title: 'SQL Practice', category: 'SQL', target: 4, unit: 'questions' },
                { title: 'Python Coding', category: 'Python', target: 1, unit: 'problems' },
                { title: 'LeetCode Problems', category: 'LeetCode', target: 2, unit: 'problems' },
                { title: 'System Design Study', category: 'SystemDesign', target: 45, unit: 'minutes' },
                { title: 'Behavioral Prep', category: 'Behavioral', target: 20, unit: 'minutes' },
              ].map((task, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{task.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Target: {task.target} {task.unit}
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      +
                    </button>
                    <span className="px-3 py-1 text-sm">0 / {task.target}</span>
                    <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400">
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Tools</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Pomodoro Timer</h3>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold mb-2">50:00</div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Start Focus Session
                  </button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Daily Notes</h3>
                <textarea 
                  className="w-full h-24 p-2 border rounded text-sm resize-none"
                  placeholder="Reflect on your day, note insights, or plan for tomorrow..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
