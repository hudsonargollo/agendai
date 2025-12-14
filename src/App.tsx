import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookingWizard } from "@/components/BookingWizard";
import { Toaster } from "@/components/ui/sonner";
import { mockProvider } from "@/data/mock";
import { CheckCircle2 } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Toaster />
      
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              <AvatarImage src={mockProvider.avatar} alt={mockProvider.name} />
              <AvatarFallback>{mockProvider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold truncate">{mockProvider.businessName}</h1>
                {mockProvider.verified && (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{mockProvider.name}</p>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              @{mockProvider.slug}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <BookingWizard />
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 bg-background">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by Glup • Mobile-first booking made simple</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
