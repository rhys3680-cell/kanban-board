import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shared/libs/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useTags } from "@/features/tags/hooks/useTags";

interface MemoFiltersProps {
  searchQuery: string;
  selectedDate: string;
  selectedTagIds: string[];
  onSearchChange: (query: string) => void;
  onDateChange: (date: string) => void;
  onTagsChange: (tagIds: string[]) => void;
}

export function MemoFilters({
  searchQuery,
  selectedDate,
  selectedTagIds,
  onSearchChange,
  onDateChange,
  onTagsChange,
}: MemoFiltersProps) {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );
  const { tags } = useTags();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onDateChange(format(selectedDate, "yyyy-MM-dd"));
    } else {
      onDateChange("");
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
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
        <div className="space-y-2">
          <Label>Filter by Tags</Label>
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              태그가 없습니다. Tags 페이지에서 만들어보세요.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {(searchQuery || selectedDate || selectedTagIds.length > 0) && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onSearchChange("");
              onDateChange("");
              onTagsChange([]);
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
