'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Asset, AssetCategory, ValidationResult } from '@/lib/types';
import { createDemoAsset } from '@/lib/mock/data';

interface AssetCreationState {
  currentStep: number;
  file: File | null;
  fileUrl: string | null;
  validationResults: ValidationResult[];
  title: string;
  description: string;
  category: AssetCategory;
  tags: string[];
  previewImage: File | null;
  previewImageUrl: string | null;
  isSubmitted: boolean;
  submittedAsset: Asset | null;
}

interface AssetCreationContextType extends AssetCreationState {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setFile: (file: File | null) => void;
  setFileUrl: (url: string | null) => void;
  setValidationResults: (results: ValidationResult[]) => void;
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;
  setCategory: (cat: AssetCategory) => void;
  setTags: (tags: string[]) => void;
  setPreviewImage: (file: File | null) => void;
  setPreviewImageUrl: (url: string | null) => void;
  submitAsset: () => void;
  reset: () => void;
  canProceedToStep: (step: number) => boolean;
}

const initialState: AssetCreationState = {
  currentStep: 0,
  file: null,
  fileUrl: null,
  validationResults: [],
  title: '',
  description: '',
  category: 'other',
  tags: [],
  previewImage: null,
  previewImageUrl: null,
  isSubmitted: false,
  submittedAsset: null,
};

const AssetCreationContext = createContext<AssetCreationContextType | null>(null);

export function AssetCreationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssetCreationState>(initialState);

  const setStep = useCallback((step: number) => {
    setState((s) => ({ ...s, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.min(s.currentStep + 1, 4) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.max(s.currentStep - 1, 0) }));
  }, []);

  const setFile = useCallback((file: File | null) => {
    setState((s) => ({
      ...s,
      file,
      fileUrl: file ? URL.createObjectURL(file) : null,
      validationResults: [],
    }));
  }, []);

  const setFileUrl = useCallback((url: string | null) => {
    setState((s) => ({ ...s, fileUrl: url }));
  }, []);

  const setValidationResults = useCallback((results: ValidationResult[]) => {
    setState((s) => ({ ...s, validationResults: results }));
  }, []);

  const setTitle = useCallback((title: string) => {
    setState((s) => ({ ...s, title }));
  }, []);

  const setDescription = useCallback((desc: string) => {
    setState((s) => ({ ...s, description: desc }));
  }, []);

  const setCategory = useCallback((category: AssetCategory) => {
    setState((s) => ({ ...s, category }));
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setState((s) => ({ ...s, tags }));
  }, []);

  const setPreviewImage = useCallback((file: File | null) => {
    setState((s) => ({
      ...s,
      previewImage: file,
      previewImageUrl: file ? URL.createObjectURL(file) : null,
    }));
  }, []);

  const setPreviewImageUrl = useCallback((url: string | null) => {
    setState((s) => ({ ...s, previewImageUrl: url }));
  }, []);

  const submitAsset = useCallback(() => {
    setState((s) => {
      const asset = createDemoAsset({
        title: s.title,
        description: s.description,
        category: s.category,
        tags: s.tags,
        fileName: s.file?.name || '',
        fileFormat: s.file?.name.endsWith('.gltf') ? 'gltf' : 'glb',
        fileSize: s.file?.size || 0,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      });
      return { ...s, isSubmitted: true, submittedAsset: asset };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const canProceedToStep = useCallback(
    (step: number) => {
      switch (step) {
        case 1:
          return state.file !== null;
        case 2:
          return state.validationResults.length > 0 && state.validationResults.every((r) => r.status === 'pass');
        case 3:
          return state.title.trim().length > 0 && state.description.trim().length > 0;
        case 4:
          return state.title.trim().length > 0 && state.description.trim().length > 0;
        default:
          return true;
      }
    },
    [state]
  );

  return (
    <AssetCreationContext.Provider
      value={{
        ...state,
        setStep,
        nextStep,
        prevStep,
        setFile,
        setFileUrl,
        setValidationResults,
        setTitle,
        setDescription,
        setCategory,
        setTags,
        setPreviewImage,
        setPreviewImageUrl,
        submitAsset,
        reset,
        canProceedToStep,
      }}
    >
      {children}
    </AssetCreationContext.Provider>
  );
}

export function useAssetCreation() {
  const ctx = useContext(AssetCreationContext);
  if (!ctx) throw new Error('useAssetCreation must be used within AssetCreationProvider');
  return ctx;
}
