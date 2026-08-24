'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Upload, Eye, Send, Shield, Box, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

const features = [
  {
    icon: Upload,
    title: 'Upload & Validate',
    description: 'Drag and drop your .glb or .gltf files. Automatic format and size validation before submission.',
  },
  {
    icon: Eye,
    title: '3D Preview',
    description: 'Preview your assets directly in the browser with orbit controls, wireframe, and studio lighting.',
  },
  {
    icon: Send,
    title: 'Submit for Review',
    description: 'Add metadata, tags, and a preview image. Submit your asset and track the review status.',
  },
  {
    icon: Shield,
    title: 'Quality Standards',
    description: 'Every asset goes through community review to maintain quality and originality standards.',
  },
];

const steps = [
  { num: '01', title: 'Create Your Account', description: 'Sign up and apply for Creator Access to start contributing.' },
  { num: '02', title: 'Prepare Your Asset', description: 'Create an original 3D asset, export as .glb or .gltf, and optimize under 50 MB.' },
  { num: '03', title: 'Upload & Preview', description: 'Upload your asset, validate it, and preview it in the built-in 3D viewer.' },
  { num: '04', title: 'Submit for Review', description: 'Add details, tags, and a preview image. Submit your asset for community review.' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-56px)] flex items-center">
        <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-6 py-16 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[12px] font-medium text-teal-500 uppercase tracking-widest mb-4">
                Algoryx Community
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight">
                Create.
                <br />
                Refine.
                <br />
                Share.
              </h1>
              <p className="mt-5 text-[15px] text-neutral-400 leading-relaxed max-w-lg">
                Create original 3D assets, prepare them for the community, preview them directly in the browser, and submit them for review.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/creator/access"
                  className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-teal-500"
                >
                  Become a Creator
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/creator"
                  className="inline-flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800/50 px-5 py-2.5 text-[14px] font-medium text-neutral-300 transition-colors hover:text-white hover:bg-neutral-800"
                >
                  Explore Community
                </Link>
              </div>
              {/* Quick stats */}
              <div className="mt-12 flex items-center gap-8 border-t border-neutral-800 pt-6">
                <div>
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider">Formats</p>
                  <p className="mt-1 text-[13px] text-neutral-300 font-mono">.GLB .GLTF</p>
                </div>
                <div className="h-8 w-px bg-neutral-800" />
                <div>
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider">Max Size</p>
                  <p className="mt-1 text-[13px] text-neutral-300">50 MB</p>
                </div>
                <div className="h-8 w-px bg-neutral-800" />
                <div>
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider">Preview</p>
                  <p className="mt-1 text-[13px] text-neutral-300">In-Browser 3D</p>
                </div>
              </div>
            </motion.div>

            {/* Right: 3D Scene */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] lg:h-[520px] rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden"
            >
              <HeroScene />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-neutral-900/80 border border-neutral-700 px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span className="text-[11px] text-neutral-400">Interactive 3D Preview</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-neutral-800">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-20">
          <div className="max-w-lg">
            <p className="text-[12px] font-medium text-teal-500 uppercase tracking-widest mb-3">Creator Tools</p>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Everything you need to contribute</h2>
            <p className="mt-2 text-[14px] text-neutral-400 leading-relaxed">
              A streamlined workflow from asset creation to community submission.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-800 rounded-lg border border-neutral-800 overflow-hidden">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-neutral-950 p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700">
                    <Icon className="h-4 w-4 text-neutral-400" />
                  </div>
                  <h3 className="mt-4 text-[14px] font-medium text-neutral-200">{feature.title}</h3>
                  <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="border-t border-neutral-800">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-20">
          <div className="max-w-lg">
            <p className="text-[12px] font-medium text-teal-500 uppercase tracking-widest mb-3">Workflow</p>
            <h2 className="text-2xl font-semibold text-white tracking-tight">From creation to submission</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <span className="text-[32px] font-bold text-neutral-800">{step.num}</span>
                <h3 className="mt-2 text-[14px] font-medium text-neutral-200">{step.title}</h3>
                <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-800">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold text-white tracking-tight">Ready to contribute?</h2>
          <p className="mt-2 text-[14px] text-neutral-400 max-w-md mx-auto">
            Apply for Creator Access and start building your portfolio on Algoryx.
          </p>
          <Link
            href="/creator/access"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-teal-500"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-neutral-500">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-teal-600 text-[9px] font-bold text-white">A</span>
            Algoryx
          </div>
          <p className="text-[12px] text-neutral-600">3D Asset Creation Platform — Community Contribution</p>
        </div>
      </footer>
    </div>
  );
}
