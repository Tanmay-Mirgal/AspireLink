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
      className="flex flex-col p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => navigate(`/job/${job._id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
          {job.jobType || 'Full-time'}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-2 text-xs text-gray-500">
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
        <span className="text-xs text-gray-500">
          {job.appliedStudents && job.appliedStudents.length > 0 
            ? `${job.appliedStudents.length} applicants` 
            : 'Be the first to apply'}
        </span>
        <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700">
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
    <Card className="w-full bg-white border border-gray-200">
      <CardHeader className="flex flex-row justify-between items-center bg-white border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Live Job Posting List</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/jobs')}
          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          See all <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 bg-white">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                    <Skeleton className="h-3 w-24 bg-gray-200" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-3 w-20 bg-gray-200" />
                  <Skeleton className="h-3 w-24 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-600">
            Failed to load job listings
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {jobs.slice(0, 5).map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No job postings available
          </div>
        )}
      </CardContent>
    </Card>
  );
};