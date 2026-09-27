import Link from "next/link";
import {
  Button,
  Card,
  DataDisplay,
  Heading,
  StatusDot,
} from "../components/ui";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--mist-sage)] text-[var(--ink)]">
      {/* Navigation Header */}
      <header className="border-b border-[var(--line)] bg-[var(--mist-sage)] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--deep-harbor)] tracking-tight"
          >
            Oi Tesla
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[var(--deep-harbor)] hover:underline"
            >
              Sign in
            </Link>
            <StatusDot status="success" label="Operational" />
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
        <div className="max-w-2xl">
          <Heading
            level="display"
            subtitle="Connect with compatible passengers traveling between Banani, Gulshan, and Mohakhali. Guaranteed seat capacity, transparent integer-paisa fares, and quiet electric transit."
          >
            Intelligent ride-pooling along Dhaka corridors.
          </Heading>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link href="/register">
              <Button variant="accent" size="lg">
                Request a ride
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Driver portal
              </Button>
            </Link>
          </div>
        </div>

        {/* System Metric Cards Using Reusable Card & DataDisplay */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          <Card surface="raised" padding="md">
            <div className="text-sm text-[var(--ink-muted)] mb-1">
              Tesla Fleet Unit
            </div>
            <Heading level="3" className="mb-3">
              Bullet
            </Heading>
            <DataDisplay
              value="3"
              unit="seats"
              caption="Strict concurrency locking"
            />
          </Card>

          <Card surface="raised" padding="md">
            <div className="text-sm text-[var(--ink-muted)] mb-1">
              Base Commute Fare
            </div>
            <Heading level="3" className="mb-3">
              Fixed Base
            </Heading>
            <DataDisplay
              value="30"
              unit="BDT"
              caption="3,000 paisa integer calculation"
            />
          </Card>

          <Card surface="raised" padding="md">
            <div className="text-sm text-[var(--ink-muted)] mb-1">
              Shared Corridor
            </div>
            <Heading level="3" className="mb-3">
              Pool Discount
            </Heading>
            <DataDisplay
              value="20%"
              unit="off"
              caption="Applied when 2+ requests match"
            />
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] py-6 px-6 text-sm text-[var(--ink-muted)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Oi Tesla Commuter Platform</span>
          <span>Banani · Gulshan · Mohakhali</span>
        </div>
      </footer>
    </div>
  );
}
