// Updated JobDetail component with apply functionality and fixed logic
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Building,
  MapPin,
  Briefcase,
  Code,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'react-hot-toast';
import useJobStore from '@/store/useJobStore';
import { axiosInstance } from '@/lib/axios';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentJob, 
    isLoading, 
    error, 
    fetchJobById, 
    clearCurrentJob 
  } = useJobStore();
  
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch job data and user info
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (jobId) {
      fetchJobById(jobId);
    }
    
    return () => {
      clearCurrentJob();
    };
  }, [jobId, fetchJobById, clearCurrentJob]);

  // Check if the current user has already applied
  useEffect(() => {
    if (currentJob && user) {
      // Check if the user's ID is in the appliedStudents array
      const alreadyApplied = currentJob.appliedStudents?.some(
        studentId => studentId === user._id
      );
      setHasApplied(alreadyApplied);
    }
  }, [currentJob, user]);

  const handleApply = async () => {
    // Don't allow application if user has already applied
    if (hasApplied) {
      toast.error('You have already applied for this job');
      return;
    }

    if (!user) {
      toast.error('Please login to apply for this job');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can apply for jobs');
      return;
    }

    setIsApplying(true);
    try {
      await axiosInstance.post(`/jobs/apply/${jobId}`);
      
      toast.success('Successfully applied for job. A meeting request has been sent to the mentor.');
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setIsApplying(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !currentJob) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
              <p className="text-muted-foreground">The job you are looking for does not exist or has been removed.</p>
              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
              <Button 
                className="mt-6" 
                onClick={() => navigate('/feed')}
              >
                Return to Feed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const job = currentJob;

  // Render application button based on user status
  const renderApplicationButton = () => {
    // If user has already applied
    if (hasApplied) {
      return (
        <Button 
          size="lg" 
          variant="outline"
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-700 cursor-default"
          disabled
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Application Submitted
        </Button>
      );
    }
    
    // If user is not a student
    if (user?.role !== 'student') {
      return (
        <Button 
          size="lg" 
          className="rounded-full opacity-70"
          disabled
          title="Only students can apply for jobs"
        >
          Apply Now
        </Button>
      );
    }
    
    // Default - user is a student and hasn't applied yet
    return (
      <Button 
        size="lg" 
        className="rounded-full"
        onClick={handleApply}
        disabled={isApplying || hasApplied}
      >
        {isApplying ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Applying...
          </>
        ) : hasApplied ? (
          'Application Submitted'
        ) : (
          'Apply Now'
        )}
      </Button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button 
        variant="outline" 
        className="mb-8"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-primary mb-2">
                {job.jobTitle || 'Untitled Job'}
              </CardTitle>
              <CardDescription className="flex items-center space-x-3">
                {job.companyName && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{job.companyName}</span>
                  </div>
                )}
                {job.jobLocation && (
                  <div className="flex items-center ml-3">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{job.jobLocation}</span>
                  </div>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {job.type && (
                <Badge variant="outline">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {job.type}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-6 space-y-6">
          {/* Job Description */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2 text-primary" />
              Job Description
            </h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {job.jobDescription || 'No description provided.'}
            </p>
          </section>
          
          <Separator />
          
          {/* Skills Required */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="cursor-help">
                          {skill}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Skill: {skill}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </section>
          )}
          
          <Separator />
          
          {/* Job Actions */}
          <section className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Applicants so far: {job.appliedStudents?.length || 0}
            </div>
            
            {renderApplicationButton()}
          </section>
          
          {user?.role !== 'student' && !hasApplied && (
            <p className="text-sm text-muted-foreground text-center">
              Note: Only students can apply for job positions
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetail;