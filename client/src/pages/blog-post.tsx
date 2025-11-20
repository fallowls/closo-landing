import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { 
  Menu, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Share2,
  TrendingUp,
  Phone,
  Zap,
  BarChart3,
  CheckCircle,
  XCircle,
  Users,
  Target,
  DollarSign,
  Activity
} from "lucide-react";
import fallOwlLogo from "@assets/FallOwl_logo_1759280190715.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";

const blogContent: Record<string, any> = {
  "benefits-of-parallel-dialers": {
    title: "Benefits of Parallel Dialers for Sales Teams",
    category: "Sales Technology",
    author: "Sarah Mitchell",
    date: "October 10, 2025",
    readTime: "8 min read",
    icon: TrendingUp,
    gradient: "from-purple-500 to-purple-600",
    content: {
      intro: "In today's competitive sales environment, productivity is everything. Parallel dialers have emerged as a game-changing technology that can increase your team's call volume by up to 4x while maintaining quality conversations. Let's explore how this powerful tool can transform your outbound sales strategy.",
      sections: [
        {
          title: "What is a Parallel Dialer?",
          content: "A parallel dialer is an automated outbound calling system that dials multiple phone numbers simultaneously for each sales agent. When a live person answers, the system instantly connects them to an available agent. It's designed to maximize productivity by eliminating idle time between calls.",
          icon: Phone,
          keyPoints: [
            "Dials 2-10 numbers simultaneously per agent",
            "AI-powered answer detection filters out voicemails and busy signals",
            "Instant connection when live person answers",
            "Continuous automated dialing until list completion"
          ]
        },
        {
          title: "Massive Productivity Gains",
          content: "The most significant advantage of parallel dialers is the dramatic increase in productive talk time. While manual dialing gives reps only 10-15 minutes of actual conversation per hour, parallel dialers can increase this to 40-50 minutes per hour.",
          icon: TrendingUp,
          stats: [
            { label: "Talk Time Increase", value: "300%", color: "purple" },
            { label: "More Prospects Reached", value: "4x", color: "teal" },
            { label: "Idle Time Reduction", value: "80%", color: "orange" }
          ]
        },
        {
          title: "Key Benefits",
          content: "Parallel dialers offer numerous advantages that directly impact your bottom line:",
          icon: CheckCircle,
          benefits: [
            {
              title: "Higher Connect Rates",
              description: "More simultaneous calls mean higher probability of live connections. Your agents spend time in actual conversations, not waiting for rings."
            },
            {
              title: "Time Optimization",
              description: "Eliminates manual dialing, number lookup, and hang-up delays. Automatically handles busy signals, voicemails, and disconnected numbers."
            },
            {
              title: "Improved Agent Morale",
              description: "Less frustration from endless ringing and voicemails means more time closing deals, leading to higher motivation and less burnout."
            },
            {
              title: "Cost-Effective Scaling",
              description: "Cloud-based systems scale instantly without additional hardware. Reach more prospects without hiring additional staff."
            },
            {
              title: "Data-Driven Insights",
              description: "Real-time dashboards track KPIs like calls made, talk time, and conversion rates. Machine learning refines dialing strategies over time."
            }
          ]
        },
        {
          title: "Best Use Cases",
          content: "Parallel dialers excel in specific scenarios where volume and speed are priorities:",
          icon: Target,
          useCases: [
            "Cold calling and lead generation campaigns",
            "Outbound sales for SDR/BDR teams",
            "Telemarketing campaigns requiring high volume",
            "Market research and surveys at scale",
            "Follow-up campaigns for re-engaging large lead lists",
            "Small sales teams with ambitious quotas"
          ]
        },
        {
          title: "Important Considerations",
          content: "While parallel dialers offer tremendous benefits, there are some considerations to keep in mind:",
          icon: Activity,
          considerations: [
            {
              challenge: "Call Abandonment",
              solution: "Configure conservative ratios (start with 2-3 simultaneous calls) to minimize dropped connections"
            },
            {
              challenge: "Compliance Requirements",
              solution: "Ensure TCPA/GDPR compliance with proper settings and consent management"
            },
            {
              challenge: "Agent Training",
              solution: "Provide thorough training on fast-paced workflows and call handling techniques"
            },
            {
              challenge: "Quality vs Quantity Balance",
              solution: "Best for high-volume, lower-touch campaigns; use power dialers for personalized outreach"
            }
          ]
        }
      ],
      conclusion: "Parallel dialers represent a significant leap forward in sales productivity technology. By maximizing talk time and minimizing idle periods, they enable teams to reach 4x more prospects while maintaining conversation quality. For organizations running high-volume outbound campaigns, the ROI is clear: more conversations, faster pipeline generation, and improved team morale. Start with conservative settings, train your team properly, and watch your productivity soar."
    }
  },
  "power-dialer-vs-parallel-dialer": {
    title: "Power Dialer vs Parallel Dialer: Which is Right for You?",
    category: "Comparison",
    author: "Michael Chen",
    date: "October 8, 2025",
    readTime: "10 min read",
    icon: BarChart3,
    gradient: "from-teal-500 to-cyan-500",
    content: {
      intro: "Choosing between a power dialer and parallel dialer can significantly impact your sales team's performance. Both technologies eliminate manual dialing, but they serve different purposes and excel in different scenarios. This comprehensive guide will help you make the right choice for your organization.",
      sections: [
        {
          title: "Understanding Power Dialers",
          content: "A power dialer automatically dials one number at a time in sequence. As soon as a call ends—whether answered, sent to voicemail, or unanswered—it immediately dials the next number on your list.",
          icon: Phone,
          keyFeatures: [
            "Sequential one-at-a-time dialing (1:1 ratio)",
            "Agent has time to review prospect details before each call",
            "No connection delay when someone answers",
            "Fixed 60-80 calls per hour per agent",
            "Full control over call pacing and workflow"
          ]
        },
        {
          title: "Understanding Parallel Dialers",
          content: "A parallel dialer simultaneously dials multiple numbers (typically 2-10) for each agent. When someone answers, the call is instantly routed to an available agent while other connections are dropped.",
          icon: Zap,
          keyFeatures: [
            "Multi-line simultaneous dialing (configurable ratio)",
            "No prep time between calls",
            "AI-powered answer detection",
            "110-300+ calls per hour with aggressive settings",
            "Maximizes agent talk time"
          ]
        },
        {
          title: "Head-to-Head Comparison",
          content: "Here's how power dialers and parallel dialers stack up across key metrics:",
          icon: BarChart3,
          comparison: [
            {
              aspect: "Call Volume",
              power: "60-80 calls/hour",
              parallel: "110-300+ calls/hour",
              winner: "parallel"
            },
            {
              aspect: "Personalization",
              power: "High - time to prepare",
              parallel: "Low - no prep time",
              winner: "power"
            },
            {
              aspect: "Agent Control",
              power: "Full control of pacing",
              parallel: "Automated system control",
              winner: "power"
            },
            {
              aspect: "Call Quality",
              power: "Immediate connection",
              parallel: "Slight connection delay",
              winner: "power"
            },
            {
              aspect: "Best for Team Size",
              power: "1-20 agents",
              parallel: "5+ agents",
              winner: "depends"
            },
            {
              aspect: "Compliance Risk",
              power: "Low (minimal drops)",
              parallel: "Higher (manage carefully)",
              winner: "power"
            },
            {
              aspect: "Cost",
              power: "$20-50/user/month",
              parallel: "$30-70/user/month",
              winner: "power"
            }
          ]
        },
        {
          title: "When to Choose Power Dialer",
          content: "Power dialers are ideal for sales teams that prioritize quality conversations and personalization:",
          icon: CheckCircle,
          scenarios: [
            "B2B sales with complex, consultative processes",
            "High-value deals requiring detailed pre-call research",
            "Warm leads and relationship-based selling",
            "Small to medium teams (1-20 agents)",
            "Industries with strict compliance requirements",
            "Real estate, financial services, SaaS sales",
            "Account management and customer retention"
          ]
        },
        {
          title: "When to Choose Parallel Dialer",
          content: "Parallel dialers excel in high-volume scenarios where speed is the top priority:",
          icon: Zap,
          scenarios: [
            "Cold calling campaigns with low pickup rates",
            "B2C sales and telemarketing",
            "Lead qualification and initial outreach",
            "Large teams (5+ agents) with volume targets",
            "Market research and surveys",
            "Follow-up campaigns on large prospect lists",
            "Organizations with dedicated compliance monitoring"
          ]
        },
        {
          title: "ROI and Performance Metrics",
          content: "Understanding the financial impact helps justify your choice:",
          icon: DollarSign,
          metrics: [
            {
              metric: "Conversations Per Day",
              power: "40-60",
              parallel: "100-200+",
              impact: "Parallel wins on volume"
            },
            {
              metric: "Conversion Rate",
              power: "8-12%",
              parallel: "4-8%",
              impact: "Power wins on quality"
            },
            {
              metric: "Revenue Per Agent",
              power: "$150K-250K/year",
              parallel: "$120K-200K/year",
              impact: "Depends on sales cycle"
            },
            {
              metric: "Agent Satisfaction",
              power: "Higher (more control)",
              parallel: "Variable (pace dependent)",
              impact: "Consider team preferences"
            }
          ]
        },
        {
          title: "Hybrid Approach: Best of Both Worlds",
          content: "Modern platforms offer both dialing modes, allowing teams to switch based on campaign type:",
          icon: Activity,
          hybridBenefits: [
            "Use power dialing for strategic, targeted outreach",
            "Switch to parallel dialing for list-blasting campaigns",
            "Optimize based on time of day and prospect quality",
            "Different modes for different team members or roles",
            "A/B test which approach works best for specific campaigns"
          ]
        }
      ],
      conclusion: "The choice between power and parallel dialers ultimately depends on your sales methodology, team size, and business goals. Power dialers deliver higher-quality conversations and better conversion rates, making them ideal for B2B and relationship-based sales. Parallel dialers maximize volume and speed, perfect for high-volume outreach and lead generation. Consider starting with a platform that offers both options, allowing you to find the optimal approach for each campaign."
    }
  },
  "choosing-right-auto-dialer": {
    title: "How to Choose the Right Auto Dialer for Your Business",
    category: "Guide",
    author: "Emily Rodriguez",
    date: "October 5, 2025",
    readTime: "12 min read",
    icon: Zap,
    gradient: "from-orange-400 to-pink-500",
    content: {
      intro: "Auto dialers have revolutionized outbound sales, but with multiple types available—power dialers, parallel dialers, predictive dialers, and preview dialers—choosing the right one can be overwhelming. This comprehensive guide will help you evaluate your needs and select the perfect auto dialer for your business.",
      sections: [
        {
          title: "Types of Auto Dialers Explained",
          content: "Understanding the different types of auto dialers is the first step in making an informed decision:",
          icon: Phone,
          dialerTypes: [
            {
              name: "Power Dialer",
              description: "Dials one number at a time automatically, moving to the next immediately after each call ends.",
              bestFor: "B2B sales, relationship building, quality over quantity"
            },
            {
              name: "Parallel Dialer",
              description: "Dials multiple numbers simultaneously (2-10 per agent), connecting only live answers.",
              bestFor: "High-volume outreach, cold calling, lead generation"
            },
            {
              name: "Predictive Dialer",
              description: "Uses AI algorithms to dial ahead based on agent availability, optimizing for maximum talk time.",
              bestFor: "Large call centers (20+ agents), extremely high volume"
            },
            {
              name: "Preview Dialer",
              description: "Displays prospect information before dialing, allowing agents to review and prepare.",
              bestFor: "Complex sales, account-based selling, VIP prospects"
            }
          ]
        },
        {
          title: "Step 1: Assess Your Team Size",
          content: "Your team size significantly impacts which dialer type will be most effective:",
          icon: Users,
          teamGuidance: [
            {
              size: "1-5 Agents",
              recommendation: "Power Dialer or Preview Dialer",
              reasoning: "Small teams benefit from personalization and quality conversations. Predictive/parallel dialers require minimum agent count to be effective."
            },
            {
              size: "5-20 Agents",
              recommendation: "Power Dialer or Parallel Dialer",
              reasoning: "Medium teams can leverage automation while maintaining quality. Choose based on sales methodology (consultative vs. volume-based)."
            },
            {
              size: "20+ Agents",
              recommendation: "Predictive Dialer or Parallel Dialer",
              reasoning: "Large teams can maximize efficiency with aggressive automation. Predictive dialers show best ROI at this scale."
            }
          ]
        },
        {
          title: "Step 2: Define Your Sales Methodology",
          content: "Your selling approach should drive your dialer choice:",
          icon: Target,
          methodologies: [
            {
              type: "Consultative/Solution Selling",
              characteristics: ["Complex products", "Long sales cycles", "Detailed needs analysis", "Relationship building"],
              recommended: "Power Dialer or Preview Dialer",
              reasoning: "Need time to research prospects and personalize approach"
            },
            {
              type: "Transactional/Volume Selling",
              characteristics: ["Simple products", "Short sales cycles", "High lead volume", "Quick decisions"],
              recommended: "Parallel Dialer or Predictive Dialer",
              reasoning: "Maximize reach and conversations with less prep time"
            },
            {
              type: "Account-Based Selling",
              characteristics: ["Target accounts", "Multiple stakeholders", "Strategic approach", "High deal value"],
              recommended: "Preview Dialer",
              reasoning: "Maximum preparation and personalization for each contact"
            }
          ]
        },
        {
          title: "Step 3: Evaluate Call Volume Requirements",
          content: "Match your volume needs with dialer capabilities:",
          icon: Activity,
          volumeGuide: [
            {
              volume: "Low Volume (under 500 calls/day)",
              situation: "Quality-focused outreach, warm leads, account management",
              bestChoice: "Power Dialer or Preview Dialer",
              expectedMetrics: "20-40 conversations/day per agent, 10-15% conversion"
            },
            {
              volume: "Medium Volume (500-2,000 calls/day)",
              situation: "Mixed strategy, lead qualification, follow-ups",
              bestChoice: "Power Dialer or Parallel Dialer",
              expectedMetrics: "40-80 conversations/day per agent, 6-10% conversion"
            },
            {
              volume: "High Volume (2,000+ calls/day)",
              situation: "Mass outreach, cold calling, surveys, market research",
              bestChoice: "Parallel Dialer or Predictive Dialer",
              expectedMetrics: "100-200+ conversations/day per agent, 3-6% conversion"
            }
          ]
        },
        {
          title: "Step 4: Consider Compliance Requirements",
          content: "Regulatory compliance varies significantly by dialer type:",
          icon: CheckCircle,
          complianceFactors: [
            {
              aspect: "TCPA Compliance (US)",
              powerDialer: "Low risk - human-initiated calls",
              parallelDialer: "Medium risk - monitor abandonment rates",
              predictiveDialer: "High risk - classified as ATDS, strict regulations",
              recommendation: "If heavily regulated, prefer power dialers"
            },
            {
              aspect: "Call Abandonment Limits",
              powerDialer: "Minimal (<1%)",
              parallelDialer: "2-5% typical",
              predictiveDialer: "Must stay under 3% (legal requirement)",
              recommendation: "Track and optimize abandonment rates"
            },
            {
              aspect: "DNC List Management",
              powerDialer: "Manual/automated scrubbing",
              parallelDialer: "Automated scrubbing essential",
              predictiveDialer: "Real-time scrubbing required",
              recommendation: "All dialers need robust DNC integration"
            }
          ]
        },
        {
          title: "Step 5: Budget Considerations",
          content: "Understand the cost implications of each dialer type:",
          icon: DollarSign,
          budgetBreakdown: [
            {
              dialerType: "Power Dialer",
              costRange: "$20-50 per user/month",
              setupCosts: "Low ($500-2,000)",
              totalCostYear1: "$3,000-12,000 (5 users)",
              roi: "12-18 months"
            },
            {
              dialerType: "Parallel Dialer",
              costRange: "$30-70 per user/month",
              setupCosts: "Medium ($1,000-5,000)",
              totalCostYear1: "$4,000-18,000 (5 users)",
              roi: "8-12 months"
            },
            {
              dialerType: "Predictive Dialer",
              costRange: "$100-230 per user/month",
              setupCosts: "High ($5,000-15,000)",
              totalCostYear1: "$15,000-50,000+ (20 users)",
              roi: "6-10 months (at scale)"
            },
            {
              dialerType: "Preview Dialer",
              costRange: "$25-60 per user/month",
              setupCosts: "Low-Medium ($1,000-3,000)",
              totalCostYear1: "$3,500-15,000 (5 users)",
              roi: "10-15 months"
            }
          ]
        },
        {
          title: "Essential Features Checklist",
          content: "Ensure your chosen dialer includes these critical features:",
          icon: CheckCircle,
          essentialFeatures: [
            "CRM Integration (Salesforce, HubSpot, Zoho, etc.)",
            "Call recording and transcription",
            "Real-time analytics and reporting",
            "Local presence dialing (display local numbers)",
            "Voicemail drop functionality",
            "Do Not Call (DNC) list management",
            "Call disposition and logging",
            "Multi-channel support (SMS, email)",
            "Mobile app for on-the-go calling",
            "Compliance monitoring and reporting"
          ]
        },
        {
          title: "Implementation Best Practices",
          content: "Follow these steps for successful dialer implementation:",
          icon: Target,
          implementationSteps: [
            {
              step: "1. Start Small",
              action: "Pilot with 2-3 agents before full rollout",
              duration: "2-4 weeks",
              goal: "Validate effectiveness and identify issues"
            },
            {
              step: "2. Train Thoroughly",
              action: "Comprehensive training on dialer features and workflows",
              duration: "1-2 weeks",
              goal: "Ensure team comfort and competence"
            },
            {
              step: "3. Configure Carefully",
              action: "Set conservative dialing ratios initially",
              duration: "Ongoing",
              goal: "Optimize for quality before pushing volume"
            },
            {
              step: "4. Monitor Metrics",
              action: "Track connect rates, talk time, conversion rates",
              duration: "Daily/Weekly",
              goal: "Data-driven optimization"
            },
            {
              step: "5. Iterate and Optimize",
              action: "Adjust settings based on performance data",
              duration: "Monthly",
              goal: "Continuous improvement"
            }
          ]
        }
      ],
      conclusion: "Choosing the right auto dialer requires careful consideration of your team size, sales methodology, volume requirements, compliance needs, and budget. Power dialers offer the best balance for most B2B teams, parallel dialers excel at high-volume outreach, predictive dialers serve large call centers, and preview dialers suit complex, high-value sales. Start with a clear assessment of your needs, pilot your chosen solution with a small team, and scale based on proven results. The right dialer can transform your sales productivity and drive significant revenue growth."
    }
  }
};

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  const slug = params?.slug || "";
  const post = blogContent[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <Button onClick={() => setLocation("/blog")} data-testid="button-back-to-blog">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = post.icon;

  const seoConfig = {
    "benefits-of-parallel-dialers": {
      title: "Benefits of Parallel Dialers for Sales Teams | FallOwl",
      description: "Discover how parallel dialers can increase your team's productivity by 4x. Learn about benefits, best practices, and ROI of parallel dialing technology.",
      keywords: "parallel dialer benefits, parallel dialer productivity, auto dialer benefits, sales team efficiency, parallel dialing ROI"
    },
    "power-dialer-vs-parallel-dialer": {
      title: "Power Dialer vs Parallel Dialer: Complete Guide 2025 | FallOwl",
      description: "Compare power dialers and parallel dialers to choose the right solution. Learn key differences, use cases, pricing, and which dialer fits your sales team.",
      keywords: "power dialer vs parallel dialer, dialer comparison, power dialer benefits, parallel dialer features, best auto dialer"
    },
    "choosing-right-auto-dialer": {
      title: "How to Choose the Right Auto Dialer for Your Business | FallOwl",
      description: "Complete guide to selecting the perfect auto dialer. Compare power, parallel, predictive, and preview dialers with implementation tips and cost analysis.",
      keywords: "choose auto dialer, auto dialer guide, best auto dialer, dialer selection, auto dialer comparison, predictive vs power dialer"
    }
  };

  const currentSEO = seoConfig[slug as keyof typeof seoConfig] || {
    title: post.title,
    description: post.content.intro,
    keywords: "auto dialer, sales technology, power dialer"
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-slate-900">
      <SEO 
        title={currentSEO.title}
        description={currentSEO.description}
        keywords={currentSEO.keywords}
        ogTitle={post.title}
        ogDescription={post.content.intro.substring(0, 160)}
        ogImage="/attached_assets/FallOwl_logo_1759280190715.png"
        ogType="article"
        canonical={`https://fallowl.com/blog/${slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.content.intro,
          "image": "/attached_assets/FallOwl_logo_1759280190715.png",
          "datePublished": "2025-10-10T08:00:00+00:00",
          "dateModified": "2025-10-10T08:00:00+00:00",
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "FallOwl",
            "logo": {
              "@type": "ImageObject",
              "url": "https://fallowl.com/attached_assets/FallOwl_logo_1759280190715.png"
            }
          },
          "keywords": currentSEO.keywords,
          "articleBody": post.content.intro,
          "wordCount": post.readTime
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
                <a href="/blog" className="text-sm font-medium text-purple-600" onClick={(e) => { e.preventDefault(); setLocation("/blog"); }} data-testid="link-nav-blog">Blog</a>
                <a href="/about" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/about"); }} data-testid="link-nav-about">About</a>
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
                  <a href="/blog" className="px-4 py-2 text-sm font-medium text-purple-600 rounded-lg bg-purple-50" onClick={(e) => { e.preventDefault(); setLocation("/blog"); }} data-testid="link-mobile-blog">Blog</a>
                  <a href="/about" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-600 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => { e.preventDefault(); setLocation("/about"); }} data-testid="link-mobile-about">About</a>
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

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/blog")}
          className="text-slate-600 hover:text-purple-600"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>
      </div>

      {/* Hero Section */}
      <section className="px-6 lg:px-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-gradient-to-br ${post.gradient} rounded-3xl p-12 md:p-16 text-white mb-8`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <div>By {post.author}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-slate-700 leading-relaxed mb-12">
              {post.content.intro}
            </p>

            {post.content.sections.map((section: any, index: number) => {
              const SectionIcon = section.icon;
              return (
                <div key={index} className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                      <SectionIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 m-0">{section.title}</h2>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed mb-6">{section.content}</p>

                  {section.keyPoints && (
                    <ul className="space-y-3 mb-6">
                      {section.keyPoints.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.keyFeatures && (
                    <ul className="space-y-3 mb-6">
                      {section.keyFeatures.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.stats && (
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      {section.stats.map((stat: any, i: number) => (
                        <Card key={i} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100/50 border-${stat.color}-200`}>
                          <CardContent className="p-6 text-center">
                            <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}</div>
                            <p className="text-sm text-slate-700">{stat.label}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {section.benefits && (
                    <div className="space-y-6 mb-6">
                      {section.benefits.map((benefit: any, i: number) => (
                        <Card key={i} className="bg-white border-gray-200">
                          <CardContent className="p-6">
                            <h4 className="font-bold text-lg text-slate-900 mb-2">{benefit.title}</h4>
                            <p className="text-slate-700">{benefit.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {section.useCases && (
                    <ul className="grid md:grid-cols-2 gap-3 mb-6">
                      {section.useCases.map((useCase: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.considerations && (
                    <div className="space-y-4 mb-6">
                      {section.considerations.map((item: any, i: number) => (
                        <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 mb-1">
                                <span className="text-amber-600">Challenge:</span> {item.challenge}
                              </p>
                              <p className="text-sm text-slate-700">
                                <span className="font-medium">Solution:</span> {item.solution}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.scenarios && (
                    <ul className="space-y-3 mb-6">
                      {section.scenarios.map((scenario: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{scenario}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.comparison && (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-300">
                            <th className="text-left py-3 px-4 font-bold text-slate-900">Aspect</th>
                            <th className="text-left py-3 px-4 font-bold text-purple-600">Power Dialer</th>
                            <th className="text-left py-3 px-4 font-bold text-teal-600">Parallel Dialer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.comparison.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-slate-200">
                              <td className="py-3 px-4 font-medium text-slate-900">{row.aspect}</td>
                              <td className={`py-3 px-4 ${row.winner === 'power' ? 'font-semibold text-purple-700' : 'text-slate-700'}`}>{row.power}</td>
                              <td className={`py-3 px-4 ${row.winner === 'parallel' ? 'font-semibold text-teal-700' : 'text-slate-700'}`}>{row.parallel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.dialerTypes && (
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {section.dialerTypes.map((type: any, i: number) => (
                        <Card key={i} className="bg-white border-gray-200">
                          <CardContent className="p-6">
                            <h4 className="font-bold text-lg text-purple-600 mb-2">{type.name}</h4>
                            <p className="text-slate-700 mb-3">{type.description}</p>
                            <p className="text-sm text-slate-600">
                              <strong>Best for:</strong> {type.bestFor}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {section.essentialFeatures && (
                    <ul className="grid md:grid-cols-2 gap-3 mb-6">
                      {section.essentialFeatures.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Conclusion</h3>
              <p className="text-slate-700 leading-relaxed">{post.content.conclusion}</p>
            </div>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h3>
          <p className="text-slate-600 mb-8">
            Transform your sales process with FallOwl's powerful dialing technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
              onClick={() => setLocation("/demo")}
              data-testid="button-cta-demo"
            >
              Book a Demo
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl"
              onClick={() => window.location.href = 'https://app.fallowl.com'}
              data-testid="button-cta-trial"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
