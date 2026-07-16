'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/sections/Navbar';
import { Check } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  slug: 'starter' | 'professional' | 'enterprise';
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    slug: 'starter',
    price: 29,
    period: '/month',
    description: 'Perfect for experimenting with scroll-world',
    features: [
      '1,000 credits/month',
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      'Standard generation (2-3 days)',
      'Public URLs',
      'Community forum access',
    ],
    cta: 'Get Started',
    ctaUrl: '/auth/signup?plan=starter',
  },
  {
    id: 'professional',
    name: 'Professional',
    slug: 'professional',
    price: 99,
    period: '/month',
    description: 'Best for growing agencies and companies',
    features: [
      '5,000 credits/month',
      'Up to 25 projects',
      'Advanced analytics',
      'Priority support (24h response)',
      'Priority generation (same day)',
      'Custom domain support',
      'Team collaboration (up to 5)',
      'API access',
      'Usage reports',
    ],
    cta: 'Start Free Trial',
    ctaUrl: '/auth/signup?plan=professional',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    price: 499,
    period: '/month',
    description: 'For large organizations and high-volume needs',
    features: [
      'Unlimited credits',
      'Unlimited projects',
      'Custom analytics',
      'Dedicated support',
      'Instant generation',
      'Multiple custom domains',
      'Unlimited team members',
      'Advanced API features',
      'Webhooks & integrations',
      'White-label options',
      'SLA guarantee (99.9% uptime)',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    ctaUrl: '/contact-sales',
  },
];

const FAQ = [
  {
    question: 'What are credits and how do they work?',
    answer:
      'Credits are used to generate scenes in your scroll-world. Each image generation costs ~100 credits and each video generation costs ~200 credits. Unused credits roll over monthly with the Professional plan.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes, you can change your plan at any time. If you upgrade, you\'ll be charged the prorated difference. If you downgrade, you\'ll receive a credit for the remaining portion of your billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) as well as ACH bank transfers for Enterprise customers.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! Professional plan users get a 14-day free trial with full access. Starter users can create their first project free with 500 trial credits.',
  },
  {
    question: 'What happens if I run out of credits?',
    answer:
      'You\'ll receive a notification when you reach 80% of your monthly limit. You can purchase additional credits or upgrade your plan. Generation will pause if you exceed your limit.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer:
      'Yes! Pay annually and save 20% on any plan. Annual plans are billed upfront and can be canceled with a 30-day notice.',
  },
];

export default function ScrollWorldPricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your scroll-world needs. All plans include
            world-class support and the ability to create stunning brand experiences.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button className="px-6 py-2 font-medium text-gray-900 bg-blue-100 rounded-md">
              Monthly
            </button>
            <button className="px-6 py-2 font-medium text-gray-600 hover:text-gray-900">
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col p-8 transition-all hover:shadow-xl ${
                plan.highlighted
                  ? 'border-2 border-blue-600 shadow-lg md:scale-105'
                  : ''
              }`}
            >
              {plan.highlighted && (
                <Badge className="bg-blue-600 text-white mb-4 w-fit">
                  Most Popular
                </Badge>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <Link href={plan.ctaUrl} className="mb-8">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  What\'s included:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Detailed Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Starter
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Professional
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Monthly Credits</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">1,000</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">5,000</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Projects</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 5</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 25</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Generation Speed</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">2-3 days</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Same day</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Instant</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">API Access</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">-</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">✓</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">✓</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Custom Domain</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">-</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Team Members</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 5</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Support</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Email</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Priority</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {FAQ.map((item, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Our team is here to help. Get in touch with us for a personalized demo
              or to discuss your specific needs.
            </p>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
