import { ModeToggle } from '@/src/components/ModeToggle';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex h-full w-full justify-center">
      {children}
      {/* Toggle de tema */}
      <div className="absolute bottom-6 right-6 z-20">
        <ModeToggle />
      </div>
    </section>
  );
}
