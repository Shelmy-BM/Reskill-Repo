import React, { useEffect, useState } from 'react';
import { CreditCard, Gift, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { BOOKS_BACKDROP_IMAGE } from '../data/bookstoreData';
import { Book, CartItem, DeliveryAddress } from '../types/bookstore';
import { BookCoverArt } from './BookCoverArt';

interface CheckoutPageProps {
  cartItems: CartItem[];
  books: Book[];
  savedAddress: DeliveryAddress;
  giftPoints: number;
  onNavigateHome: () => void;
  onSelectBook: (book: Book) => void;
  onFilterByAuthor: (author: string) => void;
  onSelectCategory: (cat: string) => void;
  onUpdateQuantity: (bookId: string, delta: number) => void;
  onRemoveItem: (bookId: string) => void;
  onProceedToPayment: (payload: {
    address: DeliveryAddress;
    subtotal: number;
    tax: number;
    discount: number;
    pointsRedeemed: number;
    totalAmount: number;
  }) => void;
}

const EMPTY_ADDRESS: DeliveryAddress = {
  firstName: '',
  lastName: '',
  addressLine: '',
  email: '',
  city: '',
  pin: '',
  phoneCode: '+91',
  phoneNumber: '',
  state: 'Karnataka',
  country: 'India',
};

const STATES_LIST = [
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Tamil Nadu',
  'Telangana',
  'West Bengal',
  'Gujarat',
  'California',
  'New York',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  books,
  savedAddress,
  giftPoints,
  onNavigateHome,
  onSelectBook,
  onFilterByAuthor,
  onSelectCategory,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToPayment,
}) => {
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [address, setAddress] = useState<DeliveryAddress>(savedAddress);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (useSavedAddress) {
      setAddress(savedAddress);
      setFormError(null);
    } else {
      setAddress(EMPTY_ADDRESS);
    }
  }, [useSavedAddress, savedAddress]);

  const resolvedItems = cartItems
    .map((ci) => {
      const book = books.find((b) => b.id === ci.bookId);
      if (!book) return null;
      return { ...ci, book };
    })
    .filter((item): item is { bookId: string; format: CartItem['format']; quantity: number; book: Book } =>
      Boolean(item)
    );

  const totalItemCount = resolvedItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = resolvedItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.12);

  const couponDiscount =
    appliedCoupon === 'BOOK10'
      ? Math.round(subtotal * 0.1)
      : appliedCoupon === 'WELCOME50'
        ? Math.min(50, subtotal)
        : 0;

  // 10 Gift Points = ₹1 discount (capped at 50% of subtotal)
  const maxRedeemablePoints = Math.min(giftPoints, Math.floor((subtotal * 0.5) * 10));
  const pointsDiscount = redeemPoints ? Math.floor(maxRedeemablePoints / 10) : 0;
  const pointsUsed = redeemPoints ? pointsDiscount * 10 : 0;

  const discount = couponDiscount + pointsDiscount;
  const totalAmount = Math.max(0, subtotal + tax - discount);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'BOOK10' || code === 'WELCOME50') {
      setAppliedCoupon(code);
      setCouponMessage(
        code === 'BOOK10' ? '10% discount applied (BOOK10)' : '₹50 discount applied (WELCOME50)'
      );
    } else {
      setAppliedCoupon(null);
      setCouponMessage('Try code BOOK10 or WELCOME50');
    }
  };

  const handlePayNow = () => {
    if (
      !address.firstName.trim() ||
      !address.lastName.trim() ||
      !address.addressLine.trim() ||
      !address.email.trim() ||
      !address.city.trim() ||
      !address.pin.trim()
    ) {
      setFormError('Please fill in all required delivery address fields (or check Use Saved Address).');
      return;
    }
    setFormError(null);
    onProceedToPayment({
      address,
      subtotal,
      tax,
      discount,
      pointsRedeemed: pointsUsed,
      totalAmount,
    });
  };

  if (resolvedItems.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-lg mx-auto bg-[#1B1B1F] border border-[#2C2C34] rounded-md p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#26262C] flex items-center justify-center mx-auto text-[#78A9FF]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold text-white">Your shopping cart is empty</h1>
          <p className="text-sm text-[#A8A8B3]">
            Explore our curated collection of fiction, self-help, science, and mystery reads.
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-medium rounded-sm transition-colors"
          >
            Browse Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px]">
        <button type="button" onClick={onNavigateHome} className="text-[#78A9FF] hover:underline">
          Home
        </button>
        <span className="text-[#6F6F7B]">/</span>
        <span className="text-[#78A9FF]">Catalogue</span>
        <span className="text-[#6F6F7B]">/</span>
        <span className="text-[#C6C6D0]">Checkout</span>
      </nav>

      <h1 className="text-[18px] font-medium text-white">Shopping Cart</h1>

      {/* Top Cart Items Panel (Slide 4) */}
      <section className="bg-[#1C1C20] border border-[#2A2A32] p-4 sm:p-5 rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resolvedItems.map(({ book, format, quantity }) => (
            <div key={book.id} className="flex gap-4 items-start">
              <button
                type="button"
                onClick={() => onSelectBook(book)}
                className="w-[96px] shrink-0 text-left rounded-sm focus-visible:outline-2 focus-visible:outline-[#0F62FE]"
              >
                <BookCoverArt
                  theme={book.coverTheme}
                  title={book.title}
                  authorName={book.authorName}
                  isbn={book.isbn}
                  publisher={book.publisher}
                  backBlurb={book.backCoverBlurb}
                />
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectBook(book)}
                    className="text-left text-[15px] font-semibold text-white hover:text-[#78A9FF] transition-colors truncate"
                  >
                    {book.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(book.id)}
                    aria-label={`Remove ${book.title}`}
                    className="text-[#73737E] hover:text-[#FA4D56] p-1 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[12px] text-[#A8A8B3]">
                  by{' '}
                  <button
                    type="button"
                    onClick={() => onFilterByAuthor(book.authorName)}
                    className="text-[#78A9FF] hover:underline"
                  >
                    {book.authorName}
                  </button>
                </p>

                <p className="text-[12px] text-[#B8B8C2] line-clamp-2 leading-snug">
                  {book.description}
                </p>

                <p className="text-[12px] text-[#E4E4E7] pt-0.5">{format}</p>
                <p className="text-[11.5px] text-[#78A9FF] truncate">
                  {book.categories.map((cat, idx) => (
                    <React.Fragment key={cat}>
                      <button
                        type="button"
                        onClick={() => onSelectCategory(cat)}
                        className="hover:underline"
                      >
                        {cat}
                      </button>
                      {idx < book.categories.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </p>

                <div className="pt-1">
                  <p className="text-[15px] font-semibold font-mono-num text-white">
                    ₹{book.price * quantity}
                  </p>
                  <p className="text-[11px] text-[#9A9AA6]">{book.deliveryEstimate}</p>
                </div>

                {/* Quantity Stepper matching Slide 4 */}
                <div className="pt-1.5 inline-flex items-center bg-[#26262C] border border-[#383842] rounded-sm">
                  <span className="px-3 py-1 text-xs font-mono-num text-white border-r border-[#383842]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(book.id, -1)}
                    aria-label={`Decrease quantity for ${book.title}`}
                    className="px-2.5 py-1 text-[#D4D4DC] hover:bg-[#34343D] hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(book.id, 1)}
                    aria-label={`Increase quantity for ${book.title}`}
                    className="px-2.5 py-1 text-[#D4D4DC] hover:bg-[#34343D] hover:text-white transition-colors border-l border-[#383842]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom 2-Column Split: Address Form Left + Grand Total Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Address Form */}
        <section className="lg:col-span-7 bg-[#1C1C20] border border-[#2A2A32] p-5 rounded-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[16px] font-medium text-white">Address</h2>
            <label className="inline-flex items-center gap-2 text-xs text-[#D4D4DC] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useSavedAddress}
                onChange={(e) => setUseSavedAddress(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#0F62FE] rounded-sm"
              />
              <span>Use Saved Address</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label htmlFor="addr-first" className="block text-[11px] text-[#A8A8B3] mb-1">
                First Name
              </label>
              <input
                id="addr-first"
                type="text"
                value={address.firstName}
                onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                placeholder="First Name"
                className="w-full bg-[#26262C] border-b border-[#464652] focus:border-[#0F62FE] px-3 py-2 text-[13px] text-white placeholder-[#73737E] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="addr-last" className="block text-[11px] text-[#A8A8B3] mb-1">
                Last Name
              </label>
              <input
                id="addr-last"
                type="text"
                value={address.lastName}
                onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                placeholder="Last Name"
                className="w-full bg-[#26262C] border-b border-[#464652] focus:border-[#0F62FE] px-3 py-2 text-[13px] text-white placeholder-[#73737E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="addr-line" className="block text-[11px] text-[#A8A8B3] mb-1">
                Address
              </label>
              <input
                id="addr-line"
                type="text"
                value={address.addressLine}
                onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                placeholder="Address Line 1, Street, Apartment"
                className="w-full bg-[#26262C] border-b border-[#464652] focus:border-[#0F62FE] px-3 py-2 text-[13px] text-white placeholder-[#73737E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="addr-email" className="block text-[11px] text-[#A8A8B3] mb-1">
                e-mail
              </label>
              <input
                id="addr-email"
                type="email"
                value={address.email}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-[#26262C] border-b border-[#464652] focus:border-[#0F62FE] px-3 py-2 text-[13px] text-white placeholder-[#73737E] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="addr-city" className="block text-[11px] text-[#A8A8B3] mb-1">
                City
              </label>
              <input
                id="addr-city"
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
                className="w-full bg-[#26262C] border-b border-[#464652] focus:border-[#0F62FE] px-3 py-2 text-[13px] text-white placeholder-[#73737E] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="addr-pin" className="block text-[11px] text-[#A8A8B3] mb-1">
                Pin
              </label>
              <input
                id="addr-pin"
                type="text"
                value={address.pin}
                onChange={(e) => setAddress({ ...address, pin: e.target.value })}
                placeholder="000 000"
                className="w-full bg-[#26262C] border-b border-[#464652] focus:border-[#0F62FE] px-3 py-2 text-[13px] font-mono-num text-white placeholder-[#73737E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="addr-phone" className="block text-[11px] text-[#A8A8B3] mb-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  aria-label="Country calling code"
                  value={address.phoneCode}
                  onChange={(e) => setAddress({ ...address, phoneCode: e.target.value })}
                  className="bg-[#26262C] border-b border-[#464652] px-2.5 py-2 text-[13px] font-mono-num text-white focus:outline-none"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  id="addr-phone"
                  type="tel"
                  value={address.phoneNumber}
                  onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                  placeholder="1234567890"
                  className="w-full bg-[#26262C] border-b border-[#464652] focus:border-[#0F62FE] px-3 py-2 text-[13px] font-mono-num text-white placeholder-[#73737E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="addr-state" className="block text-[11px] text-[#A8A8B3] mb-1">
                State
              </label>
              <select
                id="addr-state"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full bg-[#26262C] border-b border-[#464652] px-3 py-2 text-[13px] text-white focus:outline-none"
              >
                {STATES_LIST.map((st) => (
                  <option key={st} value={st} className="bg-[#1E1E22]">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="addr-country" className="block text-[11px] text-[#A8A8B3] mb-1">
                Country
              </label>
              <select
                id="addr-country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="w-full bg-[#26262C] border-b border-[#464652] px-3 py-2 text-[13px] text-white focus:outline-none"
              >
                <option value="India" className="bg-[#1E1E22]">India</option>
                <option value="United States" className="bg-[#1E1E22]">United States</option>
                <option value="United Kingdom" className="bg-[#1E1E22]">United Kingdom</option>
              </select>
            </div>
          </div>

          {formError && (
            <p className="text-xs text-[#FA4D56] pt-1" role="alert">
              {formError}
            </p>
          )}
        </section>

        {/* Grand Total Card (with Illustrated Books Artwork Left + Order Summary Right) */}
        <section className="lg:col-span-5 bg-[#1C1C20] border border-[#2A2A32] rounded-sm overflow-hidden grid grid-cols-1 sm:grid-cols-12">
          <div className="sm:col-span-5 relative min-h-[160px] bg-[#132B45]">
            <img
              src={BOOKS_BACKDROP_IMAGE}
              alt="Illustrated book collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="sm:col-span-7 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h2 className="text-[16px] font-medium text-white">Grand Total</h2>

              <div className="space-y-2 text-[13px]">
                <div className="flex items-center justify-between text-[#D4D4DC]">
                  <span>Price ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-mono-num">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[#D4D4DC]">
                  <span>Tax (12%)</span>
                  <span className="font-mono-num">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[#D4D4DC]">
                  <span>Delivery Charges</span>
                  <span className="text-[#42BE65] font-medium">Free</span>
                </div>
              </div>

              {/* Apply Coupon */}
              <div className="pt-1 space-y-1.5">
                <div className="flex">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Apply Coupon (e.g. BOOK10)"
                    className="flex-1 min-w-0 bg-[#26262C] border-b border-[#464652] px-2.5 py-1.5 text-xs text-white placeholder-[#73737E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-1.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-medium shrink-0 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] ${appliedCoupon ? 'text-[#42BE65]' : 'text-[#F1C21B]'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Redeem Gift Points (Slide 4 Feature!) */}
              {giftPoints >= 10 && (
                <label className="flex items-center justify-between gap-2 p-2.5 bg-[#232329] border border-[#32323B] rounded-sm cursor-pointer">
                  <span className="flex items-center gap-2 text-xs text-[#E4E4E7]">
                    <input
                      type="checkbox"
                      checked={redeemPoints}
                      onChange={(e) => setRedeemPoints(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#0F62FE]"
                    />
                    <Gift className="w-3.5 h-3.5 text-[#F1C21B]" />
                    <span>Redeem {maxRedeemablePoints} gift pts</span>
                  </span>
                  <span className="text-xs font-mono-num text-[#42BE65]">
                    -₹{Math.floor(maxRedeemablePoints / 10)}
                  </span>
                </label>
              )}

              <div className="flex items-center justify-between text-[13px] text-[#D4D4DC]">
                <span>Discount</span>
                <span className="font-mono-num text-[#42BE65]">
                  {discount > 0 ? `-₹${discount}` : '₹0'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#2E2E36] flex items-center justify-between text-[15px] font-semibold text-white">
                <span>Total Amount</span>
                <span className="font-mono-num">₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handlePayNow}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-[13px] font-medium rounded-sm flex items-center justify-center gap-2.5 transition-colors"
              >
                <span>Pay Now</span>
                <CreditCard className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
