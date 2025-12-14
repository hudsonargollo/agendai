export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

export interface Provider {
  name: string;
  avatar: string;
  businessName: string;
  slug: string;
  verified: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
}

export const mockProvider: Provider = {
  name: "Sarah Johnson",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  businessName: "Glowing Beauty Studio",
  slug: "glowing-beauty",
  verified: true,
};

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Classic Haircut",
    duration: 45,
    price: 35,
    description: "Professional haircut with wash and style. Includes consultation to achieve your desired look.",
  },
  {
    id: "2",
    name: "Hair Color",
    duration: 120,
    price: 85,
    description: "Full color treatment with premium products. Root touch-up or full color available.",
  },
  {
    id: "3",
    name: "Manicure",
    duration: 30,
    price: 25,
    description: "Classic manicure with nail shaping, cuticle care, and polish application.",
  },
  {
    id: "4",
    name: "Facial Treatment",
    duration: 60,
    price: 65,
    description: "Deep cleansing facial with extraction, mask, and moisturizer. Customized for your skin type.",
  },
  {
    id: "5",
    name: "Massage Therapy",
    duration: 90,
    price: 95,
    description: "Full body relaxation massage with aromatherapy oils. Choose from Swedish or deep tissue.",
  },
];

// Working hours: 9 AM - 6 PM (Lunch break 12-1 PM)
export const generateTimeSlots = (selectedDate: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const day = selectedDate.getDay();
  
  // Sunday is closed
  if (day === 0) {
    return [];
  }

  // Generate 30-minute intervals from 9 AM to 6 PM
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      
      // Lunch break: 12:00-13:00
      const isLunchBreak = hour === 12;
      
      slots.push({
        time,
        available: !isLunchBreak,
      });
    }
  }

  return slots;
};

export const isDateAvailable = (date: Date): boolean => {
  const day = date.getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Disable Sundays and past dates
  return day !== 0 && date >= today;
};

// LocalStorage helpers
const STORAGE_KEY = "glup_bookings";

export const getBookings = (): Booking[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBooking = (booking: Omit<Booking, "id" | "createdAt">): Booking => {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `booking_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return newBooking;
};
