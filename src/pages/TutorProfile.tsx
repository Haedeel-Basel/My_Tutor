import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTutorById } from '@/data/tutors';
import { supabase } from '@/integrations/supabase/client';
import { Star, Clock, DollarSign, Calendar, Globe, GraduationCap, Languages, MapPin, ArrowLeft } from 'lucide-react';

const TutorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!id) return;
      
      // First try to get from static data
      const staticTutor = getTutorById(id);
      if (staticTutor) {
        setTutor(staticTutor);
        setLoading(false);
        return;
      }
      
      // If not found in static data, try database
      try {
        const { data, error } = await supabase
          .from('tutors')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform database tutor to match expected format
          setTutor({
            id: data.id,
            name: data.name,
            subject: data.subject,
            rating: parseFloat(data.rating.toString()),
            reviewCount: data.review_count,
            hourlyRate: data.hourly_rate,
            image: data.image || '/placeholder.svg',
            bio: data.bio,
            experience: data.experience || '1+ years',
            education: data.education || '',
            languages: data.languages || ['English'],
            timezone: data.timezone || 'UTC',
            specialties: data.specialties || [data.subject],
            availability: 'Available'
          });
        }
      } catch (error) {
        console.error('Error fetching tutor:', error);
      }
      
      setLoading(false);
    };
    
    fetchTutor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Tutor not found</h1>
            <Button asChild>
              <Link to="/tutors">Browse All Tutors</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/tutors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tutors
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card className="bg-gradient-card">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img 
                      src={tutor.image} 
                      alt={tutor.name}
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20 mx-auto md:mx-0"
                    />
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-3xl font-bold mb-2">{tutor.name}</h1>
                      <p className="text-xl text-muted-foreground mb-4">{tutor.subject} Tutor</p>
                      
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{tutor.rating}</span>
                          <span className="text-muted-foreground">({tutor.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="h-5 w-5" />
                          <span className="font-medium">${tutor.hourlyRate}/hour</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-5 w-5" />
                          <span>{tutor.availability}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {tutor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About {tutor.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">{tutor.bio}</p>
                </CardContent>
              </Card>

              {/* Experience & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Experience</h3>
                    </div>
                    <p className="text-muted-foreground">{tutor.experience} years of teaching experience</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Education</h3>
                    </div>
                    <p className="text-muted-foreground">{tutor.education}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Languages className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Languages</h3>
                    </div>
                    <p className="text-muted-foreground">{tutor.languages.join(', ')}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Timezone</h3>
                    </div>
                    <p className="text-muted-foreground">{tutor.timezone}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                     <div className="text-3xl font-bold text-primary mb-2">
                       ${tutor.hourlyRate || 0}<span className="text-lg text-muted-foreground">/hour</span>
                     </div>
                    <p className="text-muted-foreground">{tutor.availability}</p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link to={`/book/${tutor.id}`}>
                        <Calendar className="h-5 w-5 mr-2" />
                        Book a Session
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Send Message
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-3">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response time:</span>
                        <span className="font-medium">Within 1 hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lessons taught:</span>
                        <span className="font-medium">500+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Student satisfaction:</span>
                        <span className="font-medium">98%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorProfile;