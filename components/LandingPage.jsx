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
    <div className="w-full ">
      {/* Header */}
      <header className="sticky mx-auto container top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground text-balance">
              GetMan
            </span>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              v2.0
            </Badge>
          </div>

          <div className="flex items-center gap-2">
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

      <main className="w-full mx-auto">
        {/* Hero */}
        <section className="container mx-auto py-16 lg:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* Left: headline and CTAs */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  The Modern API Testing Tool
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-balance">
                Test APIs Like a{" "}
                <span className="inline-block text-blue-600">Pro</span>
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                A lightweight, powerful alternative to Postman. Test, debug, and
                document your APIs with beautiful code generation and seamless
                collaboration.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  size="lg"
                  className="group bg-blue-600 hover:bg-blue-700 text-white text-base px-7 h-11"
                  asChild
                >
                  <a href="/signup">
                    Start Testing APIs
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-7 h-11 bg-transparent"
                  asChild
                >
                  <a href="/sign-in">Sign In</a>
                </Button>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>No credit card required</span>
              </div>
            </div>

            {/* Right: presentational code/request preview card */}
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-red-400"
                      aria-hidden
                    />
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-yellow-400"
                      aria-hidden
                    />
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-green-400"
                      aria-hidden
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Request Preview
                  </span>
                </div>

                {/* Request builder row */}
                <div className="px-4 py-4 grid gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      GET
                    </Badge>
                    <div className="flex-1 rounded-md border bg-background px-3 py-2 text-sm font-mono truncate">
                      https://api.example.dev/v1/users?id=42
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Send
                    </Button>
                  </div>

                  {/* Response */}
                  <div className="rounded-md border bg-muted/40">
                    <div className="flex items-center justify-between border-b px-3 py-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-0.5">
                          200 OK
                        </span>
                        <span className="text-muted-foreground">128ms</span>
                        <span className="text-muted-foreground">1.2kb</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        application/json
                      </span>
                    </div>
                    <pre className="p-3 text-xs leading-6 overflow-x-auto font-mono">
                      {`{
  "id": 42,
  "name": "Sarah Chen",
  "email": "sarah@example.dev",
  "roles": ["admin", "editor"]
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From simple GET requests to complex API workflows, GetMan provides
              all the tools you need for efficient API development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary feature: larger span with code */}
            <Card className="lg:col-span-2 border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Code Generation</h3>
                      <p className="text-muted-foreground">
                        Generate ready-to-use snippets in JavaScript, Python,
                        Go, and more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border bg-muted/40">
                  <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-xs text-muted-foreground">
                      JavaScript
                    </span>
                    <Badge variant="secondary" className="font-mono">
                      fetch
                    </Badge>
                  </div>
                  <pre className="p-3 text-xs leading-6 overflow-x-auto font-mono">
                    {`const res = await fetch("https://api.example.dev/v1/users?id=42")
if (!res.ok) throw new Error("Request failed")
const data = await res.json()
console.log(data)`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Other features */}
            <Card className="border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Universal Compatibility
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Works with any REST API. Import cURL, test endpoints, and
                  export results effortlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your API keys and sensitive data stay safe with
                  enterprise-grade encryption and privacy.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Request History</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track every request with detailed history, response times, and
                  status codes.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Team Collections</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Organize requests into collections and share them for seamless
                  collaboration.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Loved by Developers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            ].map((t, i) => (
              <Card
                key={i}
                className="border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3" aria-label="5 star rating">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-5 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center"
                      aria-hidden
                    >
                      <span className="text-white font-semibold text-xs">
                        {t.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{t.author}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto py-20">
          <div className="rounded-2xl border p-10 text-center bg-card">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Supercharge Your API Testing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Join thousands of developers who trust GetMan for their API
              testing needs. Start building better APIs today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="group bg-blue-600 hover:bg-blue-700 text-white text-base px-7 h-11"
                asChild
              >
                <a href="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mx-auto">
        <div className="container mx-auto py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">GetMan</span>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="text-sm">
                © 2024 GetMan. All rights reserved.
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent"
                asChild
              >
                <a
                  href="https://github.com"
                  rel="noreferrer"
                  target="_blank"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
