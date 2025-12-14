import { useState } from "react";
import { Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Service } from "@/data/mock";

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: (serviceId: string) => void;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md",
        selected && "ring-2 ring-primary shadow-lg scale-[1.02]"
      )}
      onClick={() => !selected && onSelect(service.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{service.price}</span>
              </div>
            </div>
          </div>
          {selected && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("");
              }}
            >
              Selected
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {isOpen ? "Hide details" : "Show details"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <CardDescription className="text-sm">
              {service.description}
            </CardDescription>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
