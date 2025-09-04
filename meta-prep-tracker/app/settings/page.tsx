"use client"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-muted-foreground mb-8">
          Configure your interview date, preferences, and manage your data
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Interview Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Interview Date</label>
                <input 
                  type="date" 
                  defaultValue="2025-10-20"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Study Start Date</label>
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="weekend-rest" defaultChecked className="mr-2" />
                <label htmlFor="weekend-rest">Every other weekend rest</label>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Pomodoro Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Work Time (minutes)</label>
                <input 
                  type="number" 
                  defaultValue="50"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Short Break (minutes)</label>
                <input 
                  type="number" 
                  defaultValue="10"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Long Break (minutes)</label>
                <input 
                  type="number" 
                  defaultValue="20"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Export Data
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Import Data
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
