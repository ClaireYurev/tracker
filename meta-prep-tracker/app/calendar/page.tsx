'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTracker } from '@/store/useTracker';
import { Navigation } from '@/components/navigation';
import { 
  startOfMonth, 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  formatISO
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Dot } from 'lucide-react';

export default function CalendarPage() {
  const router = useRouter();
  const { days, seedDemoData, hasSeededDemoData } = useTracker();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentMonth(new Date());
    
    if (!hasSeededDemoData) {
      seedDemoData();
    }
  }, [seedDemoData, hasSeededDemoData]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const monthStart = startOfMonth(currentMonth);

  // Get the first day of the week for the month start
  const firstDayOfWeek = monthStart.getDay();
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - firstDayOfWeek);

  // Create calendar grid (6 weeks)
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }

  const navigateToDate = (date: Date) => {
    const dateISO = formatISO(date);
    router.push(`/?date=${dateISO}`);
  };


  const hasActivity = (date: Date) => {
    const dayEntry = getDayEntry(date);
    const hasCompletedTasks = dayEntry.tasks.some(t => t.completed || (t.target && t.done >= t.target));
    const hasPomodoros = (dayEntry.pomodoros || 0) > 0;
    const hasNotes = dayEntry.notes && dayEntry.notes.trim().length > 0;
    return hasCompletedTasks || hasPomodoros || hasNotes;
  };

  const jumpToToday = () => {
    setCurrentMonth(new Date());
  };

  const getDayEntry = (date: Date) => {
    const dateISO = formatISO(date);
    return days[dateISO];
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-6 w-6" />
              <div>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground mt-1">
                  Monthly view with progress tracking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={jumpToToday}
                className="mr-2"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-medium min-w-[200px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((date, index) => {
                const dayEntry = getDayEntry(date);
                const isCurrentMonth = isSameMonth(date, currentMonth);
                const isCurrentDay = isToday(date);
                const hasData = !!dayEntry;

                if (!isCurrentMonth) {
                  return (
                    <div
                      key={index}
                      className="p-2 h-20 border border-transparent"
                    />
                  );
                }

                const completedTasks = dayEntry?.tasks.filter(t => 
                  t.completed || (t.target && t.done >= t.target)
                ).length || 0;
                const totalTasks = dayEntry?.tasks.length || 0;

                return (
                  <div
                    key={index}
                    className={`p-2 h-20 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      isCurrentDay ? 'bg-primary/10 border-primary' : 'border-border'
                    } ${!hasData ? 'opacity-50' : ''}`}
                    onClick={() => hasData && navigateToDate(date)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${
                          isCurrentDay ? 'text-primary' : ''
                        }`}>
                          {format(date, 'd')}
                        </span>
                        {dayEntry?.isRestDay && (
                          <Dot className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      
                      {hasData && (
                        <div className="flex-1 flex flex-col justify-end">
                          <Badge 
                            variant={completedTasks === totalTasks ? "default" : "secondary"}
                            className="text-xs w-fit"
                          >
                            {completedTasks}/{totalTasks}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">2/5</Badge>
            <span>All tasks completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">1/5</Badge>
            <span>Partial completion</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot className="h-3 w-3" />
            <span>Rest day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
