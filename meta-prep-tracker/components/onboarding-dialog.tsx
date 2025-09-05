'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTracker } from '@/store/useTracker';
import { formatISO } from '@/lib/ui';
import { Calendar, Target, Zap } from 'lucide-react';

export function OnboardingDialog() {
  const { setSettings, initCalendar } = useTracker();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    studyStartISO: '',
    interviewDateISO: '2025-10-20',
    everyOtherWeekendRest: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Set default study start date to today
      setFormData(prev => ({
        ...prev,
        studyStartISO: formatISO(new Date())
      }));

      // Check if this is the first run (no persisted data)
      const hasData = localStorage.getItem('mpt-v1');
      if (!hasData) {
        setIsOpen(true);
      }
    }
  }, [mounted]);

  const handleSubmit = () => {
    setSettings(formData, true);
    initCalendar(formData.interviewDateISO);
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Welcome to Tech Screen Prep Tracker!
          </DialogTitle>
          <DialogDescription>
            Let&apos;s set up your personalized study plan to prepare for your Meta interview.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="study-start">Study Start Date</Label>
            <Input
              id="study-start"
              type="date"
              value={formData.studyStartISO}
              onChange={(e) => handleInputChange('studyStartISO', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="interview-date">Interview Date</Label>
            <Input
              id="interview-date"
              type="date"
              value={formData.interviewDateISO}
              onChange={(e) => handleInputChange('interviewDateISO', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="rest-weekends"
              checked={formData.everyOtherWeekendRest}
              onCheckedChange={(checked) => handleInputChange('everyOtherWeekendRest', checked)}
            />
            <Label htmlFor="rest-weekends">Alternating rest weekends</Label>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Your calendar will be populated with study days</li>
                  <li>• Rest weekends will be marked automatically</li>
                  <li>• Mock interviews will be scheduled for Tuesdays & Fridays</li>
                  <li>• You can customize everything in Settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Create My Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
