"use client"

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Planner</h1>
        <p className="text-muted-foreground mb-8">
          Set weekly goals and customize daily templates
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Weekly Goals</h2>
            <p className="text-muted-foreground mb-4">
              Set your weekly targets for each category and distribute them across the week.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Configure Goals
            </button>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Daily Templates</h2>
            <p className="text-muted-foreground mb-4">
              Customize default tasks and targets for study days and rest days.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Edit Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
