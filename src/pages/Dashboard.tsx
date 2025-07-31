import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TutorCard from '@/components/TutorCard';
import BookingCard from '@/components/BookingCard';
import { tutors } from '@/data/tutors';
import { BookOpen, Users, Clock, CheckCircle, Star, ArrowRight, Mail, Phone, MapPin, Plus, Calendar, UserCheck, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subjects } from '@/data/tutors';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      setProfile(profileData);

      // Get user bookings if student
      if (profileData?.user_type === 'student') {
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('student_id', session.user.id)
          .order('created_at', { ascending: false });
        
        setBookings(bookingsData || []);
      }

      setIsLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/login');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Render different dashboards based on user type
  if (profile?.user_type === 'tutor') {
    return <TutorDashboard user={user} profile={profile} handleSignOut={handleSignOut} />;
  }

  return <StudentDashboard user={user} profile={profile} bookings={bookings} handleSignOut={handleSignOut} />;
};

// Student Dashboard Component
const StudentDashboard = ({ user, profile, bookings, handleSignOut }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">MyTutor</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile?.full_name || user?.email}</span>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center py-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-text bg-clip-text text-transparent">
              Find Your Perfect Tutor
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with expert tutors who can help you achieve your learning goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-primary hover:shadow-elevated transition-all duration-300">
                <Link to="/tutors">Browse All Tutors</Link>
              </Button>
            </div>
          </section>

          {/* My Bookings Section */}
          {bookings.length > 0 && (
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">My Booked Sessions</h2>
                <p className="text-muted-foreground">Manage your upcoming tutoring sessions</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.slice(0, 6).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {/* Featured Tutors */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Tutors</h2>
              <p className="text-muted-foreground">Discover our top-rated tutors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.slice(0, 6).map((tutor) => (
                <TutorCard key={tutor.id} {...tutor} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link to="/tutors">View All Tutors</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Tutor Dashboard Component
const TutorDashboard = ({ user, profile, handleSignOut }) => {
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loadingTutorProfile, setLoadingTutorProfile] = useState(true);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: '',
    subject: '',
    experience: '',
    education: '',
    languages: 'English',
    timezone: 'UTC',
    specialties: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTutorProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('tutors')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setTutorProfile(data);
        }
      } catch (error) {
        console.error('Error fetching tutor profile:', error);
      } finally {
        setLoadingTutorProfile(false);
      }
    };

    fetchTutorProfile();
  }, [user?.id]);

  const handleCreateTutorProfile = async (profileData) => {
    setIsCreatingProfile(true);
    try {
      const { data, error } = await supabase
        .from('tutors')
        .insert({
          user_id: user.id,
          name: profileData.name,
          subject: profileData.subject,
          bio: profileData.bio,
          hourly_rate: profileData.hourlyRate,
          rating: profileData.rating,
          review_count: profileData.reviewCount,
          experience: profileData.experience,
          education: profileData.education,
          languages: profileData.languages,
          timezone: profileData.timezone,
          specialties: profileData.specialties
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your tutor profile has been created. Students can now find you!",
      });
      setTutorProfile(data);
    } catch (error) {
      console.error('Error creating tutor profile:', error);
      toast({
        title: "Error",
        description: "Failed to create tutor profile",
        variant: "destructive"
      });
    } finally {
      setIsCreatingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">MyTutor</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile?.full_name || user?.email}</span>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center py-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-text bg-clip-text text-transparent">
              Tutor Dashboard
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Manage your tutoring profile and connect with students
            </p>
          </section>

          {loadingTutorProfile ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your profile...</p>
            </div>
          ) : !tutorProfile ? (
            /* Create Tutor Profile Section */
            <section className="py-16">
              <Card className="max-w-2xl mx-auto bg-gradient-card shadow-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-6 w-6" />
                    Create Your Tutor Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Create your tutor profile so students can discover and book sessions with you.
                  </p>
                  
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     if (!formData.bio || !formData.hourlyRate || !formData.subject || !formData.experience || !formData.education) {
                       toast({
                         title: "Error",
                         description: "Please fill in all fields",
                         variant: "destructive"
                       });
                       return;
                     }
                      handleCreateTutorProfile({
                        name: profile?.full_name || 'New Tutor',
                        subject: formData.subject,
                        bio: formData.bio,
                        hourlyRate: Number(formData.hourlyRate),
                        rating: 0,
                        reviewCount: 0,
                        experience: formData.experience,
                        education: formData.education,
                        languages: formData.languages.split(',').map(lang => lang.trim()),
                        timezone: formData.timezone,
                        specialties: formData.specialties.split(',').map(spec => spec.trim()).filter(spec => spec)
                      });
                   }} className="space-y-6">
                     <div className="space-y-4">
                       <div>
                         <Label htmlFor="subject">Subject</Label>
                         <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                           <SelectTrigger>
                             <SelectValue placeholder="Choose your subject" />
                           </SelectTrigger>
                           <SelectContent>
                             {subjects.map((subject) => (
                               <SelectItem key={subject} value={subject}>
                                 {subject}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>

                       <div>
                         <Label htmlFor="bio">About You</Label>
                         <Textarea
                           id="bio"
                           placeholder="Tell students about your experience, teaching style, and qualifications..."
                           value={formData.bio}
                           onChange={(e) => setFormData({...formData, bio: e.target.value})}
                           className="min-h-[100px]"
                         />
                       </div>

                        <div>
                          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            min="1"
                            placeholder="25"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            placeholder="e.g., 5 years"
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            placeholder="e.g., PhD in Mathematics, MIT"
                            value={formData.education}
                            onChange={(e) => setFormData({...formData, education: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="languages">Languages</Label>
                          <Input
                            id="languages"
                            placeholder="English, Spanish, French (comma-separated)"
                            value={formData.languages}
                            onChange={(e) => setFormData({...formData, languages: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="timezone">Timezone</Label>
                          <Input
                            id="timezone"
                            placeholder="e.g., PST, EST, UTC"
                            value={formData.timezone}
                            onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="specialties">Specialties</Label>
                          <Input
                            id="specialties"
                            placeholder="e.g., Algebra, Calculus, Statistics (comma-separated)"
                            value={formData.specialties}
                            onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                          />
                        </div>
                     </div>

                     <Button 
                       type="submit"
                       className="w-full" 
                       size="lg" 
                       disabled={isCreatingProfile}
                     >
                       {isCreatingProfile ? 'Creating Profile...' : 'Create Tutor Profile'}
                     </Button>
                   </form>
                </CardContent>
              </Card>
            </section>
          ) : (
            /* Tutor Profile Management */
            <section className="py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-card shadow-elevated">
                  <CardHeader>
                    <CardTitle>Your Tutor Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{tutorProfile.name}</h3>
                        <p className="text-muted-foreground">{tutorProfile.subject}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{tutorProfile.bio}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-primary">${tutorProfile.hourlyRate}/hour</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{tutorProfile.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card shadow-elevated">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Students</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Sessions</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Average Rating</span>
                      <span className="font-semibold">{tutorProfile.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;