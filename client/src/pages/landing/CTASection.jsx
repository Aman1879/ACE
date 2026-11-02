import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-[#FFFDF8] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#1B1B1B] to-[#2D2D2D] text-white p-10 sm:p-16 text-center shadow-2xl overflow-hidden">
          {/* Decorative subtle ambient lights */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#57C76F]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              Start Free Today · No Credit Card Required
            </div>

            <h2 className="heading-lg text-white font-extrabold max-w-2xl mx-auto tracking-tight">
              Ready to Build Your Academic and Career Journey?
            </h2>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
              Bring your achievements, skills, projects, and career goals together with ACE.
              Manage, track, improve, and showcase in one platform.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary btn-lg shadow-orange w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center font-semibold text-sm text-gray-300 hover:text-white px-6 py-3 transition-colors"
              >
                Already have an account? Log In →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

