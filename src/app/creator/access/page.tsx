'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Mail, Link as LinkIcon, FileText, MessageSquare, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import type { ApplicationStatus } from '@/lib/types';

const processSteps = [
  { num: '01', title: 'Create your Algoryx account', description: 'Sign up to get started with the platform.', icon: User },
  { num: '02', title: 'Apply for Creator Access', description: 'Tell us about yourself and your 3D experience.', icon: FileText },
  { num: '03', title: 'Create your original asset', description: 'Design and prepare your 3D model using your preferred tools.', icon: Palette },
  { num: '04', title: 'Submit it to the community', description: 'Upload, validate, and submit for community review.', icon: ArrowRight },
];

export default function CreatorAccessPage() {
  const { isAuthenticated, creator, signIn, setCreatorAccess, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    fullName: '',
    creatorName: '',
    email: '',
    portfolioUrl: '',
    bio: '',
    motivation: '',
    experience: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const applicationStatus: ApplicationStatus = creator?.applicationStatus || 'not_applied';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      signIn();
      return;
    }
    setSubmitting(true);

    // Simulate API call — will be replaced with real backend
    await new Promise((r) => setTimeout(r, 1200));

    updateProfile({
      fullName: form.fullName,
      creatorName: form.creatorName,
      email: form.email,
      portfolioUrl: form.portfolioUrl,
      bio: form.bio,
    });
    setCreatorAccess('submitted');
    addToast({ type: 'success', title: 'Application submitted', description: 'We\'ll review your application and get back to you.' });
    setSubmitting(false);
  };

  const updateField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 lg:px-6 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[12px] font-medium text-teal-500 uppercase tracking-widest mb-3">Creator Program</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Become an Algoryx Creator</h1>
        <p className="mt-2 text-[14px] text-neutral-400 max-w-lg leading-relaxed">
          Join the Algoryx community as a creator. Contribute original 3D assets and build your portfolio.
        </p>
      </motion.div>

      {/* Process Steps */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="border border-neutral-800 rounded-lg p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono text-neutral-600">{step.num}</span>
                <Icon className="h-4 w-4 text-neutral-500" />
              </div>
              <h3 className="text-[14px] font-medium text-neutral-200">{step.title}</h3>
              <p className="mt-1.5 text-[12px] text-neutral-500 leading-relaxed">{step.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Application Status */}
      {applicationStatus !== 'not_applied' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-lg border border-neutral-800 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-medium text-white">Application Status</h3>
              <p className="mt-1 text-[13px] text-neutral-400">
                {applicationStatus === 'submitted' && 'Your application has been submitted. We\'ll review it shortly.'}
                {applicationStatus === 'under_review' && 'Your application is being reviewed by the team.'}
                {applicationStatus === 'approved' && 'Welcome to the Algoryx Creator Program!'}
                {applicationStatus === 'rejected' && 'Your application was not approved at this time.'}
              </p>
            </div>
            <StatusBadge status={applicationStatus} />
          </div>
          {applicationStatus === 'approved' && (
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <a href="/creator" className="text-[13px] text-teal-400 hover:text-teal-300 transition-colors">
                Go to Creator Studio →
              </a>
            </div>
          )}
        </motion.div>
      )}

      {/* Application Form */}
      {(applicationStatus === 'not_applied' || applicationStatus === 'rejected') && (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-10 border border-neutral-800 rounded-lg divide-y divide-neutral-800"
        >
          <div className="p-6">
            <h2 className="text-[16px] font-semibold text-white">Creator Application</h2>
            <p className="mt-1 text-[13px] text-neutral-500">Tell us about yourself and your experience with 3D creation.</p>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" required icon={<User className="h-3.5 w-3.5" />}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 transition-colors focus:border-neutral-600 focus:outline-none"
                />
              </FormField>
              <FormField label="Creator Name" required icon={<Palette className="h-3.5 w-3.5" />}>
                <input
                  type="text"
                  value={form.creatorName}
                  onChange={(e) => updateField('creatorName', e.target.value)}
                  required
                  placeholder="Your display name"
                  className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 transition-colors focus:border-neutral-600 focus:outline-none"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Email" required icon={<Mail className="h-3.5 w-3.5" />}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 transition-colors focus:border-neutral-600 focus:outline-none"
                />
              </FormField>
              <FormField label="Portfolio URL" icon={<LinkIcon className="h-3.5 w-3.5" />}>
                <input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => updateField('portfolioUrl', e.target.value)}
                  placeholder="https://your-portfolio.com"
                  className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 transition-colors focus:border-neutral-600 focus:outline-none"
                />
              </FormField>
            </div>

            <FormField label="Short Bio" required icon={<MessageSquare className="h-3.5 w-3.5" />}>
              <textarea
                value={form.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                required
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 transition-colors focus:border-neutral-600 focus:outline-none resize-none"
              />
            </FormField>

            <FormField label="Why do you want to become an Algoryx Creator?" required icon={<MessageSquare className="h-3.5 w-3.5" />}>
              <textarea
                value={form.motivation}
                onChange={(e) => updateField('motivation', e.target.value)}
                required
                rows={3}
                placeholder="Share your motivation for joining..."
                className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 transition-colors focus:border-neutral-600 focus:outline-none resize-none"
              />
            </FormField>

            <FormField label="Experience with 3D tools" required icon={<Wrench className="h-3.5 w-3.5" />}>
              <textarea
                value={form.experience}
                onChange={(e) => updateField('experience', e.target.value)}
                required
                rows={3}
                placeholder="Blender, Maya, 3ds Max, ZBrush, etc..."
                className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 transition-colors focus:border-neutral-600 focus:outline-none resize-none"
              />
            </FormField>
          </div>

          <div className="p-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>Apply for Creator Access</>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}

function FormField({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 mb-1.5">
        {icon && <span className="text-neutral-600">{icon}</span>}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
