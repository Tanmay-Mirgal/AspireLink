import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Upload,
    AlertCircle,
    Copy,
    Check,
    FileType2,
    RefreshCw,
    Layers,
    CheckCircle,
    Award,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/hooks/use-toast";

const OCRScanner = () => {
    // State variables
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');
    const [detectedSkills, setDetectedSkills] = useState([]);
    const [atsScore, setAtsScore] = useState(null);
    const [atsFeedback, setAtsFeedback] = useState([]);

    const { toast } = useToast();

    // List of skills to check for
    const SKILLS = [
        "React", "Node", "MongoDB", "Express", "Python", "Django", "Flask",
        "Java", "C++", "C", "HTML", "CSS", "JavaScript", "TypeScript",
        "Redux", "Context API", "REST API", "GraphQL", "SQL", "NoSQL",
        "Firebase", "AWS", "Docker", "Kubernetes", "CI/CD", "Git",
        "Agile", "Scrum", "Kanban", "TDD", "BDD", "Jest", "Mocha",
        "Chai", "Cypress", "React Testing Library", "Jasmine", "Enzyme",
        "Puppeteer", "Playwright", "Selenium", "WebdriverIO", "JIRA",
        "Confluence", "Slack", "Trello", "Asana", "Postman", "Insomnia"
    ];

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Prepare skills data for visualization
    const prepareSkillsVisualizationData = (skills) => {
        // Count occurrences of skills in different categories
        const categoryMap = {
            'Frontend': ['React', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Redux', 'Context API'],
            'Backend': ['Node', 'Express', 'Python', 'Django', 'Flask', 'Java', 'C++', 'C'],
            'Database': ['MongoDB', 'SQL', 'NoSQL', 'Firebase'],
            'DevOps': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Postman', 'Insomnia']
        };

        // Categorize and count skills
        const categorizedSkills = Object.entries(categoryMap).map(([category, categorySkills]) => {
            const matchedSkills = skills.filter(skill => categorySkills.includes(skill));
            return {
                category,
                count: matchedSkills.length,
                skills: matchedSkills
            };
        });

        // Prepare pie chart data
        const pieChartData = categorizedSkills.map(item => ({
            name: item.category,
            value: item.count
        }));

        return {
            pieChartData,
            categorizedSkills,
        };
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (selectedFile.size > maxSize) {
            setError('File is too large. Maximum size is 10MB.');
            setFile(null);
            setFilePreview(null);
            return;
        }

        // Check file type
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        const fileName = selectedFile.name.toLowerCase();
        const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

        if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
            setError('Please upload a PDF or image file (PNG, JPG, JPEG).');
            setFile(null);
            setFilePreview(null);
            return;
        }

        setFile(selectedFile);
        setError(null);
        setDetectedSkills([]);
        setAtsScore(null);
        setAtsFeedback([]);

        // Create a preview for images
        if (selectedFile.type.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            // For PDFs, just show an icon or placeholder
            setFilePreview(null);
        }
    };

    // Process the file with the OCR backend
    const processFile = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setExtractedText('');
        setDetectedSkills([]);
        setAtsScore(null);
        setAtsFeedback([]);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://indus-python-server.onrender.com/ocr', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server responded with status ${response.status}`);
            }

            const data = await response.json();

            if (data.text) {
                setExtractedText(data.text);
                setActiveTab('results'); // Switch to results tab when processing is complete

                // Local skill detection
                const localDetectedSkills = SKILLS.filter(skill => {
                    try {
                        // Create a regex that matches the skill as a whole word
                        const regex = new RegExp(`\\b${skill}\\b`, 'i');
                        return regex.test(data.text);
                    } catch (error) {
                        console.error(`Error with skill "${skill}":`, error.message);
                        return data.text.toLowerCase().includes(skill.toLowerCase());
                    }
                });

                setDetectedSkills(localDetectedSkills);
                
                // Calculate ATS score
                analyzeAtsScore(data.text, localDetectedSkills);

                toast({
                    title: "Text extracted successfully",
                    description: `Found ${localDetectedSkills.length} skills.`,
                });
            } else {
                throw new Error('No text extracted from the document');
            }
        } catch (err) {
            console.error('OCR Processing Error:', err);
            setError(err.message || 'An error occurred while processing the file.');
            toast({
                variant: "destructive",
                title: "Processing failed",
                description: err.message || "An error occurred while processing the file.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Analyze the resume and generate ATS score
    const analyzeAtsScore = (text, skills) => {
        // Initialize score calculation parameters
        let baseScore = 65; // Start with a base score
        let feedback = [];
        
        // Check for contact information
        const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
        const hasPhone = /(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})/.test(text);
        
        if (hasEmail) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Email address is present' });
        } else {
            feedback.push({ type: 'negative', message: 'No email address detected' });
        }
        
        if (hasPhone) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Phone number is present' });
        } else {
            feedback.push({ type: 'negative', message: 'No phone number detected' });
        }
        
        // Check for LinkedIn/GitHub profiles
        const hasLinkedIn = /(linkedin\.com)/.test(text);
        const hasGitHub = /(github\.com)/.test(text);
        
        if (hasLinkedIn) {
            baseScore += 3;
            feedback.push({ type: 'positive', message: 'LinkedIn profile included' });
        }
        
        if (hasGitHub) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'GitHub profile included - great for technical roles' });
        }
        
        // Check number of skills
        if (skills.length >= 10) {
            baseScore += 10;
            feedback.push({ type: 'positive', message: 'Strong set of technical skills detected' });
        } else if (skills.length >= 5) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Good range of technical skills' });
        } else if (skills.length > 0) {
            feedback.push({ type: 'neutral', message: 'Limited technical skills detected' });
        } else {
            baseScore -= 10;
            feedback.push({ type: 'negative', message: 'No technical skills detected' });
        }
        
        // Check for education section
        const educationKeywords = ['education', 'university', 'college', 'bachelor', 'master', 'phd', 'degree'];
        const hasEducation = educationKeywords.some(keyword => 
            new RegExp('\\b' + keyword + '\\b', 'i').test(text)
        );
        
        if (hasEducation) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Education section detected' });
        } else {
            feedback.push({ type: 'negative', message: 'No education information found' });
        }
        
        // Check for experience
        const experienceKeywords = ['experience', 'work', 'job', 'position', 'employment'];
        const hasExperience = experienceKeywords.some(keyword => 
            new RegExp('\\b' + keyword + '\\b', 'i').test(text)
        );
        
        if (hasExperience) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Work experience section detected' });
        } else {
            feedback.push({ type: 'negative', message: 'No work experience section found' });
        }
        
        // Check for achievements/metrics
        const achievementPattern = /increased|improved|reduced|saved|delivered|managed|led|achieved|awarded/i;
        const hasAchievements = achievementPattern.test(text);
        const hasMetrics = /\d+%|\$\d+|\d+ percent/i.test(text);
        
        if (hasAchievements) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Achievement-oriented language detected' });
        }
        
        if (hasMetrics) {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Quantifiable metrics found - great for demonstrating impact' });
        }
        
        // Check resume length via word count
        const wordCount = text.split(/\s+/).length;
        if (wordCount > 700) {
            baseScore -= 5;
            feedback.push({ type: 'negative', message: 'Resume may be too long (over 700 words)' });
        } else if (wordCount < 300) {
            baseScore -= 5;
            feedback.push({ type: 'negative', message: 'Resume may be too short (under 300 words)' });
        } else {
            baseScore += 5;
            feedback.push({ type: 'positive', message: 'Resume length is appropriate' });
        }
        
        // Check for certification section
        const certificationKeywords = ['certification', 'certified', 'certificate'];
        const hasCertifications = certificationKeywords.some(keyword => 
            new RegExp('\\b' + keyword + '\\b', 'i').test(text)
        );
        
        if (hasCertifications) {
            baseScore += 3;
            feedback.push({ type: 'positive', message: 'Certifications found' });
        }
        
        // Clamp final score between 0 and 100
        const finalScore = Math.min(100, Math.max(0, Math.round(baseScore)));
        
        setAtsScore(finalScore);
        setAtsFeedback(feedback);
    };

    // Copy extracted text to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedText).then(
            () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                toast({
                    title: "Copied to clipboard",
                    description: "Text has been copied to your clipboard.",
                    duration: 3000,
                });
            },
            (err) => {
                console.error('Copy failed:', err);
                setError('Failed to copy text to clipboard');
                toast({
                    variant: "destructive",
                    title: "Copy failed",
                    description: "Could not copy text to clipboard.",
                    duration: 3000,
                });
            }
        );
    };

    // Save text as file
    const saveAsTextFile = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "File saved",
            description: "Extracted text has been saved as a file.",
            duration: 3000,
        });
    };

    // Reset the form
    const resetForm = () => {
        setFile(null);
        setFilePreview(null);
        setExtractedText('');
        setError(null);
        setDetectedSkills([]);
        setAtsScore(null);
        setAtsFeedback([]);
        setActiveTab('upload');
    };

    // Render skills visualization
    const renderSkillsVisualization = () => {
        if (detectedSkills.length === 0) return null;

        const { pieChartData, categorizedSkills } = prepareSkillsVisualizationData(detectedSkills);

        return (
            <div className="space-y-6">
                <div className="grid md:grid-cols-1 gap-6">
                    {/* Pie Chart for Skill Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Category Distribution</CardTitle>
                            <CardDescription>Proportion of skills across different categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Skill Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Categories Breakdown</CardTitle>
                        <CardDescription>Detailed analysis of skills across different domains</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 ml-6">
                            {categorizedSkills.map((category, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <h4 className="text-sm font-semibold mb-2">{category.category} Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map((skill, skillIndex) => (
                                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {category.skills.length} skills detected
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    // Render ATS Score analysis
    const renderAtsScoreAnalysis = () => {
        if (atsScore === null) return null;

        // Define colors and labels based on score ranges
        let scoreColor, scoreLabel;
        if (atsScore >= 80) {
            scoreColor = "text-green-600";
            scoreLabel = "Excellent";
        } else if (atsScore >= 70) {
            scoreColor = "text-blue-600";
            scoreLabel = "Good";
        } else if (atsScore >= 50) {
            scoreColor = "text-yellow-600";
            scoreLabel = "Average";
        } else {
            scoreColor = "text-red-600";
            scoreLabel = "Needs Improvement";
        }

        return (
            <div className="space-y-6">
                {/* Score Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Award className="h-5 w-5 mr-2" />
                            ATS Compatibility Score
                        </CardTitle>
                        <CardDescription>
                            How well your resume is likely to perform with Applicant Tracking Systems
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-6">
                            <div className={`text-6xl font-bold mb-2 ${scoreColor}`}>
                                {atsScore}%
                            </div>
                            <div className={`text-xl font-medium ${scoreColor}`}>
                                {scoreLabel}
                            </div>
                            <Progress
                                value={atsScore}
                                className="w-full mt-6 h-2"
                            />
                            <div className="grid grid-cols-4 w-full mt-1 text-xs text-center">
                                <div className="text-red-500">Poor</div>
                                <div className="text-yellow-500">Average</div>
                                <div className="text-blue-500">Good</div>
                                <div className="text-green-500">Excellent</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Feedback */}
                <Card>
                    <CardHeader>
                        <CardTitle>ATS Feedback</CardTitle>
                        <CardDescription>
                            Analysis of resume elements that affect ATS compatibility
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <h4 className="font-semibold mb-2">Key Findings:</h4>
                            <div className="grid gap-2">
                                {atsFeedback.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex items-start p-3 rounded-md ${
                                            item.type === 'positive' 
                                                ? 'bg-green-50 border-l-4 border-green-400' 
                                                : item.type === 'negative'
                                                    ? 'bg-red-50 border-l-4 border-red-400'
                                                    : 'bg-gray-50 border-l-4 border-gray-400'
                                        }`}
                                    >
                                        {item.type === 'positive' ? (
                                            <ThumbsUp className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        ) : item.type === 'negative' ? (
                                            <ThumbsDown className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                                        )}
                                        <span>{item.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Improvement Suggestions */}
                <Card>
                    <CardHeader>
                        <CardTitle>How to Improve Your ATS Score</CardTitle>
                        <CardDescription>
                            Recommendations to make your resume more ATS-friendly
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 border rounded-md">
                                <h4 className="font-medium mb-1">Tailor to Job Description</h4>
                                <p className="text-sm">Include keywords and phrases from the specific job description you're applying to.</p>
                            </div>
                            <div className="p-3 border rounded-md">
                                <h4 className="font-medium mb-1">Simple Formatting</h4>
                                <p className="text-sm">Use standard section headers and avoid complex tables, graphics, or unusual fonts.</p>
                            </div>
                            <div className="p-3 border rounded-md">
                                <h4 className="font-medium mb-1">Quantify Achievements</h4>
                                <p className="text-sm">Use numbers and percentages to highlight your accomplishments.</p>
                            </div>
                            <div className="p-3 border rounded-md">
                                <h4 className="font-medium mb-1">Include Contact Information</h4>
                                <p className="text-sm">Ensure your email, phone number, and professional profiles are clearly visible.</p>
                            </div>
                            <div className="p-3 border rounded-md">
                                <h4 className="font-medium mb-1">Spell Out Acronyms</h4>
                                <p className="text-sm">Use both the acronym and the full term for important industry-specific terminology.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Resume Analyzer</h1>
                    <p className="mt-2 text-lg">
                        Extract skills from resumes, analyze ATS compatibility, and visualize technical capabilities
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="results" disabled={!extractedText}>Results</TabsTrigger>
                        <TabsTrigger value="skills" disabled={!extractedText}>
                            Skills {detectedSkills.length > 0 && `(${detectedSkills.length})`}
                        </TabsTrigger>
                        <TabsTrigger value="ats" disabled={atsScore === null}>
                            ATS Score {atsScore !== null && `(${atsScore}%)`}
                        </TabsTrigger>
                    </TabsList>

                    {/* Upload Tab */}
                    <TabsContent value="upload" className="mt-6">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Upload Resume</CardTitle>
                                <CardDescription>
                                    Upload a PDF or image file to extract text and analyze skills
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    {/* File upload area */}
                                    <div
                                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => document.getElementById('file-upload').click()}
                                    >
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        {file ? (
                                            <div className="space-y-4">
                                                {filePreview ? (
                                                    <img
                                                        src={filePreview}
                                                        alt="Preview"
                                                        className="max-h-48 mx-auto object-contain rounded"
                                                    />
                                                ) : (
                                                    <FileText className="h-16 w-16 mx-auto" />
                                                )}
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <p className="text-xs">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        document.getElementById('file-upload').click();
                                                    }}
                                                >
                                                    Change File
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload className="h-12 w-12 mx-auto" />
                                                <div>
                                                    <p className="text-base font-medium">Click to upload or drag and drop</p>
                                                    <p className="text-sm">PDF, PNG, JPG, JPEG (max 10MB)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Error message */}
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Process button */}
                                    <Button
                                        onClick={processFile}
                                        disabled={!file || isLoading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Extract Text & Analyze Resume'
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Results Tab */}
                    <TabsContent value="results" className="mt-6">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Extracted Text</CardTitle>
                                <CardDescription>
                                    Text extracted from your document
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Extracted text display */}
                                    <div className="relative">
                                        <Textarea
                                            value={extractedText}
                                            readOnly
                                            className="min-h-72 font-mono text-sm p-4"
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="absolute top-2 right-2"
                                            onClick={copyToClipboard}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4 mr-1" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Word and character count */}
                                    <div className="text-sm flex space-x-4">
                                        <div>
                                            <span className="font-medium">Words:</span>{' '}
                                            {extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0}
                                        </div>
                                        <div>
                                            <span className="font-medium">Characters:</span>{' '}
                                            {extractedText.length}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={resetForm}
                                >
                                    Process Another Document
                                </Button>
                                <Button
                                    onClick={saveAsTextFile}
                                >
                                    <FileType2 className="h-4 w-4 mr-2" />
                                    Save as Text File
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Skills Visualization Tab */}
                    <TabsContent value="skills" className="mt-6">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Layers className="h-5 w-5 mr-2" />
                                    Skills Visualization
                                </CardTitle>
                                <CardDescription>
                                    Graphical representation of detected technical skills
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {detectedSkills.length > 0 ? (
                                    renderSkillsVisualization()
                                ) : (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium">No Skills Detected</h3>
                                        <p className="mt-2">
                                            We couldn't detect any technical skills in your document.
                                            Try uploading a resume or technical document.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveTab('results')}
                                >
                                    Back to Text Results
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={resetForm}
                                >
                                    Process Another Document
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* ATS Score Tab */}
                    <TabsContent value="ats" className="mt-6">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    ATS Compatibility Analysis
                                </CardTitle>
                                <CardDescription>
                                    How well your resume performs with Applicant Tracking Systems
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {atsScore !== null ? (
                                    renderAtsScoreAnalysis()
                                ) : (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium">No ATS Analysis Available</h3>
                                        <p className="mt-2">
                                            We couldn't generate an ATS score for your document.
                                            Try uploading a resume or CV.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveTab('results')}
                                >
                                    Back to Text Results
                                </Button>
                                {atsScore !== null && atsScore < 70 && (
                                    <Button>
                                        Get Improvement Suggestions
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Loading progress */}
                {isLoading && (
                    <div className="mt-4">
                        <p className="text-sm mb-2">Processing your document...</p>
                        <Progress value={null} className="h-1" />
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-sm">
                <p>Powered by TreeTex</p>
            </footer>
        </div>
    );
};

export default OCRScanner;