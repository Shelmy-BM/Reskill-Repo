import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Footer() {
  const { navigateTo, selectCollectionAndBrowse } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-[#E6E4DC] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Summary */}
          <div className="md:col-span-4">
            <p className="font-display text-2xl font-semibold text-[#141413]">Alder &amp; Page</p>
            <p className="text-sm text-[#5C5A54] mt-3 leading-relaxed max-w-xs">
              Independent reading room and archival bookshop. Every physical edition is wrapped in
              acid-free kraft paper and dispatched within 24 hours.
            </p>
            <p className="font-mono-num text-xs text-[#5C5A54] mt-4">
              742 NW Alder Street · Portland, Oregon
              <br />
              Open Daily 10:00 – 19:00
            </p>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#141413] mb-3">
              Bookshop
            </p>
            <ul className="space-y-2.5 text-sm text-[#5C5A54]">
              <li>
                <button
                  type="button"
                  onClick={() => selectCollectionAndBrowse(null)}
                  className="hover:text-[#141413] cursor-pointer"
                >
                  All Editions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => selectCollectionAndBrowse('quiet-spaces')}
                  className="hover:text-[#141413] cursor-pointer"
                >
                  Quiet Spaces
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => selectCollectionAndBrowse('field-notes')}
                  className="hover:text-[#141413] cursor-pointer"
                >
                  Field Notes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => selectCollectionAndBrowse('midnight-folios')}
                  className="hover:text-[#141413] cursor-pointer"
                >
                  Modern Literary
                </button>
              </li>
            </ul>
          </div>

          {/* Reader Account */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#141413] mb-3">
              Reader Care
            </p>
            <ul className="space-y-2.5 text-sm text-[#5C5A54]">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-[#141413] cursor-pointer"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('orders')}
                  className="hover:text-[#141413] cursor-pointer"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('checkout')}
                  className="hover:text-[#141413] cursor-pointer"
                >
                  Checkout
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#141413] mb-3">
              Monthly Reading Letter
            </p>
            <p className="text-sm text-[#5C5A54] mb-4">
              Seasonal staff essays and early access to limited press runs. Use code{' '}
              <span className="font-mono-num font-semibold text-[#141413]">READ10</span> for 10% off.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1D4E3E]/10 text-sm font-medium text-[#1D4E3E]">
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>You are subscribed to the Monthly Reading Letter.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <label htmlFor="footer-newsletter" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] text-sm text-[#141413] placeholder:text-[#8A877E] focus:outline-none focus:border-[#1D4E3E]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#1D4E3E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#F0EFEA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C5A54]">
          <p>&copy; 2026 Alder &amp; Page Booksellers. All rights reserved.</p>
          <p>Free shipping over $45 · Hardcover, Paperback &amp; E-Book editions</p>
        </div>
      </div>
    </footer>
  );
}
