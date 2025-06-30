import { ModeToggle } from '@/src/components/ui/core/mode-toggle';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex justify-center">
      {children}
      {/* Toggle de tema */}
      <div className="absolute bottom-6 right-6 z-20">
        <ModeToggle />
      </div>
    </section>
  );
}
