'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid, Center } from '@react-three/drei';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Grid3x3,
  Box,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

// Model component that loads and displays GLB/GLTF
function Model({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone(true);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => {
            const cloned = m.clone();
            cloned.wireframe = wireframe;
            return cloned;
          });
        } else {
          child.material = child.material.clone();
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [clonedScene, wireframe]);

  return (
    <Center>
      <primitive object={clonedScene} />
    </Center>
  );
}

// Camera reset helper
function CameraReset({ trigger }: { trigger: number }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (trigger > 0) {
      camera.position.set(3, 2, 5);
      camera.lookAt(0, 0, 0);
      if (controls && 'reset' in controls) {
        (controls as { reset: () => void }).reset();
      }
    }
  }, [trigger, camera, controls]);

  return null;
}

// Loading overlay
function ViewerLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="h-5 w-5 border-2 border-neutral-600 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-[12px] text-neutral-500">Loading 3D model...</p>
      </div>
    </div>
  );
}

interface ModelViewerProps {
  modelUrl: string | null;
  className?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  minHeight?: string;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

export default function ModelViewer({
  modelUrl,
  className,
  showControls = true,
  autoRotate = false,
  minHeight = '400px',
  onError,
  onLoad,
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [studioLighting, setStudioLighting] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [modelUrl]);

  if (!modelUrl) {
    return (
      <div
        className={cn('flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50', className)}
        style={{ minHeight }}
      >
        <p className="text-[13px] text-neutral-600">No model to display</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 gap-2', className)}
        style={{ minHeight }}
      >
        <Box className="h-6 w-6 text-red-400" />
        <p className="text-[13px] text-neutral-300 font-medium">We couldn&apos;t load this 3D asset</p>
        <p className="text-[12px] text-neutral-500">Please check the file and try again.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden', className)}
      style={{ minHeight }}
    >
      {isLoading && <ViewerLoader />}
      <Canvas
        camera={{ position: [3, 2, 5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      >
        <Suspense fallback={null}>
          <ErrorBoundaryModel
            url={modelUrl}
            wireframe={wireframe}
            onError={(err) => {
              setHasError(true);
              setIsLoading(false);
              onError?.(err);
            }}
          />
        </Suspense>

        {studioLighting ? (
          <Environment preset="studio" />
        ) : (
          <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
          </>
        )}

        {showGrid && (
          <Grid
            args={[20, 20]}
            position={[0, -0.01, 0]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#262626"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#404040"
            fadeDistance={15}
            fadeStrength={1}
            infiniteGrid
          />
        )}

        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={20}
        />

        <CameraReset trigger={resetTrigger} />
      </Canvas>

      {showControls && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <ViewerButton
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            label="Reset Camera"
            onClick={() => setResetTrigger((t) => t + 1)}
          />
          <ViewerButton
            icon={isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            onClick={toggleFullscreen}
          />
          <ViewerButton
            icon={<Grid3x3 className="h-3.5 w-3.5" />}
            label="Toggle Grid"
            onClick={() => setShowGrid(!showGrid)}
            active={showGrid}
          />
          <ViewerButton
            icon={<Box className="h-3.5 w-3.5" />}
            label="Toggle Wireframe"
            onClick={() => setWireframe(!wireframe)}
            active={wireframe}
          />
          <ViewerButton
            icon={<Sun className="h-3.5 w-3.5" />}
            label="Toggle Lighting"
            onClick={() => setStudioLighting(!studioLighting)}
            active={studioLighting}
          />
        </div>
      )}
    </div>
  );
}

function ViewerButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md border transition-colors',
        active
          ? 'bg-neutral-700/80 border-neutral-600 text-white'
          : 'bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800/80'
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

// Error boundary wrapper for the model
function ErrorBoundaryModel({
  url,
  wireframe,
  onError,
}: {
  url: string;
  wireframe: boolean;
  onError: (err: string) => void;
}) {
  try {
    return <Model url={url} wireframe={wireframe} />;
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Failed to load model');
    return null;
  }
}
