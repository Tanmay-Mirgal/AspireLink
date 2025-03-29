"use client"

import React, { useEffect, useRef } from "react"
import {
  ArrowRight,
  Play,
  Users,
  BookOpen,
  Target,
  Rocket,
  Briefcase,
  MessageCircle,
  Award,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion"

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="text-primary" size={48} />,
      title: "Resume Analyzer",
      description:
        "Advanced AI-powered tool that provides comprehensive insights and optimization recommendations for your professional resume.",
    },
    {
      icon: <BookOpen className="text-primary" size={48} />,
      title: "Mock Interviews",
      description:
        "Realistic interview simulations with AI feedback, helping you build confidence and improve your communication skills.",
    },
    {
      icon: <Target className="text-primary" size={48} />,
      title: "Skill Matching",
      description:
        "Intelligent algorithm that aligns your skills with industry demands and personalized career opportunities.",
    },
    {
      icon: <Briefcase className="text-primary" size={48} />,
      title: "Career Tracker",
      description:
        "Comprehensive dashboard to monitor your professional growth, set goals, and track your career progression.",
    },
    {
      icon: <MessageCircle className="text-primary" size={48} />,
      title: "Mentorship",
      description: "Connect with experienced professionals who provide personalized guidance and industry insights.",
    },
    {
      icon: <Rocket className="text-primary" size={48} />,
      title: "Job Opportunities",
      description: "Curated job listings and networking connections tailored to your skills and career aspirations.",
    },
  ]

  const howItWorks = [
    {
      icon: <Rocket className="text-primary" size={32} />,
      title: "Create Profile",
      description: "Build a comprehensive professional profile",
    },
    {
      icon: <Briefcase className="text-primary" size={32} />,
      title: "Skill Matching",
      description: "Get matched with relevant opportunities",
    },
    {
      icon: <MessageCircle className="text-primary" size={32} />,
      title: "Mentor Connect",
      description: "Engage with industry professionals",
    },
    {
      icon: <Award className="text-primary" size={32} />,
      title: "Career Growth",
      description: "Continuous learning and development",
    },
  ]

  // Animated text for hero section - Fixed by ensuring all words have similar length
  const words = ["Career", "Future", "Growth"]
  const [currentWord, setCurrentWord] = React.useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Scroll animations
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Refs for scroll-triggered animations
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.2 })

  const howItWorksRef = useRef(null)
  const howItWorksInView = useInView(howItWorksRef, { once: false, amount: 0.2 })

  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.5 })

  // Background animation elements
  const backgroundElements = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left" style={{ scaleX }} />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {backgroundElements.map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-primary/5"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              x: Math.random() * 100 + index * 50,
              y: Math.random() * 100 + index * 50,
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="min-h-screen px-6 md:px-24 flex items-center relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge variant="outline" className="bg-primary/10 text-primary px-4 py-2 text-sm border-primary/20">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  New Platform Release
                </motion.span>
              </Badge>
            </motion.div>

            <motion.h1
              className="font-black text-6xl md:text-8xl leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Accelerate Your{" "}
              {/* Fixed animation container to prevent overlap */}
              <span className="relative inline-block h-16 md:h-20 w-full md:w-auto">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    className="absolute text-primary font-black text-6xl md:text-8xl"
                    style={{ textShadow: "0 1px 2px rgba(124, 58, 237, 0.2)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {words[currentWord]}
                  </motion.span>
                </AnimatePresence>
                <span className="opacity-0">{words[0]}</span>
              </span>
              <br className="hidden sm:block" />
              <span>Journey</span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-xl pr-0 md:pr-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A comprehensive platform connecting students with mentors, industry experts, and career opportunities
              through innovative skill assessment and networking tools.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="group relative overflow-hidden">
                <motion.span
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  initial={{ scale: 0, x: "-100%" }}
                  whileHover={{ scale: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>

              <Button variant="outline" size="lg" className="group relative overflow-hidden">
                <motion.span
                  className="absolute inset-0 bg-primary/5 rounded-md"
                  initial={{ scale: 0, x: "-100%" }}
                  whileHover={{ scale: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <Play className="relative z-10 mr-2 text-primary" size={20} />
                <span className="relative z-10">Watch Demo</span>
                <ChevronRight
                  className="relative z-10 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  size={16}
                />
              </Button>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              delay: 0.3,
              type: "spring",
              stiffness: 100,
            }}
          >
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-300/10 to-primary/5 rounded-xl blur-xl"
              animate={{
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 0.95, 1],
              }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
            <div
              className="bg-card rounded-2xl p-6 
              border border-border shadow-xl overflow-hidden relative backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              <div className="grid grid-cols-3 gap-4 relative z-10">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.div
                    key={item}
                    className="bg-background/80 h-24 rounded-lg 
                    flex items-center justify-center backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * item }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full bg-primary/20"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2 + item * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Details Section */}
      <div className="py-24 px-6 md:px-24 bg-muted/30 relative" ref={featuresRef}>
        {/* Background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: featuresInView ? 1 : 0 }}
          transition={{ duration: 1 }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: featuresInView ? 1 : 0.9, opacity: featuresInView ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Career Development Platform</h2>
            </motion.div>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore the powerful tools designed to transform your professional journey
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: featuresInView ? 1 : 0,
                  y: featuresInView ? 0 : 50,
                }}
                transition={{
                  duration: 0.6,
                  delay: featuresInView ? index * 0.1 : 0,
                }}
              >
                <Card className="h-full border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden group">
                  <CardContent className="p-8 relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    />
                    <motion.div
                      className="mb-6 relative z-10"
                      whileHover={{ scale: 1.1, rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <motion.h3
                      className="text-2xl font-semibold mb-4 relative z-10"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <p className="text-muted-foreground relative z-10">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 md:px-24 bg-background relative" ref={howItWorksRef}>
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: howItWorksInView ? 1 : 0,
            opacity: howItWorksInView ? 1 : 0,
          }}
          transition={{ duration: 1.5 }}
        />

        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: howItWorksInView ? 1 : 0,
              y: howItWorksInView ? 0 : 30,
            }}
            transition={{ duration: 0.8 }}
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <motion.div
              className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-primary/20 hidden md:block"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: howItWorksInView ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-lg text-center border border-border/40 hover:border-primary/30 transition-all duration-300 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: howItWorksInView ? 1 : 0,
                  y: howItWorksInView ? 0 : 30,
                }}
                transition={{
                  duration: 0.6,
                  delay: howItWorksInView ? 0.2 + index * 0.15 : 0,
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.15)",
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full relative"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: howItWorksInView ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: howItWorksInView ? 0.4 + index * 0.15 : 0,
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(124, 58, 237, 0.2)",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Step number */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: howItWorksInView ? 1 : 0 }}
                    transition={{
                      delay: howItWorksInView ? 0.6 + index * 0.15 : 0,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    {index + 1}
                  </motion.div>
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: howItWorksInView ? 1 : 0 }}
                  transition={{
                    duration: 0.6,
                    delay: howItWorksInView ? 0.5 + index * 0.15 : 0,
                  }}
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: howItWorksInView ? 1 : 0 }}
                  transition={{
                    duration: 0.6,
                    delay: howItWorksInView ? 0.6 + index * 0.15 : 0,
                  }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 px-6 md:px-24 bg-muted/30 relative" ref={ctaRef}>
        {/* Background animation */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: ctaInView ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute -inset-[100px] bg-gradient-to-r from-primary/5 via-purple-300/10 to-primary/5 rounded-full blur-3xl"
            animate={{
              rotate: [0, 180],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: ctaInView ? 1 : 0,
            y: ctaInView ? 0 : 50,
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: ctaInView ? 1 : 0,
              y: ctaInView ? 0 : 30,
            }}
            transition={{ duration: 0.8 }}
          >
            Ready to Transform Your Career?
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: ctaInView ? 1 : 0,
              y: ctaInView ? 0 : 30,
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of students who have accelerated their career growth with our comprehensive platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: ctaInView ? 1 : 0,
              y: ctaInView ? 0 : 30,
            }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button size="lg" className="group relative overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 rounded-md"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative z-10">Create Free Account</span>
              <ArrowRight className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" size={24} />
            </Button>

            <Button variant="outline" size="lg" className="group relative overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-primary/10 rounded-md"
                initial={{ scale: 0, x: "-100%" }}
                whileHover={{ scale: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Learn More</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage