import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Building,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Direct Job Detail component that handles API errors better
const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestTimeout, setRequestTimeout] = useState(false);

  // Directly fetch job data with better error handling
  useEffect(() => {
    const fetchJobData = async () => {
      setIsLoading(true);
      setError(null);
      setRequestTimeout(false);
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setRequestTimeout(true);
        setIsLoading(false);
        setError("Request timed out. The server may be unavailable.");
        console.error("Request timed out after 10 seconds");
      }, 10000); // 10 second timeout
      
      try {
        console.log('Fetching job with ID:', jobId);
        
        // Using axios directly without instance to rule out configuration issues
        const response = await axios.get(`/api/jobs/get-job-by-id/${jobId}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            // Include authentication token if needed
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('Job API response:', response);
        
        clearTimeout(timeoutId);
        
        if (response.data && response.data.job) {
          setJob(response.data.job);
          console.log('Job data successfully retrieved:', response.data.job);
        } else if (response.data && response.data.success === false) {
          setError(response.data.message || 'Could not find job details');
          console.error('API returned success:false:', response.data);
        } else {
          setError('Invalid response format from server');
          console.error('Invalid API response format:', response.data);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        
        if (err.name === 'AbortError') {
          // Already handled by the timeout callback
          return;
        }
        
        console.error('Error fetching job:', err);
        if (err.response) {
          // Server responded with an error status code
          console.error('Response error:', err.response.status, err.response.data);
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          // Request was made but no response received
          console.error('No response received:', err.request);
          setError('No response from server. Check your network connection.');
        } else {
          // Error in setting up the request
          console.error('Request setup error:', err.message);
          setError(`Error: ${err.message}`);
        }
        
        toast.error('Failed to load job details');
      } finally {
        if (!requestTimeout) {
          setIsLoading(false);
        }
      }
    };

    if (jobId) {
      // Log the current API base URL to debug
      console.log('Current API URL:', axios.defaults.baseURL || 'No base URL set');
      console.log('About to fetch job with ID:', jobId);
      fetchJobData();
    }

    // Cleanup function
    return () => {
      console.log('Job detail component unmounting');
    };
  }, [jobId]);

  // Fallback/mock data for testing UI
  const renderMockJob = () => {
    const mockJob = {
      title: "Sample Job Position",
      company: "Example Company",
      location: "Remote",
      jobType: "Full-time",
      description: "This is a sample job description to verify that the UI rendering works correctly even when API data is not available.",
      requirements: "Sample requirements for testing purposes.",
      postedAt: new Date().toISOString()
    };
    
    console.log("Rendering with mock data for UI testing");
    return mockJob;
  };

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
          <p className="text-xs text-muted-foreground mt-2">Job ID: {jobId}</p>
        </div>
      </div>
    );
  }

  if (error) {
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
              <h2 className="text-2xl font-bold mb-2">Error Loading Job</h2>
              <p className="text-muted-foreground">We couldn't retrieve the job details you requested.</p>
              <div className="mt-4 p-4 bg-destructive/10 rounded-md text-destructive text-sm">
                <p><strong>Error:</strong> {error}</p>
                <p className="mt-2 text-xs">Job ID: {jobId}</p>
              </div>
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <div>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/feed')}
                  >
                    Return to Feed
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Debug section - can be removed in production */}
        <div className="mt-8 p-4 border rounded-md bg-muted/50">
          <h3 className="text-sm font-semibold mb-2">Developer Troubleshooting</h3>
          <p className="text-xs mb-2">If you're seeing this error, try the following:</p>
          <ol className="text-xs list-decimal ml-4 space-y-1">
            <li>Check that your backend API is running and accessible</li>
            <li>Verify the job ID format is correct</li>
            <li>Ensure your API routes are configured properly</li>
            <li>Check that authentication is working (if required)</li>
            <li>Look for CORS issues in browser console</li>
          </ol>
          <p className="text-xs mt-4">API endpoint being called: <code className="bg-muted rounded px-1">{`/api/jobs/get-job-by-id/${jobId}`}</code></p>
        </div>
      </div>
    );
  }

  // Use actual job data or fallback to mock data for UI testing
  const displayJob = job || renderMockJob();

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
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <CardTitle className="text-2xl">{displayJob.title || 'Untitled Job'}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground">
                {displayJob.company && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{displayJob.company}</span>
                  </div>
                )}
                
                {displayJob.location && (
                  <div className="flex items-center ml-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{displayJob.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {displayJob.jobType && (
                <Badge variant="outline">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {displayJob.jobType}
                </Badge>
              )}
              
              {displayJob.postedAt && (
                <Badge variant="secondary">
                  <Calendar className="h-3 w-3 mr-1" />
                  Posted: {new Date(displayJob.postedAt).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Job main content */}
          <div className="space-y-6">
            {displayJob.description && (
              <div>
                <h2 className="text-xl font-bold mb-2">Job Description</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{displayJob.description}</p>
                </div>
              </div>
            )}
            
            {displayJob.requirements && (
              <div>
                <h2 className="text-xl font-bold mb-2">Requirements</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{displayJob.requirements}</p>
                </div>
              </div>
            )}
            
            {/* Debug/development information - remove in production */}
            {!job && (
              <div className="mt-8 p-4 border rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                <p className="text-sm font-medium">⚠️ Notice: Displaying mock data</p>
                <p className="text-xs mt-1">The actual job data could not be loaded from the API. This is placeholder content.</p>
              </div>
            )}
            
            {job && (
              <div className="mt-8">
                <Button>Apply Now</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetail;