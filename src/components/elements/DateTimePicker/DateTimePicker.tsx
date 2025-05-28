"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({
  date,
  setDate,
  className,
}: DateTimePickerProps) {
  const minutes = [0, 15, 30, 45];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP HH:mm")
            ) : (
              <span>Pilih tanggal & waktu</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                const newDate = new Date(selectedDate);
                newDate.setHours(date.getHours());
                newDate.setMinutes(date.getMinutes());
                setDate(newDate);
              }
            }}
            initialFocus
          />
          <div className="border-t border-border p-3 flex gap-2">
            <Select
              value={date.getHours().toString()}
              onValueChange={(value) => {
                const newDate = new Date(date);
                newDate.setHours(parseInt(value));
                setDate(newDate);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jam" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={date.getMinutes().toString()}
              onValueChange={(value) => {
                const newDate = new Date(date);
                newDate.setMinutes(parseInt(value));
                setDate(newDate);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Menit" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
