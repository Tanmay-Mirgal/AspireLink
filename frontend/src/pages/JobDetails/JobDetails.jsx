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
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-hot-toast';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching job with ID:', jobId);
        const response = await axiosInstance.get(`/jobs/get-job-by-id/${jobId}`);
        console.log('Job data response:', response.data);
        
        if (response.data.success && response.data.job) {
          setJob(response.data.job);
        } else {
          setError('Could not find job details');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.response?.data?.message || 'Failed to load job details');
        toast.error('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

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
  if (error || !job) {
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
                  <div className="flex items-center">
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
            <Button size="lg" className="rounded-full">
              Apply Now
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetail;