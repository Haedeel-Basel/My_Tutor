import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookOpen, Clock, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { tutors } from '@/data/tutors';

interface BookingCardProps {
  booking: {
    id: string;
    tutor_id: string;
    subject: string;
    date: string;
    time: string;
    status: string;
  };
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const [tutorName, setTutorName] = useState('Unknown Tutor');

  useEffect(() => {
    const fetchTutorName = async () => {
      // Try static data first
      const staticTutor = tutors.find(t => t.id === booking.tutor_id);
      if (staticTutor) {
        setTutorName(staticTutor.name);
        return;
      }

      // Try database
      try {
        const { data: dbTutor } = await supabase
          .from('tutors')
          .select('name')
          .eq('id', booking.tutor_id)
          .single();
        
        if (dbTutor) {
          setTutorName(dbTutor.name);
        }
      } catch (error) {
        console.log('Could not find tutor in database');
      }
    };

    fetchTutorName();
  }, [booking.tutor_id]);

  return (
    <Card className="bg-gradient-card shadow-elevated hover:shadow-glow transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          {tutorName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span>{booking.subject}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(booking.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{booking.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <UserCheck className={`h-4 w-4 ${booking.status === 'confirmed' ? 'text-green-500' : 'text-yellow-500'}`} />
          <span className="capitalize">{booking.status}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;