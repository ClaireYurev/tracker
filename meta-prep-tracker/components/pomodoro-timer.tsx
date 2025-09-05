'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTracker } from '@/store/useTracker';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

type TimerState = 'idle' | 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  dateISO: string;
  onCompleteFocus?: () => void;
}

export function PomodoroTimer({ dateISO, onCompleteFocus }: PomodoroTimerProps) {
  const { settings, incrementPomodoro } = useTracker();
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [focusCount, setFocusCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getDuration = (timerState: TimerState) => {
    switch (timerState) {
      case 'focus': return settings.pomodoroMinutes * 60;
      case 'shortBreak': return settings.shortBreakMinutes * 60;
      case 'longBreak': return settings.longBreakMinutes * 60;
      default: return 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    console.log("Starting timer, current timeLeft:", timeLeft);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    console.log("Pausing timer");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    setIsRunning(false);
    }
  };

  const resetTimer = () => {
    console.log("Resetting timer");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    setIsRunning(false);
    }
    setState('idle');
    setTimeLeft(0);
    setIsRunning(false);
  };

  const startFocusSession = () => {
    setState('focus');
    const duration = getDuration('focus');
    setTimeLeft(duration);
    // Start timer after state is updated
    setTimeout(() => startTimer(), 0);
  };

  const startBreakSession = (breakType: 'shortBreak' | 'longBreak') => {
    setState(breakType);
    const duration = getDuration(breakType);
    setTimeLeft(duration);
    // Start timer after state is updated
    setTimeout(() => startTimer(), 0);
  };

  const handleComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    setIsRunning(false);
    }

    if (state === 'focus') {
      incrementPomodoro(dateISO);
      onCompleteFocus?.();
      setFocusCount(prev => prev + 1);
      
      // Transition to break
      if ((focusCount + 1) % settings.longBreakEvery === 0) {
        startBreakSession('longBreak');
      } else {
        startBreakSession('shortBreak');
      }
    } else {
      // Break completed, go back to focus
      startFocusSession();
    }
    
    // Send notification if enabled
    if (settings.notificationsEnabled && 'Notification' in window) {
      const message = state === 'focus' 
        ? 'Focus session complete! Time for a break.' 
        : 'Break time is over! Ready to focus?';
      new Notification('Pomodoro Timer', { body: message });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // isRunning is now a state variable

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground capitalize">
            {state === 'idle' ? 'Ready to start' : state.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          {state === 'idle' ? (
            <Button onClick={startFocusSession} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Focus
            </Button>
          ) : (
            <>
              {!isRunning ? (
                <Button onClick={startTimer} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="outline" className="flex-1">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetTimer} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground">
          Focus sessions completed: {focusCount}
        </div>

        {!settings.notificationsEnabled && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={requestNotificationPermission}
            className="w-full"
          >
            Enable Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
