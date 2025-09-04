"use client"

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Meta Prep Tracker</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Track your Meta interview preparation progress with a comprehensive dashboard, 
          calendar, and analytics to help you succeed.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
          >
            Start Tracking
          </Link>
          <Link 
            href="/plan"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
          >
            View Planner
          </Link>
        </div>

        {/* Feature Cards with Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p className="text-muted-foreground mb-4">Track daily tasks and progress</p>
            <Link 
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Calendar</h2>
            <p className="text-muted-foreground mb-4">Monthly view with progress</p>
            <Link 
              href="/calendar"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View Calendar
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Statistics</h2>
            <p className="text-muted-foreground mb-4">View progress charts</p>
            <Link 
              href="/stats"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View Stats
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-muted-foreground mb-4">Configure preferences</p>
            <Link 
              href="/settings"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View Settings
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Meta Prep?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of developers who are preparing for their Meta interviews with our comprehensive tracking tool.
          </p>
          <Link 
            href="/dashboard"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}
