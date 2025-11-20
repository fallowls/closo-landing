import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { 
  Phone, 
  Key, 
  CheckCircle,
  Mail,
  Menu,
  ExternalLink,
  CreditCard,
  Settings,
  Copy,
  Shield,
  Smartphone,
  ArrowRight,
  AlertCircle,
  Image as ImageIcon,
  Globe,
  DollarSign,
  FileText,
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "wouter";
import fallOwlLogo from "@assets/FallOwl_logo_1759280190715.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { useToast } from "@/hooks/use-toast";

export default function TwilioSetup() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-slate-900">
      <SEO 
        title="Twilio Setup Guide - Parallel Dialer & CRM Integration | FallOwl"
        description="Complete Twilio setup guide for parallel dialer and sales CRM integration. Configure Twilio auto dialer, API credentials, phone numbers, and webhooks for FallOwl's sales automation platform."
        keywords="twilio setup, twilio parallel dialer, twilio crm integration, twilio auto dialer setup, twilio api configuration, twilio phone numbers, twilio sales dialer, configure twilio for crm, twilio integration guide, twilio voice api setup"
        ogTitle="Complete Twilio Setup Guide - Parallel Dialer & CRM Integration"
        ogDescription="Step-by-step Twilio setup for parallel dialer and sales CRM. Configure API credentials, phone numbers, and webhooks for automated sales calling."
        ogImage="/favicon.png"
        canonical="https://fallowl.com/twilio-setup"
        schema={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Set Up Twilio for Auto Dialer",
          "description": "Complete guide to setting up Twilio for auto dialer integration",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Create Twilio Account",
              "text": "Sign up for a Twilio account and verify your email address"
            },
            {
              "@type": "HowToStep",
              "name": "Get API Credentials",
              "text": "Navigate to Console and copy your Account SID and Auth Token"
            },
            {
              "@type": "HowToStep",
              "name": "Purchase Phone Number",
              "text": "Buy a Twilio phone number for outbound calling"
            },
            {
              "@type": "HowToStep",
              "name": "Configure Webhooks",
              "text": "Set up webhook URLs for call events and status updates"
            }
          ]
        }}
      />
      {/* Navigation */}
      <nav className="relative top-4 left-0 right-0 z-50 px-4 md:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg shadow-slate-900/5">
          <div className="px-4 md:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center cursor-pointer" onClick={() => setLocation("/")}>
                <img 
                  src={fallOwlLogo} 
                  alt="FallOwl" 
                  className="h-10 w-auto object-contain"
                  data-testid="img-logo"
                />
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="/features" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/features"); }} data-testid="link-nav-features">Features</a>
                <a href="/#integrations" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" data-testid="link-nav-integrations">Integrations</a>
                <a href="/about" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/about"); }} data-testid="link-nav-about">About</a>
                <a href="/api-docs" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/api-docs"); }} data-testid="link-nav-api">API Doc</a>
                <Button 
                  size="sm" 
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-xl"
                  onClick={() => window.location.href = 'https://app.fallowl.com'}
                  data-testid="button-signin"
                >
                  Sign in
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
                data-testid="button-menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <a href="/features" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/features"); }} data-testid="link-mobile-features">Features</a>
                  <a href="/#integrations" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" data-testid="link-mobile-integrations">Integrations</a>
                  <a href="/about" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/about"); }} data-testid="link-mobile-about">About</a>
                  <a href="/api-docs" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/api-docs"); }} data-testid="link-mobile-api">API Doc</a>
                  <div className="px-4 pt-2">
                    <Button 
                      size="sm" 
                      className="bg-slate-900 hover:bg-slate-800 text-white w-full rounded-xl"
                      onClick={() => window.location.href = 'https://app.fallowl.com'}
                      data-testid="button-mobile-signin"
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
      <section className="pt-20 pb-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl mb-8 shadow-lg">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
            Complete Twilio Setup Guide
          </h1>
          <p className="text-lg text-slate-600 mb-4 max-w-3xl mx-auto">
            Step-by-step instructions to create your Twilio account, obtain all necessary API credentials, 
            and configure your dialer for seamless communication.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
            <Shield className="w-4 h-4" />
            <span>Secure setup with Replit's Twilio integration</span>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-1" data-testid="card-info-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">$15 Free</div>
                <p className="text-sm text-slate-600">Trial credit to start, no credit card required initially</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-1" data-testid="card-info-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">3 Keys</div>
                <p className="text-sm text-slate-600">Account SID, Auth Token, and Phone Number</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-1" data-testid="card-info-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">10 Minutes</div>
                <p className="text-sm text-slate-600">Complete setup from start to finish</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-1" data-testid="card-info-3">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">Global</div>
                <p className="text-sm text-slate-600">Phone numbers from 100+ countries</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Setup Guide */}
      <section className="py-12 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Step-by-Step Setup Process
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Follow these detailed steps to get your Twilio credentials and connect them to your dialer. 
              Each step includes screenshots and detailed instructions.
            </p>
          </div>

          {/* Step 1: Create Account */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Create Your Twilio Account</h3>
                <p className="text-slate-600">Sign up for a free trial account with $15 credit</p>
              </div>
            </div>

            <Card className="bg-white border-gray-200 mb-6">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900 mb-3">Account Registration</h4>
                    <ol className="space-y-3 text-slate-700">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                        <span>Visit <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium">twilio.com/try-twilio</a> and click "Sign up" or "Start for free"</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                        <span>Enter your email address, create a strong password, and provide your first and last name</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                        <span>Check your email inbox and click the verification link sent by Twilio</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                        <span>Verify your phone number by entering it and confirming the SMS code you receive</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">5</span>
                        <span>Answer a few questions about your use case (you can select "Products & Services" and "Alerts & Notifications")</span>
                      </li>
                    </ol>
                  </div>

                  {/* Screenshot Placeholder */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-8 border-2 border-dashed border-purple-300">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-16 h-16 text-purple-400 mb-4" />
                      <p className="text-sm font-medium text-slate-700 mb-2">Screenshot Placeholder</p>
                      <p className="text-xs text-slate-500 max-w-md">
                        Twilio sign-up page showing the registration form with email, name, and password fields
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Pro Tip:</p>
                        <p>Use a business email if possible. Twilio may ask for business verification later for higher sending limits.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 2: Get Credentials */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Locate Your Account Credentials</h3>
                <p className="text-slate-600">Find your Account SID and Auth Token from the Console</p>
              </div>
            </div>

            <Card className="bg-white border-gray-200 mb-6">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900 mb-3">Finding Your Credentials</h4>
                    <ol className="space-y-3 text-slate-700">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                        <span>After completing registration, you'll be redirected to the Twilio Console dashboard</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                        <span>Look for the "Account Info" panel on the right side of the dashboard</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                        <span>You'll see two important values: <strong>Account SID</strong> (starts with "AC") and <strong>Auth Token</strong> (hidden by default)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                        <span>Click the "Show" button next to Auth Token to reveal it, then click the copy icon to copy both values</span>
                      </li>
                    </ol>
                  </div>

                  {/* Screenshot Placeholder */}
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-8 border-2 border-dashed border-teal-300">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-16 h-16 text-teal-400 mb-4" />
                      <p className="text-sm font-medium text-slate-700 mb-2">Screenshot Placeholder</p>
                      <p className="text-xs text-slate-500 max-w-md">
                        Twilio Console dashboard with Account Info panel highlighted, showing Account SID and Auth Token
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 mb-2">ACCOUNT SID FORMAT</p>
                      <code className="text-sm font-mono text-slate-900">ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
                      <p className="text-xs text-slate-600 mt-2">34 characters starting with "AC"</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 mb-2">AUTH TOKEN FORMAT</p>
                      <code className="text-sm font-mono text-slate-900">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
                      <p className="text-xs text-slate-600 mt-2">32 character alphanumeric string</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 3: Get Phone Number */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Get Your Twilio Phone Number</h3>
                <p className="text-slate-600">Purchase or claim a phone number for your dialer</p>
              </div>
            </div>

            <Card className="bg-white border-gray-200 mb-6">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900 mb-3">Getting Your Phone Number</h4>
                    <ol className="space-y-3 text-slate-700">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                        <span>In the left sidebar of Twilio Console, navigate to <strong>Phone Numbers → Manage → Buy a number</strong></span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                        <span>Select your country from the dropdown menu (e.g., United States)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                        <span>Check the capabilities you need: <strong>Voice</strong> (for calls) and optionally <strong>SMS</strong> (for text messages)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                        <span>Click "Search" to see available numbers matching your criteria</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">5</span>
                        <span>Select a number you like and click "Buy" (it's free with your trial credit!)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">6</span>
                        <span>Copy your new phone number in E.164 format (includes the + and country code)</span>
                      </li>
                    </ol>
                  </div>

                  {/* Screenshot Placeholder */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-8 border-2 border-dashed border-orange-300">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-16 h-16 text-orange-400 mb-4" />
                      <p className="text-sm font-medium text-slate-700 mb-2">Screenshot Placeholder</p>
                      <p className="text-xs text-slate-500 max-w-md">
                        Phone number search page showing available numbers with Voice and SMS capabilities
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex gap-3">
                      <Smartphone className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-purple-900">
                        <p className="font-semibold mb-1">Phone Number Format:</p>
                        <p className="mb-2">Always use E.164 format for your Twilio phone number:</p>
                        <div className="bg-white rounded px-3 py-2 font-mono text-sm">
                          +[country code][area code][number]
                          <br />
                          Example: <span className="text-purple-600">+14155551234</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex gap-2 items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-900 mb-1">Trial Account</p>
                          <p className="text-xs text-green-800">With $15 trial credit, you can get a phone number for free and make test calls</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <div className="flex gap-2 items-start">
                        <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">Pricing</p>
                          <p className="text-xs text-amber-800">Phone numbers typically cost $1/month. Voice calls cost $0.0085-0.013/min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 4: Configure with Replit */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Configure Replit Integration</h3>
                <p className="text-slate-600">Connect your Twilio credentials securely</p>
              </div>
            </div>

            <Card className="bg-white border-gray-200 mb-6">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900 mb-3">Setting Up in Replit</h4>
                    <ol className="space-y-3 text-slate-700">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                        <span>Open your Replit project where you want to use Twilio</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                        <span>Look for the <strong>Tools</strong> panel on the left sidebar and click on <strong>Secrets</strong> or find the Twilio connector in integrations</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                        <span>Add three environment variables with the exact names shown below</span>
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-900 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-green-400">TWILIO_ACCOUNT_SID</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white h-7"
                          onClick={() => copyToClipboard("TWILIO_ACCOUNT_SID", "Variable name")}
                          data-testid="button-copy-sid-name"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400">Paste your Account SID (starts with AC...)</p>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-green-400">TWILIO_AUTH_TOKEN</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white h-7"
                          onClick={() => copyToClipboard("TWILIO_AUTH_TOKEN", "Variable name")}
                          data-testid="button-copy-token-name"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400">Paste your Auth Token (32 characters)</p>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-green-400">TWILIO_PHONE_NUMBER</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white h-7"
                          onClick={() => copyToClipboard("TWILIO_PHONE_NUMBER", "Variable name")}
                          data-testid="button-copy-phone-name"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400">Paste your phone number in E.164 format (e.g., +14155551234)</p>
                    </div>
                  </div>

                  {/* Screenshot Placeholder */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-8 border-2 border-dashed border-purple-300">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-16 h-16 text-purple-400 mb-4" />
                      <p className="text-sm font-medium text-slate-700 mb-2">Screenshot Placeholder</p>
                      <p className="text-xs text-slate-500 max-w-md">
                        Replit Secrets panel showing the three Twilio environment variables configured
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-900">
                        <p className="font-semibold mb-1">Using Replit's Twilio Connector:</p>
                        <p>Replit offers a native Twilio connector that automatically sets these variables. Look for it in the Tools → Secrets or Integrations panel. It provides a guided setup with automatic credential management.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 5: Test Your Setup */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                5
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Test Your Configuration</h3>
                <p className="text-slate-600">Verify everything is working correctly</p>
              </div>
            </div>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900 mb-3">Testing Your Setup</h4>
                    <ol className="space-y-3 text-slate-700">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                        <span>Restart your Replit application to load the new environment variables</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                        <span>Try making a test call or sending a test SMS using your dialer application</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                        <span>Check the Twilio Console logs to verify the API calls are being made successfully</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                        <span>Monitor your usage in the Twilio Console to ensure you're not exceeding trial limits</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Trial Account Limitations:</p>
                        <ul className="space-y-1 mt-2">
                          <li>• Can only call/text verified phone numbers</li>
                          <li>• Callers will hear a Twilio trial message before calls</li>
                          <li>• Limited to verified caller IDs</li>
                          <li>• Upgrade to remove these restrictions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Security Notes */}
      <section className="py-12 px-6 lg:px-8 bg-[#F8F7F5]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Important Security & Best Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Security Guidelines</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Never commit Auth Token to version control</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Always use environment variables for credentials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Rotate your Auth Token if compromised</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Enable two-factor authentication on Twilio</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Cost Management</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Monitor usage regularly in Twilio Console</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Set up usage alerts to avoid surprises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Trial credit expires after time or usage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Upgrade for production use and better rates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <Mail className="w-16 h-16 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Need Additional Help?</h3>
              <p className="text-slate-300 max-w-2xl mx-auto mb-2">
                If you encounter any issues during the Twilio setup process or need assistance with integration, 
                our support team is here to help you succeed.
              </p>
              <p className="text-slate-400 text-sm">
                We typically respond within 24 hours on business days
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white h-auto py-4"
                onClick={() => window.open('https://www.twilio.com/docs', '_blank')}
                data-testid="button-twilio-docs"
              >
                <div className="flex flex-col items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  <span>Twilio Docs</span>
                </div>
              </Button>
              <Button 
                className="bg-teal-600 hover:bg-teal-700 text-white h-auto py-4"
                onClick={() => window.open('https://support.twilio.com', '_blank')}
                data-testid="button-twilio-support"
              >
                <div className="flex flex-col items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Twilio Support</span>
                </div>
              </Button>
              <Button 
                className="bg-white hover:bg-slate-100 text-slate-900 h-auto py-4"
                onClick={() => window.location.href = 'mailto:support@fallowl.com'}
                data-testid="button-contact-support"
              >
                <div className="flex flex-col items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>Email Us</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
