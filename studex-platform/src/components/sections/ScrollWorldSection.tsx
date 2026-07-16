'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, Globe, BarChart3 } from 'lucide-react';

export default function ScrollWorldSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Generated Worlds',
      description:
        'Transform your brand into immersive 3D scrollable experiences using advanced AI generation',
    },
    {
      icon: Zap,
      title: 'Instant Creation',
      description:
        'Create stunning scroll-worlds in minutes with our intuitive builder and AI assistance',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description:
        'Mobile-optimized experiences that work perfectly on any device, any screen size',
    },
    {
      icon: BarChart3,
      title: 'Full Analytics',
      description:
        'Track engagement, views, and interactions with built-in analytics dashboard',
    },
  ];

  const useCases = [
    {
      title: 'Product Launches',
      description:
        'Create an immersive experience to showcase your latest product to the world',
    },
    {
      title: 'Brand Experiences',
      description:
        'Tell your brand story through an interactive, memorable scroll-world',
    },
    {
      title: 'Agency Services',
      description:
        'White-label scroll-worlds for your clients as a premium service offering',
    },
    {
      title: 'Event Marketing',
      description:
        'Virtual tours and interactive experiences for conferences and events',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Introducing Scroll-World</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Turn Your Brand Into an Immersive 3D World
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create stunning, AI-powered scroll-world experiences that captivate your audience.
            No design skills needed. Launch in minutes.
          </p>
        </div>

        {/* Demo/Preview */}
        <div className="mb-16">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10" />
                </div>
                <p className="text-lg font-semibold">Interactive Scroll-World Demo</p>
                <p className="text-sm text-white/80 mt-2">
                  Watch how our AI transforms your brand story
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/scroll-world">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg flex items-center gap-2">
              Start Creating
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/scroll-world/pricing">
            <Button className="bg-white hover:bg-gray-100 text-blue-600 border-2 border-blue-600 px-8 py-3 text-lg">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <Icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Perfect For Every Industry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {useCase.title}
                </h4>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-600 text-white rounded-2xl p-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Scroll-Worlds Created</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <p className="text-blue-100">Monthly Views</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-blue-100">Customer Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-blue-100">Industries Served</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Tell Us Your Story
              </h4>
              <p className="text-gray-600">
                Describe your brand, products, and the experience you want to create
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                AI Generates Your World
              </h4>
              <p className="text-gray-600">
                Our AI creates stunning isometric scenes and smooth video transitions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Publish & Share
              </h4>
              <p className="text-gray-600">
                Get a beautiful URL to share with the world and track engagement
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Simple, Transparent Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$29',
                features: ['1,000 credits/month', '5 projects', 'Email support'],
              },
              {
                name: 'Professional',
                price: '$99',
                features: [
                  '5,000 credits/month',
                  '25 projects',
                  'Priority support',
                  'API access',
                ],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: [
                  'Unlimited credits',
                  'Unlimited projects',
                  'Dedicated support',
                  'White-label',
                ],
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                className={`p-8 text-center ${
                  plan.highlighted ? 'border-2 border-blue-600 shadow-lg scale-105' : ''
                }`}
              >
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h4>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {plan.price}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-600 text-sm">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={
                    plan.highlighted
                      ? 'w-full bg-blue-600 hover:bg-blue-700 text-white'
                      : 'w-full bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/scroll-world/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View Full Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-blue-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your Scroll-World?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of brands creating immersive experiences that captivate and
            engage their audiences.
          </p>
          <Link href="/scroll-world">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg flex items-center gap-2 mx-auto">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
