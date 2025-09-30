"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import dayjs from "dayjs"

import { Button } from "../components/button"
import { Calendar } from "../components/calendar"
import { Input } from "../components/input"
import { Label } from "../components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/popover"

import { ptBR } from "date-fns/locale"

interface DatePickerProps {
  label?: string
  placeholder?: string
  value?: Date
  onChange?: (value: Date) => void
  name?: string
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  label = "",
  placeholder = "Selecione uma data",
  value: propValue,
  onChange,
  name,
  className,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(propValue)
  const [month, setMonth] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    setDate(propValue)
    setMonth(propValue)
  }, [propValue])

  const isDateDisabled = (date: Date) => {
    if (minDate && dayjs(date).isBefore(dayjs(minDate), "day")) {
      return true
    }
    if (maxDate && dayjs(date).isAfter(dayjs(maxDate), "day")) {
      return true
    }
    return false
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <Label htmlFor={name} className="px-1">
          {label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id={name}
          name={name}
          value={date ? dayjs(date).format('l') : ""}
          placeholder={placeholder}
          readOnly
          onClick={() => setOpen(true)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="text"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              required
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              locale={ptBR}
              onMonthChange={setMonth}
              onSelect={(selectedDate: Date) => {
                if (!isDateDisabled(selectedDate!)) {
                  setDate(selectedDate)
                  setMonth(selectedDate)
                  onChange?.(selectedDate!)
                  setOpen(false)
                }
              }}
              disabled={(date: Date) => isDateDisabled(date)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
