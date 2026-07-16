'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/sections/Navbar';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Media',
  'Real Estate',
  'Energy',
  'Other',
];

export default function CreateScrollWorldProject() {
  const router = useRouter();
  const [step, setStep] = useState<'basic' | 'branding'>('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company_name: '',
    company_logo_url: '',
    brand_color: '#000000',
    brand_accent_color: '#00FF00',
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'basic') {
      if (!formData.name || !formData.company_name) {
        setError('Please fill in all required fields');
        return;
      }
      setStep('branding');
      setError('');
      return;
    }

    // Create project
    setLoading(true);
    try {
      // TODO: Call API to create project
      // const response = await fetch('/api/scroll-world/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // const data = await response.json();
      // router.push(`/scroll-world/${data.project.id}`);

      // For now, redirect to dashboard
      router.push('/scroll-world');
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Link
          href="/scroll-world"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Scroll-World Project
          </h1>
          <p className="text-lg text-gray-600">
            {step === 'basic'
              ? 'Tell us about your company and project'
              : 'Customize your brand appearance'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-12">
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              step === 'basic' || step === 'branding'
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              step === 'branding' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        </div>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'basic' && (
              <>
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Project Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Tesla Brand Experience"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the internal name for your project
                  </p>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g., Tesla, Inc."
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your company or client name
                  </p>
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Industry
                  </label>
                  <div className="relative">
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select an industry...</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your scroll-world experience..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {step === 'branding' && (
              <>
                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Company Logo URL
                  </label>
                  <Input
                    type="url"
                    name="company_logo_url"
                    value={formData.company_logo_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL to your company logo
                  </p>
                </div>

                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      name="brand_color"
                      value={formData.brand_color}
                      onChange={handleChange}
                      className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <Input
                      type="text"
                      name="brand_color"
                      value={formData.brand_color}
                      onChange={handleChange}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Accent Color
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      name="brand_accent_color"
                      value={formData.brand_accent_color}
                      onChange={handleChange}
                      className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <Input
                      type="text"
                      name="brand_accent_color"
                      value={formData.brand_accent_color}
                      onChange={handleChange}
                      placeholder="#00FF00"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Preview
                  </h3>
                  <div className="space-y-2">
                    <div
                      className="h-12 rounded-lg flex items-center px-4 text-white font-semibold"
                      style={{ backgroundColor: formData.brand_color }}
                    >
                      {formData.company_name || 'Your Company'}
                    </div>
                    <div
                      className="h-8 rounded-lg"
                      style={{ backgroundColor: formData.brand_accent_color }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              {step === 'branding' && (
                <Button
                  type="button"
                  onClick={() => setStep('basic')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Creating...' : step === 'basic' ? 'Next' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
