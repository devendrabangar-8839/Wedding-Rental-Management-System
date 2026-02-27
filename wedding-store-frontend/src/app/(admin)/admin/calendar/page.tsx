'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export default function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="space-y-12">
      <h1 className="text-5xl font-black tracking-tighter uppercase">Rental <span className="text-primary italic">Manifest</span></h1>
      <Card className="rounded-[3rem] shadow-2xl overflow-hidden border-none bg-background">
        <CardContent className="p-10">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
