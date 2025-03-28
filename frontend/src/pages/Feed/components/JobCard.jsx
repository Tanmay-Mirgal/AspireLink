import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Briefcase, 
  ChevronDown, 
  MapPin, 
  Building, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

import { formatJobDate } from '@/pages/Feed/components/Helper';



const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div 
      key={job._id} 
      className="flex flex-col p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      onClick={() => navigate(`/job/${job._id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {job.jobType || 'Full-time'}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-2 text-xs text-muted-foreground">
        {job.location && (
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{job.location}</span>
          </div>
        )}
        
        {job.salary && (
          <div className="flex items-center">
            <Building className="h-3 w-3 mr-1" />
            <span>{job.salary}</span>
          </div>
        )}
        
        {job.postedAt && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Posted {formatJobDate(job.postedAt)}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs">
          {job.appliedStudents && job.appliedStudents.length > 0 
            ? `${job.appliedStudents.length} applicants` 
            : 'Be the first to apply'}
        </span>
        <Button variant="ghost" size="sm" className="text-xs">
          View <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};



export const JobListingSidebar = ({ 
  jobs, 
  isLoading, 
  error 
}) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Live Job Posting List</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
          See all <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-600 dark:text-red-400">
            Failed to load job listings
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="divide-y">
            {jobs.slice(0, 5).map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No job postings available
          </div>
        )}
      </CardContent>
    </Card>
  );
};