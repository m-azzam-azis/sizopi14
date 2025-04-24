"use client";

import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCheck,
  Code,
  Database,
  Lock,
  Newspaper,
  Search,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export const LandingModule = () => {
  const featuresData = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Management",
      description:
        "Efficiently store and manage your application's data with our robust database solutions.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security",
      description:
        "Keep your data secure with our advanced security features and encryption techniques.",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Advanced Search",
      description:
        "Find what you need quickly with our powerful search functionality.",
    },
    {
      icon: <CheckCheck className="h-8 w-8" />,
      title: "Reliability",
      description:
        "Count on our system to be available when you need it with high uptime and performance.",
    },
  ];

  const teamMembers = [
    {
      name: "John Doe",
      role: "Frontend Developer",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop",
      links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
      links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Sam Wilson",
      role: "UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
      links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop",
      links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
      },
    },
  ];

  // Intersection observer hooks for animations
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, {});

  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, {});

  const developersRef = useRef(null);
  const developersInView = useInView(developersRef, {});

  return (
    <div className="flex flex-col justify-center items-center pt-20 ">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="w-full min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-background to-primary/10 py-20"
      >
        <div className="container max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center  ">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 space-y-6 mx-auto"
          >
            <div className="max-md:mx-auto">
              <div className="text-4xl md:text-6xl font-bold text-foreground text-center md:text-left">
                Next-Generation <br />
                <span className="text-primary">Zoo Management</span>
              </div>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl text-center md:text-left">
                Streamline your workflow and boost productivity with our
                comprehensive solution for managing and analyzing data.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex-1 flex"
          >
            <div className="relative h-[300px] w-[450px] lg:h-[400px] lg:w-[600px] max-w-full p-10">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
              <Image
                src="/hero-image.avif"
                alt="Hero"
                className="relative z-10 object-contain h-full"
                width={600}
                height={400}
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        ref={aboutRef}
        initial={{ opacity: 0 }}
        animate={aboutInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="w-full py-20 bg-card container mx-auto"
      >
        <div className="container max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About Sizopi
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform provides a seamless experience for managing complex
              data systems, allowing you to focus on insights instead of
              infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="bg-background rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link href="/about">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Developers Section */}
      <motion.section
        ref={developersRef}
        initial={{ opacity: 0 }}
        animate={developersInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="w-full py-20 bg-background container mx-auto"
      >
        <div className="container max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The talented developers and designers behind Sizopi working
              together to build innovative solutions for complex problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={developersInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:border-primary/50 transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground">{member.role}</p>
                  <div className="mt-4 flex gap-3">
                    <a
                      href={member.links.github}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Code size={18} />
                    </a>
                    <a
                      href={member.links.linkedin}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// Helper component for the Linkedin icon
const Linkedin = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
