'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTracker } from '@/store/useTracker';
import { Navigation } from '@/components/navigation';
import { Settings as SettingsIcon, Download, Upload, Trash2, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { 
    settings, 
    setSettings, 
    exportJSON, 
    importJSON 
  } = useTracker();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (mounted) {
      // Check for dark mode preference
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    }
  }, [mounted]);

  const handleSettingChange = (key: keyof typeof settings, value: string | number | boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setSettings(newSettings, key === 'interviewDateISO' || key === 'studyStartISO');
  };

  const handleExport = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meta-prep-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (replace: boolean = false) => {
    try {
      importJSON(importData, replace);
      setImportData('');
      alert('Data imported successfully!');
    } catch {
      alert('Failed to import data. Please check the JSON format.');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('mpt-v1');
    window.location.reload();
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('mpt-theme', newDarkMode ? 'dark' : 'light');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        handleSettingChange('notificationsEnabled', true);
      }
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6" />
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Configure your study plan and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Study Plan Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Study Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interview-date">Interview Date</Label>
                <Input
                  id="interview-date"
                  type="date"
                  value={localSettings.interviewDateISO}
                  onChange={(e) => handleSettingChange('interviewDateISO', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="study-start">Study Start Date</Label>
                <Input
                  id="study-start"
                  type="date"
                  value={localSettings.studyStartISO}
                  onChange={(e) => handleSettingChange('studyStartISO', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="rest-weekends"
                checked={localSettings.everyOtherWeekendRest}
                onCheckedChange={(checked) => handleSettingChange('everyOtherWeekendRest', checked)}
              />
              <Label htmlFor="rest-weekends">Alternating rest weekends</Label>
            </div>
          </CardContent>
        </Card>

        {/* Pomodoro Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="focus-minutes">Focus Duration (minutes)</Label>
                <Input
                  id="focus-minutes"
                  type="number"
                  min="1"
                  value={localSettings.pomodoroMinutes}
                  onChange={(e) => handleSettingChange('pomodoroMinutes', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="short-break">Short Break (minutes)</Label>
                <Input
                  id="short-break"
                  type="number"
                  min="1"
                  value={localSettings.shortBreakMinutes}
                  onChange={(e) => handleSettingChange('shortBreakMinutes', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="long-break">Long Break (minutes)</Label>
                <Input
                  id="long-break"
                  type="number"
                  min="1"
                  value={localSettings.longBreakMinutes}
                  onChange={(e) => handleSettingChange('longBreakMinutes', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="long-break-every">Long Break Every</Label>
                <Input
                  id="long-break-every"
                  type="number"
                  min="1"
                  value={localSettings.longBreakEvery}
                  onChange={(e) => handleSettingChange('longBreakEvery', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={localSettings.notificationsEnabled || false}
                onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
              />
              <Label htmlFor="notifications">Enable notifications</Label>
              {!localSettings.notificationsEnabled && (
                <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                  Request Permission
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
              <Label htmlFor="dark-mode" className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Dark mode
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Data</DialogTitle>
                    <DialogDescription>
                      Paste your exported JSON data below to restore your progress.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                      placeholder="Paste JSON data here..."
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="replace-data"
                        className="rounded"
                      />
                      <Label htmlFor="replace-data">Replace all existing data</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => handleImport(false)}
                      disabled={!importData.trim()}
                    >
                      Merge Data
                    </Button>
                    <Button 
                      onClick={() => handleImport(true)}
                      disabled={!importData.trim()}
                      variant="destructive"
                    >
                      Replace All
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Reset All
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset All Data</DialogTitle>
                    <DialogDescription>
                      This will permanently delete all your progress, settings, and data. 
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReset}>
                      Reset Everything
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
