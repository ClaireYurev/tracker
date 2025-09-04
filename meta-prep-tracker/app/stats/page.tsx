"use client"

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Statistics</h1>
        <p className="text-muted-foreground mb-8">
          View your progress charts and performance metrics
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-muted-foreground">Total Pomodoros</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">0%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-muted-foreground">Days Studied</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Progress Chart</h2>
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
              Progress chart will appear here
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
            <div className="space-y-2">
              {['SQL', 'Python', 'LeetCode', 'System Design', 'Behavioral', 'Mock Interview'].map((category) => (
                <div key={category} className="flex justify-between items-center">
                  <span>{category}</span>
                  <span className="text-sm text-muted-foreground">0/0</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
