'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTracker } from '@/store/useTracker';
import { Play, Pause, RotateCcw, Timer, Volume2, VolumeX, Clock } from 'lucide-react';

type TimerState = 'idle' | 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  dateISO: string;
  onCompleteFocus?: () => void;
}

const PRESETS = [
  { name: 'Classic', focus: 25, short: 5, long: 15 },
  { name: 'Extended', focus: 50, short: 10, long: 20 },
  { name: 'Quick', focus: 15, short: 3, long: 10 },
  { name: 'Deep Work', focus: 90, short: 15, long: 30 },
];

export function PomodoroTimer({ dateISO, onCompleteFocus }: PomodoroTimerProps) {
  const { settings, incrementPomodoro, setSettings } = useTracker();
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [focusCount, setFocusCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPresets, setShowPresets] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element for notifications
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
  }, []);

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

  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore errors if audio can't play
      });
    }
  };

  const startTimer = () => {
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
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
    setTimeout(() => startTimer(), 0);
  };

  const startBreakSession = (breakType: 'shortBreak' | 'longBreak') => {
    setState(breakType);
    const duration = getDuration(breakType);
    setTimeLeft(duration);
    setTimeout(() => startTimer(), 0);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setSettings({
      pomodoroMinutes: preset.focus,
      shortBreakMinutes: preset.short,
      longBreakMinutes: preset.long,
    });
    setShowPresets(false);
    resetTimer();
  };

  const handleComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }

    // Play sound notification
    playSound();

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (state === 'idle') {
            startFocusSession();
          } else if (isRunning) {
            pauseTimer();
          } else {
            startTimer();
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetTimer();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setShowPresets(!showPresets);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state, isRunning, showPresets]);

  // Tab close warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning && state !== 'idle') {
        e.preventDefault();
        e.returnValue = 'You have an active Pomodoro session. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning, state]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Pomodoro Timer
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
              title="Quick presets (P)"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPresets && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Quick Presets:</div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="text-xs"
                >
                  {preset.name}
                  <br />
                  <span className="text-muted-foreground">
                    {preset.focus}/{preset.short}/{preset.long}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

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

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>Focus sessions: {focusCount}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {settings.pomodoroMinutes}/{settings.shortBreakMinutes}/{settings.longBreakMinutes}
            </Badge>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <div>Keyboard shortcuts:</div>
          <div className="flex justify-center gap-4">
            <span>Space: {state === 'idle' ? 'Start' : isRunning ? 'Pause' : 'Resume'}</span>
            <span>R: Reset</span>
            <span>P: Presets</span>
          </div>
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
