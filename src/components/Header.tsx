import React, { useState } from 'react';
import {
  LayoutGrid,
  ShoppingCart,
  UserCircle2,
  Menu,
  X,
  Gift,
  MapPin,
  LogOut,
  Check,
} from 'lucide-react';
import { DeliveryAddress, ViewMode } from '../types/bookstore';

interface HeaderProps {
  activeView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  giftPoints: number;
  savedAddress: DeliveryAddress;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  cartCount,
  wishlistCount,
  ordersCount,
  giftPoints,
  savedAddress,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems: { label: string; view: ViewMode; count?: number }[] = [
    { label: 'My Orders', view: 'orders', count: ordersCount },
    { label: 'My Wishlist', view: 'wishlist', count: wishlistCount },
    { label: 'My Writers', view: 'writers' },
  ];

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 h-12 bg-[#141416]/95 backdrop-blur border-b border-[#2A2A30]">
      <div className="w-full h-full px-4 flex items-center justify-between gap-4">
        {/* Left: Brand Icon + Wordmark | Vertical Divider | Topbar Links */}
        <div className="flex items-center min-w-0">
          <button
            type="button"
            onClick={() => handleNavClick('catalogue')}
            className="flex items-center gap-2.5 text-[#F4F4F4] hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0F62FE] rounded"
          >
            <LayoutGrid className="w-4 h-4 text-[#C6C6D0]" />
            <span className="text-[13.5px] font-medium tracking-tight">Book Worm</span>
          </button>

          <span className="hidden sm:block h-4 w-px bg-[#32323A] mx-5 shrink-0" aria-hidden="true" />

          <nav aria-label="Primary" className="hidden sm:flex items-center gap-5 md:gap-7">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => handleNavClick(item.view)}
                  className={`relative py-1 text-[12.5px] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0F62FE] ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-[#B4B4BE] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-[11px] h-[2px] bg-[#0F62FE]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Cart & Profile Icons */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          <button
            type="button"
            onClick={() => handleNavClick('checkout')}
            aria-label={`Shopping cart with ${cartCount} items`}
            className={`relative p-2 rounded hover:bg-[#26262C] transition-colors focus-visible:outline-2 focus-visible:outline-[#0F62FE] ${
              activeView === 'checkout' ? 'bg-[#26262C] text-white' : 'text-[#D4D4DC]'
            }`}
          >
            <ShoppingCart className="w-[17px] h-[17px]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#DA1E28] text-white text-[9.5px] font-semibold font-mono-num flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="Reader account and gift points"
            aria-expanded={profileOpen}
            className={`p-2 rounded hover:bg-[#26262C] transition-colors focus-visible:outline-2 focus-visible:outline-[#0F62FE] ${
              profileOpen ? 'bg-[#26262C] text-white' : 'text-[#D4D4DC]'
            }`}
          >
            <UserCircle2 className="w-[18px] h-[18px]" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="sm:hidden p-2 rounded text-[#D4D4DC] hover:bg-[#26262C] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-72 bg-[#1E1E22] border border-[#34343D] rounded-md shadow-2xl p-4 z-50">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#2E2E36]">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {savedAddress.firstName} {savedAddress.lastName}
                  </p>
                  <p className="text-xs text-[#A8A8B3] mt-0.5">{savedAddress.email}</p>
                </div>
                <span className="text-[11px] font-medium text-[#42BE65] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="py-3 space-y-2.5 border-b border-[#2E2E36]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A8A8B3] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#F1C21B]" /> Gift Points Balance
                  </span>
                  <span className="font-mono-num font-semibold text-white">{giftPoints} pts</span>
                </div>
                <div className="text-xs text-[#A8A8B3]">
                  <div className="flex items-center gap-1.5 text-[#D4D4DC] mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#78A9FF]" /> Saved Address
                  </div>
                  <p className="leading-relaxed text-[11px] text-[#9A9AA6]">
                    {savedAddress.addressLine}, {savedAddress.city}, {savedAddress.state} {savedAddress.pin}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('orders')}
                  className="text-xs font-medium text-[#78A9FF] hover:text-[#A6C8FF] transition-colors"
                >
                  View Order History
                </button>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="text-xs text-[#A8A8B3] hover:text-white flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" /> Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#18181B] border-b border-[#2A2A30] px-4 py-3 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick('catalogue')}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium ${
              activeView === 'catalogue' ? 'bg-[#26262C] text-white' : 'text-[#C6C6D0]'
            }`}
          >
            Catalogue
          </button>
          {navItems.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => handleNavClick(item.view)}
              className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium flex items-center justify-between ${
                activeView === item.view ? 'bg-[#26262C] text-white' : 'text-[#C6C6D0]'
              }`}
            >
              <span>{item.label}</span>
              {typeof item.count === 'number' && (
                <span className="font-mono-num text-xs text-[#78A9FF]">{item.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
