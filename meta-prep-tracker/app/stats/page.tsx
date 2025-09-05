'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTracker } from '@/store/useTracker';
import { Navigation } from '@/components/navigation';
import { parseISO, format, subDays } from 'date-fns';
import { BarChart3, TrendingUp, Target, Clock, Calendar } from 'lucide-react';
import type { Category } from '@/types/tracker';

// Dynamically import recharts to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

const CATEGORIES: Category[] = ['SQL', 'Python', 'LeetCode', 'SystemDesign', 'Behavioral', 'MockInterview'];

export default function StatsPage() {
  const { days } = useTracker();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-80 bg-muted rounded mb-8"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate daily completion data
  const dailyData = Object.entries(days)
    .map(([dateISO, dayEntry]) => {
      const completedTasks = dayEntry.tasks.filter(t => 
        t.completed || (t.target && t.done >= t.target)
      ).length;
      const totalTasks = dayEntry.tasks.length;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      return {
        date: format(parseISO(dateISO), 'MMM dd'),
        dateISO,
        completed: completedTasks,
        total: totalTasks,
        completionRate: Math.round(completionRate),
        pomodoros: dayEntry.pomodoros || 0,
        isRestDay: dayEntry.isRestDay || false
      };
    })
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  // Calculate weekly data by category
  const weeklyData = CATEGORIES.map(category => {
    const categoryTasks = Object.values(days)
      .flatMap(day => day.tasks.filter(task => task.category === category));
    
    const completed = categoryTasks.filter(task => 
      task.completed || (task.target && task.done >= task.target)
    ).length;
    const total = categoryTasks.length;
    
    return {
      category,
      completed,
      total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  // Calculate KPIs
  const totalPomodoros = Object.values(days).reduce((sum, day) => sum + (day.pomodoros || 0), 0);
  
  // Calculate streak (consecutive non-rest days with at least 1 completed task)
  let streak = 0;
  const sortedDays = Object.entries(days)
    .sort(([a], [b]) => b.localeCompare(a)); // Most recent first
  
  for (const [, dayEntry] of sortedDays) {
    if (dayEntry.isRestDay) continue;
    const hasCompletedTask = dayEntry.tasks.some(t => 
      t.completed || (t.target && t.done >= t.target)
    );
    if (hasCompletedTask) {
      streak++;
    } else {
      break;
    }
  }

  // Calculate last 14 days completion rate
  const last14Days = Object.entries(days)
    .filter(([dateISO]) => {
      const date = parseISO(dateISO);
      const cutoff = subDays(new Date(), 14);
      return date >= cutoff;
    });

  const last14DaysCompleted = last14Days.reduce((sum, [, dayEntry]) => {
    return sum + dayEntry.tasks.filter(t => 
      t.completed || (t.target && t.done >= t.target)
    ).length;
  }, 0);

  const last14DaysTotal = last14Days.reduce((sum, [, dayEntry]) => {
    return sum + dayEntry.tasks.length;
  }, 0);

  const last14DaysRate = last14DaysTotal > 0 ? Math.round((last14DaysCompleted / last14DaysTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <div>
              <h1 className="text-3xl font-bold">Statistics</h1>
              <p className="text-muted-foreground mt-1">
                Track your progress and performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalPomodoros}</div>
                  <div className="text-sm text-muted-foreground">Total Pomodoros</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{last14DaysRate}%</div>
                  <div className="text-sm text-muted-foreground">Last 14 Days</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{dailyData.length}</div>
                  <div className="text-sm text-muted-foreground">Days Tracked</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Category Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Category Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completionRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyData.map(({ category, completed, total, completionRate }) => (
                <div key={category} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{category}</h3>
                    <span className="text-sm text-muted-foreground">{completionRate}%</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {completed} / {total} tasks
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
