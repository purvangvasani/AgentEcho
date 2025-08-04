"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CronSettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCronEnabled, setIsCronEnabled] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('09:00');
  const { toast } = useToast();

  const handleSave = () => {
    // Here you would typically save the settings to a backend or state management
    console.log('Cron Settings Saved:', { isCronEnabled, frequency, time });
    toast({
      title: 'Settings Saved',
      description: 'Your cron job settings have been updated.',
    });
    setIsOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
          <span className="sr-only">Cron Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cron Job Settings</DialogTitle>
          <DialogDescription>
            Configure the automated posting schedule for approved posts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cron-enabled" className="flex flex-col gap-1">
              <span>Enable Auto-Posting</span>
              <span className="font-normal text-muted-foreground text-xs">
                Automatically post content from the 'Approved' column.
              </span>
            </Label>
            <Switch
              id="cron-enabled"
              checked={isCronEnabled}
              onCheckedChange={setIsCronEnabled}
            />
          </div>
          {isCronEnabled && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select
                  value={frequency}
                  onValueChange={setFrequency}
                  name="frequency"
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Select value={time} onValueChange={setTime} name="time">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
