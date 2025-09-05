'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTracker } from '@/store/useTracker';
import { Navigation } from '@/components/navigation';
import { mondayOfWeekISO, formatISO } from '@/lib/dates';
import { formatDateLong } from '@/lib/ui';
import { parseISO, addDays } from 'date-fns';
import { Calendar, Target, Save } from 'lucide-react';
import type { Category } from '@/types/tracker';

const CATEGORIES: Category[] = ['SQL', 'Python', 'LeetCode', 'SystemDesign', 'Behavioral', 'MockInterview'];

export default function PlannerPage() {
  const { weeks, applyWeekGoals, setWeekGoals } = useTracker();
  const [weekStartISO, setWeekStartISO] = useState<string>('');
  const [weekGoals, setWeekGoalsState] = useState<Partial<Record<Category, number>>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Default to current week's Monday
      const today = new Date();
      const monday = mondayOfWeekISO(formatISO(today));
      setWeekStartISO(monday);
      
      // Load existing goals for this week
      const existingGoals = weeks[monday];
      if (existingGoals) {
        setWeekGoalsState(existingGoals.goals);
      }
    }
  }, [mounted, weeks]);

  const handleGoalChange = (category: Category, value: string) => {
    const numValue = value === '' ? undefined : parseInt(value, 10);
    setWeekGoalsState(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleApplyGoals = () => {
    if (!weekStartISO) return;
    
    // Save the week goals first
    setWeekGoals(weekStartISO, weekGoals);
    // Then apply them to the calendar
    applyWeekGoals(weekStartISO);
  };

  if (!mounted) {
    return (
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
    );
  }

  const weekStartDate = weekStartISO ? parseISO(weekStartISO) : new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6" />
            <div>
              <h1 className="text-3xl font-bold">Weekly Planner</h1>
              <p className="text-muted-foreground mt-1">
                Set weekly goals and distribute them across the week
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Week Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="week-start">Week Starting (Monday)</Label>
                <Input
                  id="week-start"
                  type="date"
                  value={weekStartISO}
                  onChange={(e) => setWeekStartISO(e.target.value)}
                  className="w-auto"
                />
              </div>
              {weekStartISO && (
                <div className="text-sm text-muted-foreground">
                  {formatDateLong(weekStartDate)} - {formatDateLong(addDays(weekStartDate, 6))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((category) => (
                <div key={category} className="space-y-2">
                  <Label htmlFor={`goal-${category}`}>{category}</Label>
                  <Input
                    id={`goal-${category}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={weekGoals[category] || ''}
                    onChange={(e) => handleGoalChange(category, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button onClick={handleApplyGoals} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Apply to This Week
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Week Preview */}
        {weekStartISO && (
          <Card>
            <CardHeader>
              <CardTitle>Week Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => {
                  const dayISO = formatISO(day);
                  const isWeekend = index >= 5;
                  return (
                    <div
                      key={dayISO}
                      className={`p-3 rounded-lg border text-center ${
                        isWeekend ? 'bg-muted/50' : 'bg-background'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {day.toLocaleDateString('en', { weekday: 'short' })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.getDate()}
                      </div>
                      {isWeekend && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Rest
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Goals will be distributed across weekdays (Monday-Friday). 
                Weekends are rest days and will not be affected.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template Editor (TODO) */}
        <Card>
          <CardHeader>
            <CardTitle>Template Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              <p>Customize default task templates for each category.</p>
              <p className="text-sm mt-2">
                <em>Coming soon: Edit default targets and units per category.</em>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
