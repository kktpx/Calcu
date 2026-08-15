import Link from "next/link";
import { ArrowRight, Activity, Camera, LineChart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-teal-500/30 flex flex-col">
      {/* Navigation */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full border-b border-zinc-100 dark:border-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">CalWise</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 bg-teal-600 hover:bg-teal-700 text-white border-0")}>
            Get Started
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-24 w-full">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 mt-8 md:mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 text-sm font-medium border border-teal-100 dark:border-teal-900/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Now in public beta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15] md:leading-[1.1]">
            Track smarter, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">
              live better.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            CalWise is your intelligent nutrition companion. Track calories, monitor macros, and reach your fitness goals with AI-powered food recognition.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full sm:w-auto">
            <Link href="/register" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto rounded-full px-8 h-14 text-base font-medium shadow-md shadow-teal-500/20 bg-teal-600 hover:bg-teal-700 text-white border-0 transition-transform hover:scale-105")}>
              Start Tracking Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/about" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto rounded-full px-8 h-14 text-base font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors")}>
              How it works
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/80 hover:border-teal-100 dark:hover:border-teal-900/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-6 border border-zinc-100 dark:border-zinc-700">
              <Activity className="w-6 h-6 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Smart Macros</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Dynamically calculate your BMR and TDEE to get personalized daily calorie and macronutrient targets based on your unique goals.
            </p>
          </div>

          <div className="flex flex-col items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/80 hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-6 border border-zinc-100 dark:border-zinc-700">
              <Camera className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">AI Food Recognition</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Skip the manual search. Simply snap a photo of your meal and let our AI estimate the calories and macros instantly.
            </p>
          </div>

          <div className="flex flex-col items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/80 hover:border-cyan-100 dark:hover:border-cyan-900/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-6 border border-zinc-100 dark:border-zinc-700">
              <LineChart className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Progress Analytics</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              Visualize your weight loss journey and dietary habits with beautiful, easy-to-understand charts and personalized weekly insights.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-900/50 py-8 text-center text-zinc-500 dark:text-zinc-600 text-sm">
        <p>© 2026 CalWise. A modern portfolio project.</p>
      </footer>
    </div>
  );
}
