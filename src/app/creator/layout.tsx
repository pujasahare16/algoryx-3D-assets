import CreatorSidebar from '@/components/creator/CreatorSidebar';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <CreatorSidebar />
      <div className="flex-1 min-w-0 pb-16 lg:pb-0">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
