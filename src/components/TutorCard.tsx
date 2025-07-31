import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TutorCardProps {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  image: string;
  specialties: string[];
  availability: string;
}

const TutorCard = ({ 
  id, 
  name, 
  subject, 
  rating, 
  reviewCount, 
  hourlyRate, 
  image, 
  specialties, 
  availability 
}: TutorCardProps) => {
  return (
    <Card className="group bg-gradient-card hover:shadow-elevated transition-all duration-300 hover:scale-105 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img 
            src={image} 
            alt={name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{subject} Tutor</p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-muted-foreground">({reviewCount})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {specialties.slice(0, 2).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {specialties.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{specialties.length - 2} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">${hourlyRate}/hr</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{availability}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to={`/tutor/${id}`}>View Profile</Link>
              </Button>
              <Button size="sm" asChild className="flex-1">
                <Link to={`/book/${id}`}>Book Session</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCard;