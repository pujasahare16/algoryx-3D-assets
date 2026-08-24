'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Upload as UploadIcon, Search,
  FileText, Eye, Send, Box, Check
} from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';
import UploadDropzone from '@/components/creator/UploadDropzone';
import ValidationChecklist from '@/components/creator/ValidationChecklist';
import TagInput from '@/components/creator/TagInput';
import PreviewImageUploader from '@/components/creator/PreviewImageUploader';
import { useAssets, createDemoAsset } from '@/lib/hooks/useAssetsStore';
import { useToast } from '@/lib/hooks/useToast';
import { formatFileSize, getFileExtension, cn } from '@/lib/utils';
import type { ValidationResult, AssetCategory } from '@/lib/types';
import { ASSET_CATEGORIES } from '@/lib/types';

const ModelViewer = dynamic(() => import('@/components/three/ModelViewer'), { ssr: false });

const STEPS = ['Upload', 'Validate', 'Details', 'Preview', 'Submit'];

export default function CreateAssetPage() {
  const router = useRouter();
  const { addAsset } = useAssets();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AssetCategory>('other');
  const [tags, setTags] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    setValidationResults([]);
  }, []);

  const handleFileRemove = useCallback(() => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(null);
    setFileUrl(null);
    setValidationResults([]);
    setCurrentStep(0);
  }, [fileUrl]);

  // Run validation when moving to step 1
  useEffect(() => {
    if (currentStep === 1 && file && validationResults.length === 0) {
      runValidation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const runValidation = async () => {
    if (!file) return;
    const ext = getFileExtension(file.name);
    const results: ValidationResult[] = [];

    // Format check
    results.push({
      id: 'format',
      label: 'File Format',
      status: 'pending',
      detail: `Checking .${ext} format...`,
    });
    setValidationResults([...results]);
    await delay(400);

    const formatOk = ['glb', 'gltf'].includes(ext);
    results[0] = {
      id: 'format',
      label: 'File Format',
      status: formatOk ? 'pass' : 'fail',
      detail: formatOk ? `Supported format (.${ext})` : `Unsupported format (.${ext})`,
    };
    setValidationResults([...results]);

    // Size check
    results.push({ id: 'size', label: 'File Size', status: 'pending', detail: 'Checking file size...' });
    setValidationResults([...results]);
    await delay(300);

    const sizeOk = file.size <= 50 * 1024 * 1024;
    results[1] = {
      id: 'size',
      label: 'File Size',
      status: sizeOk ? 'pass' : 'fail',
      detail: sizeOk ? `${formatFileSize(file.size)} (under 50 MB)` : `${formatFileSize(file.size)} exceeds 50 MB limit`,
    };
    setValidationResults([...results]);

    // Model loading check
    results.push({ id: 'loading', label: 'Model Loading', status: 'pending', detail: 'Loading 3D model...' });
    setValidationResults([...results]);
    await delay(600);

    results[2] = {
      id: 'loading',
      label: 'Model Loading',
      status: 'pass',
      detail: 'Model loaded successfully',
    };
    setValidationResults([...results]);

    // Preview check
    results.push({ id: 'preview', label: 'Asset Preview', status: 'pending', detail: 'Generating preview...' });
    setValidationResults([...results]);
    await delay(300);

    results[3] = {
      id: 'preview',
      label: 'Asset Preview',
      status: 'pass',
      detail: '3D preview available',
    };
    setValidationResults([...results]);

    // Readiness
    results.push({ id: 'ready', label: 'Submission Readiness', status: 'pending', detail: 'Checking readiness...' });
    setValidationResults([...results]);
    await delay(200);

    const allPassed = results.slice(0, 4).every((r) => r.status === 'pass');
    results[4] = {
      id: 'ready',
      label: 'Submission Readiness',
      status: allPassed ? 'pass' : 'fail',
      detail: allPassed ? 'Ready to continue' : 'Please fix the issues above',
    };
    setValidationResults([...results]);
  };

  const handleModelError = useCallback(() => {
    setValidationResults((prev) =>
      prev.map((r) =>
        r.id === 'loading'
          ? { ...r, status: 'fail' as const, detail: "We couldn't load this 3D asset. Please check the file and try again." }
          : r.id === 'ready'
            ? { ...r, status: 'fail' as const, detail: 'Please fix the issues above' }
            : r
      )
    );
  }, []);

  // Step navigation
  const canProceed = (step: number) => {
    switch (step) {
      case 0: return !!file;
      case 1: return validationResults.length > 0 && validationResults.every((r) => r.status === 'pass');
      case 2: return title.trim().length > 0 && description.trim().length > 0;
      case 3: return true;
      case 4: return confirmed;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!file || !confirmed) return;
    setSubmitting(true);
    await delay(1500);

    const asset = createDemoAsset({
      title,
      description,
      category,
      tags,
      fileName: file.name,
      fileFormat: getFileExtension(file.name) as 'glb' | 'gltf',
      fileSize: file.size,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      creatorName: 'Creator',
    });
    addAsset(asset);
    setIsSubmitted(true);
    setSubmitting(false);
    addToast({ type: 'success', title: 'Asset submitted', description: 'Your asset has been submitted for review.' });
  };

  // Submitted confirmation
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-950/30 border border-teal-800/30 mb-6">
          <CheckCircle2 className="h-7 w-7 text-teal-400" />
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Your asset has been submitted</h1>
        <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-neutral-800/50 border border-neutral-700 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-[13px] font-medium text-neutral-300">Submitted for Review</span>
        </div>
        <p className="mt-4 text-[13px] text-neutral-500 max-w-md leading-relaxed">
          Your asset is now in the review queue. You&apos;ll be notified once it has been reviewed. You can track the status from your dashboard.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => router.push('/creator')}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-[13px] font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/creator/assets')}
            className="rounded-md bg-teal-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-teal-500 transition-colors"
          >
            View My Assets
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white tracking-tight">Create Asset</h1>
        <p className="mt-1 text-[13px] text-neutral-400">Upload and prepare your 3D asset for the Algoryx Community.</p>
      </div>

      {/* Step Indicator */}
      <div className="border border-neutral-800 rounded-lg px-5 py-4 mb-8">
        <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={(s) => { if (s < currentStep) setCurrentStep(s); }} />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 0: Upload */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-[16px] font-semibold text-white mb-1">Upload your 3D asset</h2>
              <p className="text-[13px] text-neutral-400 mb-6">
                Upload an original 3D asset prepared for Algoryx Community submission.
              </p>
              <UploadDropzone file={file} onFileSelect={handleFileSelect} onRemove={handleFileRemove} />
            </div>
          )}

          {/* STEP 1: Validate */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white mb-1">Validate your asset</h2>
                <p className="text-[13px] text-neutral-400 mb-6">
                  We&apos;re checking your file to make sure it meets the requirements.
                </p>
                <ValidationChecklist results={validationResults} />
              </div>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <ModelViewer modelUrl={fileUrl} showControls minHeight="400px" onError={handleModelError} />
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {currentStep === 2 && (
            <div className="max-w-2xl">
              <h2 className="text-[16px] font-semibold text-white mb-1">Asset Details</h2>
              <p className="text-[13px] text-neutral-400 mb-6">
                Add metadata to help the community discover your asset.
              </p>
              <div className="space-y-5">
                <div>
                  <label htmlFor="asset-title" className="block text-[12px] font-medium text-neutral-400 mb-1.5">
                    Asset Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="asset-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Modern Office Chair"
                    className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 focus:border-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="asset-desc" className="flex items-center justify-between text-[12px] font-medium text-neutral-400 mb-1.5">
                    <span>Description <span className="text-red-400">*</span></span>
                    <span className="text-neutral-600 font-normal">{description.length}/500</span>
                  </label>
                  <textarea
                    id="asset-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                    required
                    rows={4}
                    placeholder="Describe your 3D asset..."
                    className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 focus:border-neutral-600 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="asset-category" className="block text-[12px] font-medium text-neutral-400 mb-1.5">
                    Category
                  </label>
                  <select
                    id="asset-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AssetCategory)}
                    className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 focus:border-neutral-600 focus:outline-none transition-colors appearance-none"
                  >
                    {ASSET_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-neutral-400 mb-1.5">Tags</label>
                  <TagInput tags={tags} onChange={setTags} />
                </div>

                <div className="rounded-md border border-neutral-800 bg-neutral-900/30 p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                    <Box className="h-3.5 w-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-[12px] text-neutral-500">Creator</p>
                    <p className="text-[13px] text-neutral-300">Signed-in creator</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preview */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-[16px] font-semibold text-white mb-1">Preview</h2>
              <p className="text-[13px] text-neutral-400 mb-6">
                Review your asset before submission.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <ModelViewer modelUrl={fileUrl} showControls minHeight="480px" />
                </div>
                <div className="lg:col-span-2 space-y-5">
                  <div>
                    <h3 className="text-[14px] font-medium text-white">{title || 'Untitled'}</h3>
                    <p className="mt-1.5 text-[13px] text-neutral-400 leading-relaxed">{description || 'No description'}</p>
                  </div>
                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <InfoRow label="Category" value={ASSET_CATEGORIES.find((c) => c.value === category)?.label || category} />
                    <InfoRow label="Format" value={`.${getFileExtension(file?.name || '')}`} />
                    <InfoRow label="Size" value={file ? formatFileSize(file.size) : '—'} />
                    {tags.length > 0 && (
                      <div>
                        <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <span key={tag} className="rounded bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-400">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-neutral-800 pt-4">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-2">Preview Image</p>
                    <PreviewImageUploader
                      imageUrl={previewImageUrl}
                      onImageSelect={(f) => {
                        setPreviewImage(f);
                        setPreviewImageUrl(URL.createObjectURL(f));
                      }}
                      onRemove={() => {
                        if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
                        setPreviewImage(null);
                        setPreviewImageUrl(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Submit */}
          {currentStep === 4 && (
            <div className="max-w-xl mx-auto">
              <h2 className="text-[16px] font-semibold text-white mb-1">Ready to submit?</h2>
              <p className="text-[13px] text-neutral-400 mb-6">
                Review the summary below and submit your asset for community review.
              </p>

              <div className="rounded-lg border border-neutral-800 divide-y divide-neutral-800">
                <SummaryRow label="Asset" value={title} />
                <SummaryRow label="File" value={`.${getFileExtension(file?.name || '')} — ${file?.name}`} />
                <SummaryRow label="Size" value={file ? formatFileSize(file.size) : '—'} />
                <div className="px-5 py-3">
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-2">Metadata</p>
                  <div className="flex flex-col gap-1">
                    <CheckItem label="Title" checked={!!title.trim()} />
                    <CheckItem label="Description" checked={!!description.trim()} />
                    <CheckItem label="Tags" checked={tags.length > 0} />
                  </div>
                </div>
                <div className="px-5 py-3">
                  <CheckItem label="Preview image" checked={!!previewImage} />
                </div>
              </div>

              {/* Declaration */}
              <div className="mt-6 rounded-lg border border-neutral-800 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <span className="text-[13px] text-neutral-300 leading-relaxed">
                    I confirm that this is my original work and that I have the rights to submit this asset.
                  </span>
                </label>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!confirmed || submitting}
                  className="w-full rounded-md bg-teal-600 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit for Review'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!isSubmitted && (
        <div className="mt-8 flex items-center justify-between border-t border-neutral-800 pt-5">
          <button
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800/50 px-3.5 py-2 text-[13px] font-medium text-neutral-300 transition-colors hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </button>
          {currentStep < 4 && (
            <button
              onClick={() => setCurrentStep((s) => Math.min(s + 1, 4))}
              disabled={!canProceed(currentStep)}
              className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-neutral-500 uppercase tracking-wider">{label}</p>
      <p className="mt-0.5 text-[13px] text-neutral-300">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-[12px] text-neutral-500">{label}</span>
      <span className="text-[13px] text-neutral-200 font-medium">{value}</span>
    </div>
  );
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <Check className="h-3.5 w-3.5 text-teal-400" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-sm border border-neutral-700" />
      )}
      <span className={cn('text-[12px]', checked ? 'text-neutral-300' : 'text-neutral-500')}>{label}</span>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
