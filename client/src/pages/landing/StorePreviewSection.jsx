import React from 'react';
import { ShoppingBag, Coins, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StorePreviewSection() {
  const products = [
    {
      name: 'ACE Official T-Shirt',
      category: 'Physical',
      price: 1000,
      image: '👕',
      desc: 'Premium cotton branded t-shirt. Shipped directly to your address.',
      tag: 'Merchandise',
    },
    {
      name: 'ACE Pro Subscription',
      category: 'Digital',
      price: 500,
      image: '⭐',
      desc: '6-month unlock of priority recruiter views and advanced analytics.',
      tag: 'Digital Perk',
    },
    {
      name: 'Minimalist Portfolio Theme',
      category: 'Theme',
      price: 300,
      image: '🎨',
      desc: 'Clean, Apple-inspired portfolio layout for your public profile.',
      tag: 'Customization',
    },
    {
      name: 'ACE Stainless Steel Bottle',
      category: 'Physical',
      price: 850,
      image: '🍶',
      desc: '750ml insulated matte black student flask with laser engraved logo.',
      tag: 'Merchandise',
    },
  ];

  return (
    <section id="store" className="py-24 bg-white border-y border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              The ACE Store
            </span>
            <h2 className="section-title mt-2">Redeem Your Hard-Earned ACE Tokens</h2>
            <p className="section-subtitle">
              Turn your coding problems, projects, and streak milestones into physical merchandise
              and exclusive digital platform themes.
            </p>
          </div>
          <Link
            to="/register"
            className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2 self-start md:self-auto"
          >
            Explore Store
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, idx) => (
            <div
              key={idx}
              className="card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-[#FFFDF8] rounded-xl border border-[#EAEAEA] flex items-center justify-center text-5xl mb-4 relative overflow-hidden">
                  <span>{p.image}</span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#6B7280] shadow-xs">
                    {p.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1B1B1B] mb-1">{p.name}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{p.desc}</p>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#FF6B00]">
                  <Coins className="w-4 h-4" />
                  <span>{p.price} Tokens</span>
                </div>
                <Link
                  to="/register"
                  className="text-xs font-bold text-[#57C76F] hover:underline flex items-center gap-1"
                >
                  Redeem
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

