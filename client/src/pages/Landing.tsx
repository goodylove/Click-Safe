import { useEffect, useState } from "react"
import Hero from "../components/ui/hero/Hero"
import DashboardShowcase from "../components/ui/dashboard/DashboardShowcase"
import Navbar from "../components/ui/nav/navbar"

export default function Landing() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <Hero />
      <DashboardShowcase />
    </main>
  );
}
