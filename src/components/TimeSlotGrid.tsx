import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/data/mock";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  selectedDate: Date;
}

export function TimeSlotGrid({ slots, selectedTime, onSelect, selectedDate }: TimeSlotGridProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDateLabel = () => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No available time slots for this date</p>
        <p className="text-sm text-muted-foreground mt-1">Please select another date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium">{getDateLabel()}</h3>
        <p className="text-xs text-muted-foreground">{slots.filter(s => s.available).length} available</p>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? "default" : "outline"}
              size="sm"
              disabled={!slot.available}
              onClick={() => onSelect(slot.time)}
              className={cn(
                "transition-all duration-200",
                selectedTime === slot.time && "scale-105 shadow-md",
                slot.available && "hover:scale-105 active:scale-95"
              )}
            >
              {formatTime(slot.time)}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
