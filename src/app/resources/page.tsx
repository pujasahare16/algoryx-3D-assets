import { Book, FileText, Video, ExternalLink } from 'lucide-react';

const resources = [
  {
    icon: Book,
    title: 'Getting Started Guide',
    description: 'Learn how to create and submit your first 3D asset to the Algoryx Community.',
    href: '#',
  },
  {
    icon: FileText,
    title: 'Asset Guidelines',
    description: 'File format requirements, size limits, and quality standards for submissions.',
    href: '#',
  },
  {
    icon: Video,
    title: 'Blender to Algoryx',
    description: 'Step-by-step guide for exporting optimized .glb files from Blender.',
    href: '#',
  },
  {
    icon: FileText,
    title: 'API Documentation',
    description: 'Technical documentation for integrating with the Algoryx platform.',
    href: '#',
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 lg:px-6 py-12">
      <h1 className="text-2xl font-semibold text-white tracking-tight">Resources</h1>
      <p className="mt-2 text-[14px] text-neutral-400">
        Guides, documentation, and tools to help you create and submit 3D assets.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-800 rounded-lg border border-neutral-800 overflow-hidden">
        {resources.map((resource, i) => {
          const Icon = resource.icon;
          return (
            <a
              key={i}
              href={resource.href}
              className="flex gap-4 bg-neutral-950 p-6 transition-colors hover:bg-neutral-900/70 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 shrink-0">
                <Icon className="h-4 w-4 text-neutral-400" />
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-neutral-200 group-hover:text-white transition-colors flex items-center gap-1.5">
                  {resource.title}
                  <ExternalLink className="h-3 w-3 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-[13px] text-neutral-500 leading-relaxed">{resource.description}</p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-12 rounded-lg border border-neutral-800 p-6">
        <h2 className="text-[15px] font-medium text-white mb-2">Supported Formats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <span className="rounded bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-[12px] font-mono text-neutral-300">.GLB</span>
            <span className="text-[13px] text-neutral-400">Binary glTF — single file, optimized</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-[12px] font-mono text-neutral-300">.GLTF</span>
            <span className="text-[13px] text-neutral-400">JSON-based glTF with external assets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
