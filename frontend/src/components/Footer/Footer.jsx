"use client"

import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  ArrowUp,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Resume Analyzer", href: "/resume-analyzer" },
        { name: "Mock Interviews", href: "/mock-interviews" },
        { name: "Skill Matching", href: "/skill-matching" },
        { name: "Career Tracker", href: "/career-tracker" },
        { name: "Mentorship", href: "/mentorship" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Guides", href: "/guides" },
        { name: "Support", href: "/support" },
        { name: "API", href: "/api" },
        { name: "Community", href: "/community" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" },
        { name: "Accessibility", href: "/accessibility" },
      ],
    },
  ]

  const socialLinks = [
    { icon: <Twitter size={20} />, href: "https://twitter.com/aspirelink", label: "Twitter" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com/company/aspirelink", label: "LinkedIn" },
    { icon: <Instagram size={20} />, href: "https://instagram.com/aspirelink", label: "Instagram" },
    { icon: <Github size={20} />, href: "https://github.com/aspirelink", label: "GitHub" },
    { icon: <Mail size={20} />, href: "mailto:contact@aspirelink.com", label: "Email" },
  ]

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-muted/30 border-t border-border/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/5"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [Math.random() * 50, Math.random() * -50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 lg:px-24 relative z-10">
        {/* Top section with logo and newsletter */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 pb-12 border-b border-border/20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold text-foreground">
                Aspire<span className="text-primary">Link</span>
              </h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Connecting students with opportunities and mentors for successful career development.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground">
              Get the latest career tips, job opportunities, and AspireLink updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background border-border/40 focus-visible:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section with copyright and back to top */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm mb-4 md:mb-0"
          >
            © {new Date().getFullYear()} AspireLink. All rights reserved. Made with{" "}
            <Heart className="inline-block h-4 w-4 text-red-500" /> for aspiring professionals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="group"
              onClick={scrollToTop}
            >
              <span className="mr-2">Back to top</span>
              <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer