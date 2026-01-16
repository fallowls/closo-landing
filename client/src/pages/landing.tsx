import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  PhoneCall,
  Mic,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Globe,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  X,
  Menu,
  Play,
  TrendingUp,
  Lock,
  Headphones,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  Target,
  Award,
  Voicemail,
  Radio,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneForwarded,
  Volume2,
  Wifi,
  Activity,
  Layers,
  GitBranch,
  Database,
  Code,
  Smartphone,
  Laptop,
  CloudLightning,
  AlertCircle,
  BarChart2
} from "lucide-react";
import { setAuthenticated } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import closoLogo from "@assets/closo_logo_1768558290200.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";

export default function Landing() {
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedCode, setTypedCode] = useState("");
  const [hoveredCapability, setHoveredCapability] = useState(0);
  const [showHeader, setShowHeader] = useState(false);

  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const authMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/auth", { password });
      return response.json();
    },
    onSuccess: (data: any) => {
      setAuthenticated(true);
      localStorage.setItem("auth_token", data.token);
      toast({ title: "Access granted", description: "Welcome to the dashboard!" });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({ title: "Access denied", description: "Invalid credentials", variant: "destructive" });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const codeSnippets = [
    `const client = new Fallowl({
  apiKey: process.env.FALLOWL_API_KEY
});

// Make an outbound call
await client.calls.create({
  to: '+1234567890',
  from: '+0987654321',
  record: true,
  voicemail: {
    enabled: true,
    greeting: 'custom-greeting.mp3'
  }
});`,
    `// iOS SDK Example
import FallowlSDK

let fallowl = Fallowl(apiKey: apiKey)

// Make a call
fallowl.makeCall(
  to: "+1234567890",
  from: "+0987654321"
) { result in
  print("Call initiated")
}`,
    `// Web SDK for browser calling
const fallowl = new FallowlWeb({
  apiKey: 'your-api-key'
});

// Initialize browser calling
await fallowl.initializeDevice();

// Make a call from browser
await fallowl.call({
  to: '+1234567890',
  enableVideo: false
});`,
    `// Webhook configuration
POST https://api.fallowl.com/webhooks

{
  "url": "https://yourapp.com/webhook",
  "events": [
    "call.started",
    "call.completed",
    "call.failed"
  ]
}`
  ];

  useEffect(() => {
    const codeText = codeSnippets[hoveredCapability];
    let currentIndex = 0;
    setTypedCode('');
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= codeText.length) {
        setTypedCode(codeText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          currentIndex = 0;
          setTypedCode('');
        }, 2000);
      }
    }, 30);
    
    return () => clearInterval(typingInterval);
  }, [hoveredCapability]);

  const handleYearClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setShowPasswordField(true);
      setClickCount(0);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      authMutation.mutate(password);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-slate-900 overflow-x-hidden">
      <SEO 
        title="Twilio Dialer & Parallel Dialer with Sales CRM Integration | Closo"
        description="Enterprise Twilio dialer with parallel dialing & sales CRM integration. Auto dialer software for sales teams with AI calling, real-time analytics & Twilio API integration. Free trial."
        keywords="twilio dialer, parallel dialer, sales crm integration, twilio auto dialer, twilio power dialer, parallel dialing software, auto dialer crm, twilio call center software, sales dialer software, twilio predictive dialer"
        canonical="https://closo.com/"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Closo - Twilio Dialer & Parallel Dialing CRM Software",
          "applicationCategory": "BusinessApplication",
          "description": "Enterprise Twilio dialer with parallel dialing and sales CRM integration for maximum sales productivity",
          "url": "https://closo.com",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
      
      {/* Navigation */}
      <nav className={`${showHeader ? 'fixed top-0 animate-in slide-in-from-top duration-300' : 'relative top-4'} left-0 right-0 z-50 px-4 md:px-6 lg:px-8 ${!showHeader && 'mb-8'} transition-all`}>
        <div className={`max-w-7xl mx-auto bg-white/80 backdrop-blur-xl ${showHeader ? 'rounded-b-2xl mt-0' : 'rounded-2xl mt-0'} border border-gray-200/50 shadow-lg shadow-slate-900/5`}>
          <div className="px-4 md:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img 
                  src={closoLogo} 
                  alt="Closo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/features" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" data-testid="link-features">Features</Link>
                <a href="#integrations" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" data-testid="link-integrations">Integrations</a>
                <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" data-testid="link-about">About</Link>
                <Link href="/api-docs" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" data-testid="link-api-docs">API Doc</Link>
                <Button 
                  size="sm" 
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-xl" 
                  data-testid="button-signin"
                  onClick={() => window.location.href = 'https://app.fallowl.com'}
                >
                  Sign in
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
                data-testid="button-mobile-menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top">
                <div className="flex flex-col space-y-3">
                  <Link href="/features" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" data-testid="link-mobile-features">Features</Link>
                  <a href="#integrations" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" data-testid="link-mobile-integrations">Integrations</a>
                  <Link href="/about" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" data-testid="link-mobile-about">About</Link>
                  <Link href="/api-docs" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" data-testid="link-mobile-api-docs">API Doc</Link>
                  <div className="px-4 pt-2">
                    <Button 
                      size="sm" 
                      className="bg-slate-900 hover:bg-slate-800 text-white w-full rounded-xl" 
                      data-testid="button-mobile-signin"
                      onClick={() => window.location.href = 'https://app.fallowl.com'}
                    >
                      Sign in
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 lg:px-8 relative overflow-hidden bg-[#F8F7F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top badge text */}
            <p className="text-sm text-slate-600 mb-8 animate-in fade-in slide-in-from-top duration-500">
              Powered by <Link href="/twilio-setup" className="text-purple-600 hover:text-purple-700 font-medium hover:underline" data-testid="link-twilio-setup">Twilio's Enterprise Infrastructure</Link>
            </p>
            
            {/* Main heading with colored text */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom duration-700 text-slate-900">
              The Future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                Cloud
              </span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
                Communications
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000">
              Complete CRM platform with HD calling, automatic recording, voicemail, and programmable voice—all in one place.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-in fade-in slide-in-from-bottom duration-1000">
              <Button 
                size="lg" 
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all rounded-lg" 
                data-testid="button-hero-trial"
                onClick={() => window.location.href = 'https://app.fallowl.com'}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 h-12 text-base border-2 border-slate-300 text-slate-700 hover:bg-white rounded-lg" 
                data-testid="button-hero-demo"
                onClick={() => setLocation("/demo")}
              >
                Schedule Demo
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 animate-in fade-in slide-in-from-bottom duration-1000" style={{animationDelay: '200ms'}}>
              {/* Card 1 */}
              <div className="text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">HD Voice Calling</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Crystal-clear voice quality powered by Twilio infrastructure
                </p>
              </div>

              {/* Card 2 */}
              <div className="text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">Auto Recording</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every call captured automatically with unlimited storage
                </p>
              </div>

              {/* Card 3 */}
              <div className="text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">Full Platform Access</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete CRM integration with all communication tools
                </p>
              </div>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-20 relative animate-in fade-in slide-in-from-bottom duration-1000" style={{animationDelay: '300ms'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-3xl border border-gray-200 p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                      <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">HD Voice Calling</h3>
                    <p className="text-sm text-slate-600 mb-4">Crystal-clear voice quality with Twilio</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Quality</span>
                        <span className="font-medium">HD Audio</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 w-[99%] animate-in slide-in-from-left duration-1000"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all transform hover:scale-105" style={{animationDelay: '100ms'}}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Auto Recording</h3>
                    <p className="text-sm text-slate-600 mb-4">Every call captured automatically</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Storage</span>
                        <span className="font-medium">Unlimited</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 w-[85%] animate-in slide-in-from-left duration-1000"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all transform hover:scale-105" style={{animationDelay: '200ms'}}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                    <p className="text-sm text-slate-600 mb-4">Track every metric that matters</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Insights</span>
                        <span className="font-medium">Live</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-pink-500 w-[92%] animate-in slide-in-from-left duration-1000"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Complete Communication Platform
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need for modern business communications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: PhoneOutgoing, 
                title: "Outbound Calling", 
                desc: "Make unlimited high-quality calls to any number worldwide",
                color: "from-purple-500 to-purple-600",
                delay: "0ms"
              },
              { 
                icon: PhoneIncoming, 
                title: "Inbound Calling", 
                desc: "Receive calls with intelligent routing and forwarding",
                color: "from-teal-500 to-cyan-500",
                delay: "100ms"
              },
              { 
                icon: Mic, 
                title: "Call Recording", 
                desc: "Automatic recording with searchable transcriptions",
                color: "from-orange-400 to-pink-500",
                delay: "200ms"
              },
              { 
                icon: Voicemail, 
                title: "Voicemail", 
                desc: "Professional voicemail with instant notifications",
                color: "from-purple-500 to-purple-600",
                delay: "300ms"
              },
              { 
                icon: Radio, 
                title: "Programmable Voice", 
                desc: "Build custom voice workflows with our API",
                color: "from-teal-500 to-cyan-500",
                delay: "400ms"
              },
              { 
                icon: PhoneForwarded, 
                title: "Call Forwarding", 
                desc: "Route calls intelligently based on your rules",
                color: "from-orange-400 to-pink-500",
                delay: "500ms"
              },
              { 
                icon: Volume2, 
                title: "Interactive Voice Response", 
                desc: "Create custom IVR menus for better call routing",
                color: "from-purple-500 to-purple-600",
                delay: "600ms"
              },
              { 
                icon: Users, 
                title: "Conference Calling", 
                desc: "Host multi-party calls with up to 100 participants",
                color: "from-teal-500 to-cyan-500",
                delay: "700ms"
              },
              { 
                icon: MessageSquare, 
                title: "SMS Integration", 
                desc: "Send and receive text messages alongside calls",
                color: "from-orange-400 to-pink-500",
                delay: "800ms"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white border-gray-200 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 group animate-in fade-in slide-in-from-bottom" 
                  style={{animationDelay: feature.delay}}
                  data-testid={`card-feature-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2" data-testid={`text-feature-title-${index}`}>{feature.title}</h3>
                    <p className="text-sm text-slate-600" data-testid={`text-feature-desc-${index}`}>{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Capabilities Section */}
      <section id="capabilities" className="py-24 bg-[#F8F7F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Built for Developers
            </h2>
            <p className="text-lg text-slate-600">
              Powerful APIs and SDKs for custom integrations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-20">
            <div className="flex flex-col">
              <div className="space-y-3 flex-1">
                {[
                  { icon: Code, title: "RESTful API", desc: "Simple, well-documented API for all features" },
                  { icon: Smartphone, title: "Mobile SDKs", desc: "Native iOS and Android development kits" },
                  { icon: Laptop, title: "Web SDK", desc: "JavaScript SDK for browser-based calling" },
                  { icon: Database, title: "Webhooks", desc: "Real-time event notifications for your app" }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div 
                      key={index} 
                      className={`flex items-start gap-4 group p-4 rounded-xl transition-all cursor-pointer ${
                        hoveredCapability === index 
                          ? 'bg-purple-50 border-2 border-purple-500 scale-[1.02]' 
                          : 'bg-white border-2 border-gray-200 hover:border-purple-300'
                      }`}
                      onMouseEnter={() => setHoveredCapability(index)}
                      data-testid={`capability-${index}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        hoveredCapability === index ? 'bg-slate-900 scale-110' : 'bg-slate-900'
                      }`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                      {hoveredCapability === index && (
                        <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative flex flex-col">
              <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700 flex-1 flex flex-col min-h-[400px]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-400 text-sm ml-4">api.fallowl.com</span>
                </div>
                <pre className="text-sm text-purple-400 font-mono overflow-x-auto flex-1">
{typedCode}<span className="animate-pulse">|</span>
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Intelligent Call Management
            </h2>
            <p className="text-lg text-slate-600">
              <Link href="/features" className="text-purple-600 hover:text-purple-700 font-medium hover:underline" data-testid="link-advanced-features">Advanced features</Link> that help you manage calls more efficiently
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="space-y-3">
                {[
                  { icon: Wifi, title: "Auto-reconnect", desc: "Never lose a call due to network issues", active: activeFeature === 0 },
                  { icon: Activity, title: "Call Quality Monitoring", desc: "Real-time quality metrics and alerts", active: activeFeature === 1 },
                  { icon: Lock, title: "Secure Calling", desc: "Encrypted connections for all communications", active: activeFeature === 2 },
                  { icon: CloudLightning, title: "Global Infrastructure", desc: "Low latency calling powered by Twilio's global network", active: activeFeature === 3 },
                  { icon: AlertCircle, title: "Smart Notifications", desc: "Intelligent alerts for important calls", active: activeFeature === 4 },
                  { icon: BarChart2, title: "Advanced Analytics", desc: "Deep insights into call patterns", active: activeFeature === 5 }
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-xl transition-all duration-500 ease-in-out cursor-pointer transform ${
                        feature.active 
                          ? 'bg-purple-50 border-2 border-purple-500 scale-[1.02]' 
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300 hover:scale-[1.01]'
                      }`}
                      onMouseEnter={() => setActiveFeature(index)}
                      data-testid={`interactive-feature-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500 ${
                          feature.active ? 'bg-slate-900' : 'bg-white'
                        }`}>
                          <IconComponent className={`w-4 h-4 transition-colors duration-500 ${feature.active ? 'text-white' : 'text-slate-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{feature.title}</h4>
                          <p className="text-xs text-slate-600 truncate">{feature.desc}</p>
                        </div>
                        {feature.active && (
                          <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative h-full">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-xl h-full flex items-center justify-center">
                {/* Auto-reconnect */}
                {activeFeature === 0 && (
                  <div key="feature-0" className="w-full animate-in fade-in duration-700 ease-out">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Reconnect Speed</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          &lt;2s
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Success Rate</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          99.8%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Auto-Recovery</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          Active
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Network Fallback</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          5G/4G
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center h-28">
                      <Wifi className="w-20 h-20 text-teal-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Call Quality Monitoring */}
                {activeFeature === 1 && (
                  <div key="feature-1" className="w-full animate-in fade-in duration-700 ease-out">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Audio Quality</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          HD+
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Jitter</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          &lt;30ms
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Packet Loss</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          0.1%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">MOS Score</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          4.5/5
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-500">Quality Level</span>
                        <span className="text-xs font-semibold text-purple-600">Excellent</span>
                      </div>
                      <div className="grid grid-cols-8 gap-2 items-end h-20">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i} 
                            className="bg-gradient-to-t from-purple-500 to-purple-600 rounded transition-all duration-500"
                            style={{
                              height: `${40 + i * 7}%`,
                              animationDelay: `${i * 50}ms`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Secure Calling */}
                {activeFeature === 2 && (
                  <div key="feature-2" className="w-full animate-in fade-in duration-700 ease-out">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Connection</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          Secure
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Protocol</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          HTTPS
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Data Privacy</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          Private
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Provider</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          Twilio
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center h-28">
                      <Lock className="w-20 h-20 text-orange-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Global Infrastructure */}
                {activeFeature === 3 && (
                  <div key="feature-3" className="w-full animate-in fade-in duration-700 ease-out">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Infrastructure</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          Twilio
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Latency</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          Low
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Coverage</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          Global
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Reliability</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                          High
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center h-28">
                      <CloudLightning className="w-20 h-20 text-teal-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Smart Notifications */}
                {activeFeature === 4 && (
                  <div key="feature-4" className="w-full animate-in fade-in duration-700 ease-out">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Channels</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          5+
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Response Time</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          Instant
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">AI Priority</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          Smart
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Delivery</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                          100%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center h-28">
                      <AlertCircle className="w-20 h-20 text-purple-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Advanced Analytics */}
                {activeFeature === 5 && (
                  <div key="feature-5" className="w-full animate-in fade-in duration-700 ease-out">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Data Points</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          50+
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Real-time</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          Live
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Reports</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          Custom
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 transition-all duration-300 hover:shadow-md">
                        <div className="text-xs text-slate-500 mb-1">Insights</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                          AI
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-12 gap-1 items-end h-24">
                        {[65, 45, 78, 90, 55, 67, 82, 48, 92, 71, 58, 85].map((height, i) => (
                          <div 
                            key={i} 
                            className="bg-gradient-to-t from-orange-400 to-pink-500 rounded-sm transition-all duration-500"
                            style={{
                              height: `${height}%`,
                              animationDelay: `${i * 40}ms`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Parallel Dialing Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Parallel Dialing?
            </h2>
            <p className="text-slate-300 text-lg">
              Multiply your team's productivity with simultaneous calling
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Zap, 
                title: "10x Faster Outreach", 
                desc: "Call multiple leads simultaneously instead of one at a time. Reach more prospects in less time."
              },
              { 
                icon: Target, 
                title: "Higher Connect Rates", 
                desc: "Automatically connect to the first person who answers, eliminating wait time between calls."
              },
              { 
                icon: TrendingUp, 
                title: "Maximize Agent Time", 
                desc: "Your team spends more time talking to prospects, less time dialing and waiting."
              },
              { 
                icon: BarChart3, 
                title: "Real-Time Analytics", 
                desc: "Track call metrics, conversion rates, and team performance with live dashboards."
              },
              { 
                icon: Clock, 
                title: "Automated Workflows", 
                desc: "Set up call sequences, follow-ups, and reminders that run on autopilot."
              },
              { 
                icon: Users, 
                title: "Smart Call Distribution", 
                desc: "Intelligently route calls to the right team members based on skills and availability."
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 group"
                  data-testid={`benefit-${index}`}
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Visual Comparison */}
          <div className="mt-20 grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-red-400">Traditional Dialing</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">One call at a time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-slate-300">Wait for each call to complete</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-slate-300">Manual redialing</span>
                </div>
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Average Calls/Hour</div>
                  <div className="text-4xl font-bold text-red-400">20-30</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-6 text-emerald-400">Parallel Dialing</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium">Multiple simultaneous calls</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium">Auto-connect to first answer</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium">Intelligent call routing</span>
                </div>
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Average Calls/Hour</div>
                  <div className="text-4xl font-bold text-emerald-400">100-150+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Seamless Integrations
            </h2>
            <p className="text-lg text-slate-600">
              Connect with your favorite tools and platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {[
              "Salesforce", "HubSpot", "Zapier", "Slack", "Google Workspace", "Microsoft 365",
              "Stripe", "Intercom", "Zendesk", "Pipedrive", "Zoom", "Calendly",
              "Notion", "Airtable", "Trello", "Asana", "Monday.com", "ClickUp"
            ].map((integration, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 flex items-center justify-center h-24 border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all transform hover:-translate-y-1 group" 
                data-testid={`integration-${index}`}
              >
                <span className="font-semibold text-slate-700 group-hover:text-purple-600 transition-colors">{integration}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2 border-slate-300 hover:border-purple-600 hover:text-purple-600">
              View All Integrations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Animated Flow */}
      <section id="how-it-works" className="py-24 bg-[#F8F7F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              See Parallel Dialing in Action
            </h2>
            <p className="text-lg text-slate-600">
              Watch how our system multiplies your calling efficiency
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Visual Animation Side */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Live Call Distribution</h3>
                
                {/* Simulated calling animation */}
                <div className="space-y-3">
                  {[
                    { number: "+1 (555) 123-4567", status: "Calling...", color: "yellow", delay: "0s" },
                    { number: "+1 (555) 234-5678", status: "Calling...", color: "yellow", delay: "0.2s" },
                    { number: "+1 (555) 345-6789", status: "Connected", color: "green", delay: "0.4s" },
                    { number: "+1 (555) 456-7890", status: "Calling...", color: "yellow", delay: "0.6s" },
                    { number: "+1 (555) 567-8901", status: "No Answer", color: "gray", delay: "0.8s" }
                  ].map((call, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        call.color === 'green' 
                          ? 'bg-emerald-50 border-emerald-500 animate-pulse' 
                          : call.color === 'yellow'
                          ? 'bg-yellow-50 border-yellow-500'
                          : 'bg-gray-50 border-gray-300'
                      } transition-all duration-500`}
                      style={{animationDelay: call.delay}}
                      data-testid={`call-demo-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          call.color === 'green' 
                            ? 'bg-emerald-500' 
                            : call.color === 'yellow'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}>
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-slate-900">{call.number}</div>
                          <div className={`text-xs ${
                            call.color === 'green' 
                              ? 'text-emerald-600 font-semibold' 
                              : call.color === 'yellow'
                              ? 'text-yellow-600'
                              : 'text-gray-500'
                          }`}>
                            {call.status}
                          </div>
                        </div>
                      </div>
                      {call.color === 'green' && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 animate-bounce" />
                      )}
                      {call.color === 'yellow' && (
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-600 mb-0.5">Active Calls</div>
                      <div className="text-2xl font-bold text-slate-900">5</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-0.5">Connected</div>
                      <div className="text-2xl font-bold text-slate-900">1</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-0.5">Success Rate</div>
                      <div className="text-2xl font-bold text-slate-900">20%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating animation elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Steps Side */}
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Upload Your Contact List",
                  desc: "Import contacts from CSV, CRM, or add manually. Organize by campaign or tags.",
                  icon: Upload
                },
                {
                  step: "2",
                  title: "Configure Call Settings",
                  desc: "Set how many simultaneous calls to make, choose your caller ID, and customize call scripts.",
                  icon: Settings
                },
                {
                  step: "3",
                  title: "Launch Campaign",
                  desc: "Start dialing multiple numbers at once. The system automatically connects you to answered calls.",
                  icon: Play
                },
                {
                  step: "4",
                  title: "Track & Optimize",
                  desc: "Monitor real-time analytics, review recordings, and adjust your strategy for better results.",
                  icon: BarChart3
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={index}
                    className="flex gap-3 items-start group"
                    data-testid={`step-${index}`}
                  >
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400">STEP {item.step}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600">
              Powerful features built for modern sales teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Search, 
                title: "Smart Lead Filtering", 
                desc: "Filter and segment contacts based on custom criteria for targeted campaigns"
              },
              { 
                icon: Calendar, 
                title: "Schedule Campaigns", 
                desc: "Set up automated call campaigns to run at optimal times"
              },
              { 
                icon: FileText, 
                title: "Call Scripts", 
                desc: "Create and display dynamic scripts to guide your conversations"
              },
              { 
                icon: Headphones, 
                title: "Call Monitoring", 
                desc: "Listen in on live calls for training and quality assurance"
              },
              { 
                icon: Download, 
                title: "Export Reports", 
                desc: "Download detailed analytics and call data in multiple formats"
              },
              { 
                icon: MessageSquare, 
                title: "Post-Call Notes", 
                desc: "Automatically log notes and outcomes after each conversation"
              },
              { 
                icon: Filter, 
                title: "Custom Fields", 
                desc: "Add unlimited custom fields to track what matters to your business"
              },
              { 
                icon: GitBranch, 
                title: "Multi-Campaign", 
                desc: "Run multiple calling campaigns simultaneously with different settings"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  data-testid={`advanced-feature-${index}`}
                >
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Calling?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Experience the power of parallel dialing and multiply your team's productivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-10 h-14 text-lg shadow-xl transform hover:scale-105 transition-all" data-testid="button-cta-trial" onClick={() => window.location.href = 'https://app.fallowl.com'}>
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-purple-700 px-10 h-14 text-lg transition-all" data-testid="button-cta-demo" onClick={() => setLocation("/demo")}>
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-purple-100 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
