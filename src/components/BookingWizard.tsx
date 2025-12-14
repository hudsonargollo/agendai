import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServiceCard } from "@/components/ServiceCard";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  mockServices,
  generateTimeSlots,
  isDateAvailable,
  saveBooking,
  type Service,
} from "@/data/mock";

type WizardStep = "service" | "datetime" | "contact" | "success";

interface BookingWizardProps {
  onComplete?: () => void;
}

export function BookingWizard({ onComplete }: BookingWizardProps) {
  const [step, setStep] = useState<WizardStep>("service");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const currentService = mockServices.find((s) => s.id === selectedService);
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleBack = () => {
    if (step === "datetime") {
      setStep("service");
      setSelectedDate(undefined);
      setSelectedTime(null);
    } else if (step === "contact") {
      setStep("datetime");
    }
  };

  const handleContinue = () => {
    if (step === "service" && selectedService) {
      setStep("datetime");
    } else if (step === "datetime" && selectedDate && selectedTime) {
      setStep("contact");
    } else if (step === "contact") {
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const booking = saveBooking({
      serviceId: selectedService,
      date: selectedDate.toISOString(),
      time: selectedTime,
      customerName,
      customerPhone,
    });

    setStep("success");
    
    toast.success("Booking confirmed!", {
      description: `Your appointment for ${currentService?.name} is scheduled.`,
    });

    // Reset after success
    setTimeout(() => {
      setStep("service");
      setSelectedService("");
      setSelectedDate(undefined);
      setSelectedTime(null);
      setCustomerName("");
      setCustomerPhone("");
      onComplete?.();
    }, 5000);
  };

  const canContinue =
    (step === "service" && selectedService) ||
    (step === "datetime" && selectedDate && selectedTime) ||
    (step === "contact" && customerName && customerPhone);

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <CheckCircle2 className="h-20 w-20 text-primary relative" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          Your appointment for <span className="font-semibold text-foreground">{currentService?.name}</span> is scheduled for{" "}
          <span className="font-semibold text-foreground">
            {selectedDate?.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {selectedTime}
          </span>
        </p>
        <Card className="w-full max-w-md mt-4">
          <CardContent className="pt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{customerPhone}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold">${currentService?.price}</span>
            </div>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground mt-6">
          A confirmation would be sent via WhatsApp
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {["service", "datetime", "contact"].map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-12 rounded-full transition-all duration-300",
                step === s
                  ? "bg-primary"
                  : ["service", "datetime", "contact"].indexOf(step) >
                      ["service", "datetime", "contact"].indexOf(s)
                    ? "bg-primary/50"
                    : "bg-muted"
              )}
            />
            {idx < 2 && <div className="h-0.5 w-4 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {step === "service" && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Select a Service</h2>
              <p className="text-muted-foreground">Choose the service you'd like to book</p>
            </div>
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid gap-4">
                {mockServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedService === service.id}
                    onSelect={handleServiceSelect}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {step === "datetime" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Pick Date & Time</h2>
              <p className="text-muted-foreground">
                {currentService?.name} • {currentService?.duration} min • ${currentService?.price}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Date</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => !isDateAvailable(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <TimeSlotGrid
                      slots={timeSlots}
                      selectedTime={selectedTime}
                      onSelect={setSelectedTime}
                      selectedDate={selectedDate}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                      Select a date first
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === "contact" && (
          <div className="space-y-4 animate-fade-in max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Details</h2>
              <p className="text-muted-foreground">We'll send you a confirmation via WhatsApp</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{currentService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${currentService?.price}</span>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 mt-8 sticky bottom-0 bg-background pt-4 border-t">
        {step !== "service" && (
          <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className={cn(
            "flex-1 transition-all duration-200",
            canContinue && "hover:scale-105 active:scale-95"
          )}
        >
          {step === "contact" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Confirm Booking
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
