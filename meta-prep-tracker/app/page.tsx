'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useTracker } from '@/store/useTracker';
import { PomodoroTimer } from '@/components/pomodoro-timer';
import { Navigation } from '@/components/navigation';
import { formatDateLong, formatISO } from '@/lib/ui';
import { parseISO, differenceInDays } from 'date-fns';
import { Plus, Minus, Calendar, Target, Clock } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const { 
    days, 
    settings, 
    initCalendar, 
    setTaskProgress, 
    toggleTaskComplete, 
    setTaskNotes, 
    upsertDay,
    incrementPomodoro,
    seedDemoData,
    hasSeededDemoData
  } = useTracker();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize calendar and seed demo data on mount
  useEffect(() => {
    if (mounted) {
      // Seed demo data if not already seeded
      if (!hasSeededDemoData) {
        seedDemoData();
      }
      
      // Initialize calendar if no days exist
      if (Object.keys(days).length === 0) {
        initCalendar(settings.interviewDateISO);
      }
    }
  }, [mounted, days, settings, initCalendar, seedDemoData, hasSeededDemoData]);

  // Get date from URL params or default to today
  useEffect(() => {
    if (mounted) {
      const dateParam = searchParams.get('date');
      const today = formatISO(new Date());
      setSelectedDate(dateParam || today);
    }
  }, [mounted, searchParams]);

  // Show loading state until mounted
  // Show simple loading state until mounted - NO Navigation component
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const dayEntry = days[selectedDate];
  const dateObj = parseISO(selectedDate);
  const daysUntilInterview = differenceInDays(parseISO(settings.interviewDateISO), dateObj);
  const isRestDay = dayEntry?.isRestDay || false;

  const handleTaskProgress = (taskId: string, delta: number) => {
    if (!dayEntry) return;
    const task = dayEntry.tasks.find(t => t.id === taskId);
    if (!task) return;
    setTaskProgress(selectedDate, taskId, task.done + delta);
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    toggleTaskComplete(selectedDate, taskId, completed);
  };

  const handleTaskNotes = (taskId: string, notes: string) => {
    setTaskNotes(selectedDate, taskId, notes);
  };

  const handleDayNotes = (notes: string) => {
    if (!dayEntry) return;
    upsertDay({ ...dayEntry, notes });
  };

  const handleBlockToggle = (blockIndex: number) => {
    if (!dayEntry) return;
    const newBlocks = dayEntry.blocksCompleted === blockIndex ? 0 : blockIndex;
    upsertDay({ ...dayEntry, blocksCompleted: newBlocks });
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === '+') {
      e.preventDefault();
      handleTaskProgress(taskId, 1);
    } else if (e.key === '-') {
      e.preventDefault();
      handleTaskProgress(taskId, -1);
    }
  };

  if (!dayEntry) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">No data for {selectedDate}</h1>
          <p className="text-muted-foreground">This date is not in your study plan.</p>
        </div>
      </div>
    );
  }

  const completedTasks = dayEntry.tasks.filter(t => t.completed || (t.target && t.done >= t.target)).length;
  const totalTasks = dayEntry.tasks.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {formatDateLong(dateObj)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isRestDay ? "secondary" : "default"}>
                {isRestDay ? "Rest Day" : "Study Day"}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {daysUntilInterview} days until interview
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Ribbon */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {completedTasks}/{totalTasks} tasks completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {dayEntry.pomodoros || 0} focus blocks logged
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Today&apos;s Tasks</h2>
            {dayEntry.tasks.map((task) => (
              <Card key={task.id} className="focus-within:ring-2 focus-within:ring-ring">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.done} / {task.target || '∞'} {task.unit}
                      </div>
                    </div>
                    <Checkbox
                      checked={task.completed || (task.target ? task.done >= task.target : false)}
                      onCheckedChange={(checked) => handleTaskComplete(task.id, !!checked)}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTaskProgress(task.id, -1)}
                      onKeyDown={(e) => handleKeyDown(e, task.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-mono min-w-[3rem] text-center">
                      {task.done}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTaskProgress(task.id, 1)}
                      onKeyDown={(e) => handleKeyDown(e, task.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Textarea
                    placeholder="Task notes..."
                    value={task.notes || ''}
                    onChange={(e) => handleTaskNotes(task.id, e.target.value)}
                    className="text-sm"
                    rows={2}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pomodoro Timer */}
            <PomodoroTimer 
              dateISO={selectedDate} 
              onCompleteFocus={() => incrementPomodoro(selectedDate)}
            />

            {/* Daily Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Reflect on your progress..."
                  value={dayEntry.notes || ''}
                  onChange={(e) => handleDayNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Focus Blocks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Focus Blocks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  Mark completed focus blocks
                </div>
                {['Morning', 'Afternoon', 'Evening'].map((label, index) => (
                  <div key={label} className="flex items-center justify-between">
                    <Label htmlFor={`block-${index}`} className="text-sm">
                      {label}
                    </Label>
                    <Switch
                      id={`block-${index}`}
                      checked={(dayEntry.blocksCompleted || 0) > index}
                      onCheckedChange={() => handleBlockToggle(index + 1)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
