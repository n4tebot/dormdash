import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-burnt-orange text-white font-bold text-sm">D</div>
            <span className="font-semibold text-foreground">DormDash</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/services" className="hover:text-foreground transition-colors">Browse Services</Link>
            <Link href="/auth" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DormDash. Built for UT Austin students.
          </p>
        </div>
      </div>
    </footer>
  );
}
