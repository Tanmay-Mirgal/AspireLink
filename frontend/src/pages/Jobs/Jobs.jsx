import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Filter, 
  Search, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-hot-toast';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const JobCard = ({ job, onClick }) => {
  return (
    <Card 
      className="hover:bg-accent/50 transition-colors cursor-pointer group"
      onClick={() => onClick(job._id)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-grow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {job.jobTitle}
              </h3>
              <Badge variant="outline" className="hidden md:flex">
                {job.type || 'Full-time'}
              </Badge>
            </div>
            
            <p className="text-muted-foreground">{job.companyName}</p>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {job.jobLocation && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.jobLocation}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Posted Recently</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="group-hover:bg-primary/10"
          >
            <ArrowRight className="h-5 w-5 group-hover:text-primary" />
          </Button>
        </div>
        
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {job.skillsRequired.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
            {job.skillsRequired.length > 3 && (
              <Badge variant="outline">
                +{job.skillsRequired.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/jobs/all-jobs');
        
        if (response.data.success && response.data.jobs) {
          setJobs(response.data.jobs);
        } else {
          setError('No jobs found');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.message || 'Failed to load jobs');
        toast.error('Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle job click navigation
  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJobType = !jobType || job.type === jobType;
    const matchesLocation = !location || job.jobLocation.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesJobType && matchesLocation;
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-destructive mb-2">
              Error Loading Jobs
            </h2>
            <p className="text-muted-foreground mb-6 text-center">
              {error}. Please try again later or check your connection.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Job Listings
        </h1>
        <p className="text-muted-foreground">
          Find your next career opportunity
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search jobs by title, company, or skills"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jobs found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job._id} 
              job={job} 
              onClick={handleJobClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;