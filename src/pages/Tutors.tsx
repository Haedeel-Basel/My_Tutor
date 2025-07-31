import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TutorCard from '@/components/TutorCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tutors, subjects, getTutorsBySubject } from '@/data/tutors';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const Tutors = () => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [databaseTutors, setDatabaseTutors] = useState([]);

  useEffect(() => {
    fetchDatabaseTutors();
  }, []);

  const fetchDatabaseTutors = async () => {
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDatabaseTutors(data || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };

  // Combine static tutors with database tutors
  const allTutors = [
    ...getTutorsBySubject(selectedSubject),
    ...databaseTutors
      .filter(dbTutor => selectedSubject === 'All' || dbTutor.subject === selectedSubject)
      .map(dbTutor => ({
        id: dbTutor.id,
        name: dbTutor.name,
        subject: dbTutor.subject,
        rating: parseFloat(dbTutor.rating),
        hourlyRate: dbTutor.hourly_rate,
        image: dbTutor.image,
        bio: dbTutor.bio,
        experience: '1+ years',
        languages: ['English'],
        specialties: [dbTutor.subject],
        availability: 'Available',
        responseTime: '< 1 hour',
        reviewCount: dbTutor.review_count
      }))
  ];

  const filteredTutors = allTutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tutor.specialties && tutor.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Tutor</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our network of expert tutors and start your learning journey today
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search tutors by name, subject, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Subject Filters */}
              <div className={`mt-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedSubject === 'All' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSubject('All')}
                  >
                    All Subjects
                  </Button>
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''}
              {selectedSubject !== 'All' && ` in ${selectedSubject}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Tutors Grid */}
          {filteredTutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor.id} {...tutor} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tutors found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all subjects
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('All');
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tutors;