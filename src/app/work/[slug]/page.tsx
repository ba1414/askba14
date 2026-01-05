import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CaseStudyPage() {
  return (
    <article className="min-h-screen pb-32">
      
      {/* 1. HERO HEADER (Immersive) */}
      <section className="relative w-full h-[60vh] md:h-[80vh] rounded-[2rem] overflow-hidden mb-20 shadow-glass-md">
        {/* Placeholder for Main Hero Image */}
        <div className="absolute inset-0 bg-neutral-900" />
        {/* <Image src="/project-hero.jpg" fill className="object-cover" alt="Hero" /> */}

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 bg-gradient-to-t from-black/80 to-transparent">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-5xl md:text-7xl font-semibold tracking-tighter mb-4"
          >
            Vision Pro OS
          </motion.h1>
          <p className="text-white/80 text-xl md:text-2xl max-w-2xl">
            Redefining spatial computing interactions for the next generation of headsets.
          </p>
        </div>
      </section>

      {/* 2. CONTENT GRID (Sticky Sidebar + Main Text) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-4 md:px-0">
        
        {/* A. STICKY SIDEBAR (Metadata) */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="md:sticky md:top-32 space-y-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-apple-gray-400 uppercase tracking-wide">Role</h3>
              <p className="text-apple-gray-800 text-lg">Lead Product Designer</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-apple-gray-400 uppercase tracking-wide">Timeline</h3>
              <p className="text-apple-gray-800 text-lg">Feb 2025 — Aug 2025</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-apple-gray-400 uppercase tracking-wide">Client</h3>
              <p className="text-apple-gray-800 text-lg">Apple Inc. (Concept)</p>
            </div>
            
            <div className="pt-8">
              <Link to="https://example.com" className="
                inline-flex items-center gap-2 px-6 py-3 rounded-full 
                bg-apple-gray-800 text-white font-medium 
                hover:bg-black transition-colors shadow-lg
              ">
                Visit Live Site
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </Link>
            </div>
          </div>
        </aside>

        {/* B. MAIN CONTENT (Editorial) */}
        <div className="md:col-span-8 lg:col-span-8 space-y-20">
          
          {/* Section: Context */}
          <section>
            <h2 className="text-3xl font-semibold text-apple-gray-800 mb-6 tracking-tight">The Challenge</h2>
            <p className="text-xl leading-relaxed text-apple-gray-500">
              Traditional interfaces are bound by 2D screens. The goal was to break these boundaries and create a system that feels "present" in the physical world without overwhelming the user. We needed to solve for eye-tracking latency and gesture fatigue.
            </p>
          </section>

          {/* Section: Image Gallery (Full Width in column) */}
          <section className="space-y-6">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-gray-100 border border-glass-border">
              {/* <Image src="/detail-1.jpg" fill className="object-cover" /> */}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative h-[300px] w-full rounded-2xl overflow-hidden bg-gray-100 border border-glass-border">
                 {/* <Image src="/detail-2.jpg" fill className="object-cover" /> */}
              </div>
              <div className="relative h-[300px] w-full rounded-2xl overflow-hidden bg-gray-100 border border-glass-border">
                 {/* <Image src="/detail-3.jpg" fill className="object-cover" /> */}
              </div>
            </div>
            <p className="text-sm text-apple-gray-400 text-center italic mt-2">
              Exploration of glass material refractions and depth layers.
            </p>
          </section>

          {/* Section: Solution */}
          <section>
            <h2 className="text-3xl font-semibold text-apple-gray-800 mb-6 tracking-tight">The Solution</h2>
            <p className="text-xl leading-relaxed text-apple-gray-500 mb-8">
              We developed a "Liquid Glass" material system that adapts to lighting conditions in real-time. By utilizing a multi-layered z-index approach, we ensured that active elements always feel closer to the user's eyes than passive elements.
            </p>
            <ul className="space-y-4 border-l-2 border-apple-gray-200 pl-6">
              <li className="text-lg text-apple-gray-600">
                <span className="font-semibold text-black">Adaptive Lighting:</span> UI elements cast shadows based on real-world light sources.
              </li>
              <li className="text-lg text-apple-gray-600">
                <span className="font-semibold text-black">Gaze Prediction:</span> Buttons glow slightly before the user even pinches, reducing cognitive load.
              </li>
            </ul>
          </section>

        </div>
      </div>

      {/* 3. NEXT PROJECT (Footer Nav) */}
      <div className="mt-32 pt-16 border-t border-glass-stroke">
        <Link to="/work/next-project" className="group block text-right">
          <span className="text-sm font-medium text-apple-gray-400 mb-2 block">Next Project</span>
          <span className="text-4xl md:text-5xl font-semibold text-apple-gray-800 group-hover:text-accent transition-colors">
            Fintech Dashboard &rarr;
          </span>
        </Link>
      </div>

    </article>
  );
}
