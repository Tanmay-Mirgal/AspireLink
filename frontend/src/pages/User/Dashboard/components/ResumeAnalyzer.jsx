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
    CheckCircle
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

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/ocr', {
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
        setActiveTab('upload');
    };

    // Render skills visualization
    const renderSkillsVisualization = () => {
        if (detectedSkills.length === 0) return null;

        const { pieChartData, barChartData, categorizedSkills } = prepareSkillsVisualizationData(detectedSkills);

        return (
            <div className="space-y-6">
                <div className="grid md:grid-cols-1 gap-6">
                    {/* Pie Chart for Skill Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Category Distribution</CardTitle>
                            <CardDescription>Proportion of skills across different categories</CardDescription>
                        </CardHeader>
                        <CardContent  >
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

                    {/* Bar Chart for Individual Skills */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Skill Breakdown</CardTitle>
                            <CardDescription>Detailed view of detected skills</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    layout="vertical"
                                    data={chartData}
                                    margin={{ left: 20, right: 20, bottom: 5 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={true}
                                        vertical={false}
                                    />
                                    <XAxis
                                        type="number"
                                        domain={[0, 100]}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <YAxis
                                        dataKey="skill"
                                        type="category"
                                        width={120}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        formatter={(value, name, props) => {
                                            const { payload } = props;
                                            return [`${value}%`, payload.skill];
                                        }}
                                        labelFormatter={(label) => `Skill: ${label}`}
                                    />
                                    <Bar
                                        dataKey="percentage"
                                        fill="#8884d8"
                                        barSize={30}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Bar
                                                key={`bar-${index}`}
                                                dataKey="percentage"
                                                fill={categoryColors[entry.category] || '#8884d8'}
                                                barSize={30}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Detailed Skill Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Categories Breakdown</CardTitle>
                        <CardDescription>Detailed analysis of skills across different domains</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-1 gap-4 ml-6">
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

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Resume Analyzer</h1>
                    <p className="mt-2 text-lg">
                        Extract skills from resumes and visualize technical capabilities
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="results" disabled={!extractedText}>Results</TabsTrigger>
                        <TabsTrigger value="skills" disabled={!extractedText}>
                            Skills Visualization {detectedSkills.length > 0 && `(${detectedSkills.length})`}
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
                                            'Extract Text & Analyze Skills'
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