import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shared/libs/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface MemoFiltersProps {
  searchQuery: string;
  selectedDate: string;
  onSearchChange: (query: string) => void;
  onDateChange: (date: string) => void;
}

export function MemoFilters({
  searchQuery,
  selectedDate,
  onSearchChange,
  onDateChange,
}: MemoFiltersProps) {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onDateChange(format(selectedDate, "yyyy-MM-dd"));
    } else {
      onDateChange("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Filter by Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ko }) : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </div>
        {(searchQuery || selectedDate) && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onSearchChange("");
              onDateChange("");
              setDate(undefined);
            }}
          >
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
