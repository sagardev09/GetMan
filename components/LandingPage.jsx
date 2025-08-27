"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Code2,
  Globe,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Star,
  Github,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import AuthModal from "./auth/AuthModal";
import UserDropdown from "./UserDropdown";
import { ThemeToggle } from "./theme-toggle";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const openSignIn = () => {
    setAuthMode("signin");
    setShowAuthModal(true);
  };

  const openSignUp = () => {
    setAuthMode("signup");
    setShowAuthModal(true);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 dark:border-slate-700 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-400 opacity-20 mx-auto"></div>
          </div>
          <p className="text-muted-foreground font-medium">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden ">
        <div className="container mx-auto">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
              style={{
                left: mousePosition.x * 0.02 + "%",
                top: mousePosition.y * 0.02 + "%",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-bounce [animation-duration:3s]" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
          </div>

          {/* Header */}
          <header className="relative z-10 border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
            <div className="container flex h-20 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                  </div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    GetMan
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-pulse"
                >
                  v2.0
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={goToDashboard}
                      className="group hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800 transition-all duration-300 bg-transparent"
                    >
                      Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    <UserDropdown user={user} />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={openSignIn}
                      className="hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={openSignUp}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative z-10 container py-32 lg:py-40">
            <div className="text-center space-y-12 max-w-5xl mx-auto">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-full px-6 py-3 shadow-lg animate-fade-in">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    The Modern API Testing Tool
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                  Test APIs Like a{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                      Pro
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-lg animate-pulse" />
                  </span>
                </h1>

                <p className="mx-auto max-w-3xl text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  A lightweight, powerful alternative to Postman. Test, debug,
                  and document your APIs with beautiful code generation and
                  seamless collaboration.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {user ? (
                  <Button
                    size="lg"
                    onClick={goToDashboard}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Open Dashboard
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={openSignUp}
                      className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                    >
                      Start Testing APIs
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={openSignIn}
                      className="text-lg px-8 py-4 h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800 transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center space-x-2 text-lg">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <span className="ml-3 text-slate-600 dark:text-slate-300 font-medium">
                  Trusted by developers worldwide
                </span>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative z-10 container py-32">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Everything You Need
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                From simple GET requests to complex API workflows, GetMan
                provides all the tools you need for efficient API development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Code2,
                  title: "Code Generation",
                  description:
                    "Generate ready-to-use code snippets in 6+ languages including JavaScript, Python, Go, and more.",
                  color: "blue",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Globe,
                  title: "Universal Compatibility",
                  description:
                    "Works with any REST API. Import cURL commands, test endpoints, and export results effortlessly.",
                  color: "green",
                  gradient: "from-green-500 to-emerald-500",
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description:
                    "Your API keys and sensitive data remain secure with enterprise-grade encryption and privacy.",
                  color: "purple",
                  gradient: "from-purple-500 to-violet-500",
                },
                {
                  icon: Clock,
                  title: "Request History",
                  description:
                    "Track all your API requests with detailed history, response times, and status codes.",
                  color: "orange",
                  gradient: "from-orange-500 to-red-500",
                },
                {
                  icon: Users,
                  title: "Team Collections",
                  description:
                    "Organize requests into collections and share them with your team for better collaboration.",
                  color: "pink",
                  gradient: "from-pink-500 to-rose-500",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description:
                    "Built for speed with modern tech stack. Test APIs instantly without any lag or delays.",
                  color: "teal",
                  gradient: "from-teal-500 to-cyan-500",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group border-0 shadow-lg hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300`}
                      />
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="relative z-10 container py-32">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Loved by Developers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "GetMan has completely transformed how our team tests APIs. The code generation feature alone saves us hours every week.",
                  author: "Sarah Chen",
                  role: "Senior Developer at TechCorp",
                },
                {
                  quote:
                    "Finally, a Postman alternative that doesn't feel bloated. Clean, fast, and exactly what we needed.",
                  author: "Marcus Rodriguez",
                  role: "API Lead at StartupXYZ",
                },
                {
                  quote:
                    "The collaboration features are game-changing. Our entire team can now work seamlessly on API testing.",
                  author: "Emily Johnson",
                  role: "Engineering Manager",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-8">
                    <div className="flex space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative z-10 container py-32">
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-16 text-center text-white overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-sm" />
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Supercharge Your API Testing?
                </h2>
                <p className="text-blue-100 mb-10 max-w-3xl mx-auto text-xl leading-relaxed">
                  Join thousands of developers who trust GetMan for their API
                  testing needs. Start building better APIs today.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {user ? (
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={goToDashboard}
                      className="group text-lg px-8 py-4 h-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={openSignUp}
                        className="group text-lg px-8 py-4 h-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        Get Started for Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <div className="flex items-center space-x-2 text-blue-100">
                        <CheckCircle className="w-5 h-5" />
                        <span>No credit card required</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative z-10 border-t border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="container py-12">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    GetMan
                  </span>
                </div>

                <div className="flex items-center space-x-8 text-slate-600 dark:text-slate-300">
                  <span className="text-sm">
                    © 2024 GetMan. All rights reserved.
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300 hover:scale-110"
                  >
                    <Github className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </div>
    </div>
  );
}
