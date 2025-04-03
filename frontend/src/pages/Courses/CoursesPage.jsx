import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for courses
const coursesData = [
  {
    id: 1,
    title: "Complete React Developer in 2025",
    description: "Learn React from scratch and build real-world applications",
    level: "beginner",
    price: 89.99,
    isPaid: true,
    category: "react",
    youtubeId: "bMknfKXIFA8",
    instructor: "Andrei Neagoie",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master complex React patterns, hooks, and performance optimization",
    level: "advanced",
    price: 129.99,
    isPaid: true,
    category: "react",
    youtubeId: "4UZrsTqkcW4",
    instructor: "Kent C. Dodds",
    rating: 4.9,
  },
  {
    id: 3,
    title: "JavaScript Basics for Beginners",
    description: "Learn JavaScript fundamentals from the ground up",
    level: "beginner",
    price: 0,
    isPaid: false,
    category: "javascript",
    youtubeId: "W6NZfCO5SIk",
    instructor: "Mosh Hamedani",
    rating: 4.7,
  },
  {
    id: 4,
    title: "JavaScript: The Advanced Concepts",
    description: "Master advanced JavaScript concepts like prototypal inheritance, closures and more",
    level: "advanced",
    price: 99.99,
    isPaid: true,
    category: "javascript",
    youtubeId: "8dWL3wF_OMw",
    instructor: "Andrei Neagoie",
    rating: 4.8,
  },
  {
    id: 5,
    title: "CSS Crash Course for Absolute Beginners",
    description: "Learn CSS fundamentals in this beginner-friendly crash course",
    level: "beginner",
    price: 0,
    isPaid: false,
    category: "css",
    youtubeId: "yfoY53QXEnI",
    instructor: "Brad Traversy",
    rating: 4.6,
  },
  {
    id: 6,
    title: "Advanced CSS and Sass",
    description: "Master modern CSS with flexbox, grid, animations and more",
    level: "advanced",
    price: 79.99,
    isPaid: true,
    category: "css",
    youtubeId: "Zz6eOVaaelI",
    instructor: "Jonas Schmedtmann",
    rating: 4.8,
  },
  {
    id: 7,
    title: "HTML Crash Course For Beginners",
    description: "Learn HTML basics in this beginner-friendly crash course",
    level: "beginner",
    price: 0,
    isPaid: false,
    category: "html",
    youtubeId: "UB1O30fR-EE",
    instructor: "Brad Traversy",
    rating: 4.5,
  },
  {
    id: 8,
    title: "Intro to Machine Learning",
    description: "A beginner-friendly introduction to machine learning concepts",
    level: "beginner",
    price: 0,
    isPaid: false,
    category: "machine learning",
    youtubeId: "7eh4d6sabA0",
    instructor: "Siraj Raval",
    rating: 4.6,
  },
  {
    id: 9,
    title: "Advanced Machine Learning Specialization",
    description: "Deep dive into advanced ML algorithms and implementations",
    level: "advanced",
    price: 149.99,
    isPaid: true,
    category: "machine learning",
    youtubeId: "aircAruvnKk",
    instructor: "Andrew Ng",
    rating: 4.9,
  },
  {
    id: 10,
    title: "Introduction to Artificial Intelligence",
    description: "Learn the fundamentals of AI and its applications",
    level: "beginner",
    price: 0,
    isPaid: false,
    category: "ai",
    youtubeId: "JMUxmLyrhSk",
    instructor: "Patrick Winston",
    rating: 4.7,
  },
  {
    id: 11,
    title: "Advanced AI: Deep Reinforcement Learning",
    description: "Master deep reinforcement learning algorithms and applications",
    level: "advanced",
    price: 159.99,
    isPaid: true,
    category: "ai",
    youtubeId: "2pWv7GOvuf0",
    instructor: "David Silver",
    rating: 4.9,
  },
  {
    id: 12,
    title: "Full Stack Web Development Bootcamp",
    description: "Learn front-end and back-end web development from scratch",
    level: "intermediate",
    price: 119.99,
    isPaid: true,
    category: "web development",
    youtubeId: "nu_pCVPKzTk",
    instructor: "Colt Steele",
    rating: 4.8,
  },
];

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  // Filter courses based on selections
  const filteredCourses = coursesData.filter(course => {
    const categoryMatch = selectedCategory === "all" || course.category === selectedCategory;
    const levelMatch = selectedLevel === "all" || course.level === selectedLevel;
    const priceMatch = selectedPrice === "all" || 
                     (selectedPrice === "free" && !course.isPaid) || 
                     (selectedPrice === "paid" && course.isPaid);
    return categoryMatch && levelMatch && priceMatch;
  });

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Course Explorer</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover the best courses in web development, programming, and AI to take your skills to the next level.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="machine learning">Machine Learning</SelectItem>
              <SelectItem value="ai">AI</SelectItem>
              <SelectItem value="web development">Web Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Select value={selectedPrice} onValueChange={setSelectedPrice}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="ai-ml">AI & ML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} getThumbnail={getYouTubeThumbnail} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="beginner" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter(course => course.level === "beginner")
              .map((course) => (
                <CourseCard key={course.id} course={course} getThumbnail={getYouTubeThumbnail} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter(course => course.level === "intermediate")
              .map((course) => (
                <CourseCard key={course.id} course={course} getThumbnail={getYouTubeThumbnail} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter(course => course.level === "advanced")
              .map((course) => (
                <CourseCard key={course.id} course={course} getThumbnail={getYouTubeThumbnail} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="react" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter(course => course.category === "react")
              .map((course) => (
                <CourseCard key={course.id} course={course} getThumbnail={getYouTubeThumbnail} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="javascript" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter(course => course.category === "javascript")
              .map((course) => (
                <CourseCard key={course.id} course={course} getThumbnail={getYouTubeThumbnail} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-ml" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter(course => course.category === "ai" || course.category === "machine learning")
              .map((course) => (
                <CourseCard key={course.id} course={course} getThumbnail={getYouTubeThumbnail} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-slate-700">No courses found</h3>
          <p className="mt-2 text-slate-500">Try adjusting your filters to find courses.</p>
        </div>
      )}
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, getThumbnail }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getThumbnail(course.youtubeId)} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={course.isPaid ? "default" : "outline"} className={course.isPaid ? "bg-blue-500" : "border-green-500 text-green-500"}>
            {course.isPaid ? `$${course.price}` : 'Free'}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="capitalize">
            {course.level}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{course.title}</CardTitle>
        </div>
        <div className="flex items-center mt-1">
          <span className="text-sm text-yellow-500">★</span>
          <span className="text-sm ml-1">{course.rating}</span>
          <span className="text-xs text-slate-500 ml-2">{course.instructor}</span>
        </div>
        <CardDescription className="line-clamp-2 mt-1">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 flex justify-between">
        <Badge variant="outline" className="capitalize">
          {course.category}
        </Badge>
        <Button variant="outline" className="text-sm">
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoursesPage;