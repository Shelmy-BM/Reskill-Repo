import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../data/books';
import { Order, PaymentMethod, ShippingAddress, ShippingMethod } from '../types/bookstore';
import { useStore } from '../context/StoreContext';
import { BookCover } from './BookCover';

export function CheckoutView() {
  const {
    books,
    cart,
    cartSubtotal,
    cartDiscount,
    appliedPromo,
    hasPhysicalItemsInCart,
    placeOrder,
    navigateTo,
  } = useStore();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(
    hasPhysicalItemsInCart ? 'standard' : 'digital'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Card UI fields (validated client-side without external secrets)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-[#E6E4DC] rounded-2xl p-8 sm:p-10">
          <div className="flex items-center gap-3 text-[#1D4E3E] mb-4">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Order Confirmed
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
            Thank you, {confirmedOrder.address.fullName}
          </h1>
          <p className="text-sm text-[#5C5A54] mt-2">
            Order <span className="font-mono-num font-semibold text-[#141413]">{confirmedOrder.id}</span>{' '}
            is confirmed — {confirmedOrder.status === 'Delivered' ? 'Instant access ready' : 'Preparing shipment'}.
            Estimated arrival: <span className="font-medium text-[#141413]">{confirmedOrder.estimatedDelivery}</span>.
          </p>

          {/* Receipt Breakdown */}
          <div className="mt-8 border-t border-[#E6E4DC] pt-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5C5A54]">
              Order Receipt
            </h2>

            <div className="space-y-3">
              {confirmedOrder.items.map((item) => (
                <div
                  key={`${item.bookId}-${item.format}`}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#141413]">
                      {item.title} <span className="text-[#5C5A54]">× {item.quantity}</span>
                    </p>
                    <p className="text-xs text-[#5C5A54]">
                      {item.author} · {item.format}
                    </p>
                  </div>
                  <span className="font-mono-num font-medium text-[#141413]">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="pt-4 border-t border-[#F0EFEA] space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5C5A54]">
                <dt>Subtotal</dt>
                <dd className="font-mono-num">${confirmedOrder.subtotal.toFixed(2)}</dd>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-[#1D4E3E]">
                  <dt>Promo ({confirmedOrder.promoCode})</dt>
                  <dd className="font-mono-num">-${confirmedOrder.discount.toFixed(2)}</dd>
                </div>
              )}
              {confirmedOrder.giftWrapCost > 0 && (
                <div className="flex justify-between text-[#5C5A54]">
                  <dt>Archival Gift Wrap</dt>
                  <dd className="font-mono-num">${confirmedOrder.giftWrapCost.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between text-[#5C5A54]">
                <dt>Shipping</dt>
                <dd className="font-mono-num">
                  {confirmedOrder.shippingCost === 0
                    ? 'Free'
                    : `$${confirmedOrder.shippingCost.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between text-[#5C5A54]">
                <dt>Tax (8%)</dt>
                <dd className="font-mono-num">${confirmedOrder.tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E6E4DC] text-base font-semibold text-[#141413]">
                <dt>
                  {confirmedOrder.paymentMethod === 'cod'
                    ? 'Total Due on Delivery'
                    : 'Total Paid'}
                </dt>
                <dd className="font-mono-num">${confirmedOrder.total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigateTo('orders')}
              className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] cursor-pointer"
            >
              Track Order History
            </button>
            <button
              type="button"
              onClick={() => navigateTo('storefront')}
              className="px-5 py-2.5 min-h-[44px] rounded-lg border border-[#D8D5CB] bg-white text-[#141413] text-sm font-medium hover:bg-[#F2F1EC] cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-[#141413] mb-3">
          Your bag is currently empty
        </h1>
        <p className="text-sm text-[#5C5A54] mb-6">
          Add a book to your bag before checking out.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('storefront')}
          className="px-6 py-3 rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const shippingCost =
    !hasPhysicalItemsInCart || shippingMethod === 'digital'
      ? 0
      : shippingMethod === 'express'
        ? 12.99
        : appliedPromo?.type === 'shipping' ||
            cartSubtotal - cartDiscount >= FREE_SHIPPING_THRESHOLD
          ? 0
          : 4.99;

  const giftWrapCost = giftWrap && hasPhysicalItemsInCart ? 3.5 : 0;
  const taxable = Math.max(0, cartSubtotal - cartDiscount + giftWrapCost);
  const tax = Number((taxable * 0.08).toFixed(2));
  const total = Number((taxable + shippingCost + tax).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName.trim() || !address.email.trim() || !address.phone.trim()) {
      setFormError('Please provide your full name, email address, and phone number.');
      return;
    }

    if (
      hasPhysicalItemsInCart &&
      (!address.street.trim() || !address.city.trim() || !address.postalCode.trim())
    ) {
      setFormError('Please complete your street address, city, and postal code for delivery.');
      return;
    }

    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\s+/g, '');
      if (digits.length < 12 || !cardExpiry.trim() || cardCvc.trim().length < 3) {
        setFormError('Please enter valid card details (or choose Cash on Delivery).');
        return;
      }
    }

    setFormError(null);
    const created = placeOrder({
      address,
      shippingMethod: hasPhysicalItemsInCart ? shippingMethod : 'digital',
      paymentMethod,
      giftWrap,
      giftMessage,
    });
    setConfirmedOrder(created);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <button
        type="button"
        onClick={() => navigateTo('storefront')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5A54] hover:text-[#141413] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Back to Bookstore</span>
      </button>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413] mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form Steps */}
        <div className="lg:col-span-7 space-y-8">
          {formError && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
              {formError}
            </div>
          )}

          {/* Step 1: Contact & Delivery */}
          <section className="bg-white border border-[#E6E4DC] rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EFEA]">
              <Truck className="w-4 h-4 text-[#1D4E3E]" aria-hidden="true" />
              <h2 className="font-display text-xl font-semibold text-[#141413]">
                1. Contact &amp; Delivery Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="chk-name" className="block text-xs font-medium text-[#141413] mb-1">
                  Full Name *
                </label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="Clara Bennett"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                />
              </div>

              <div>
                <label htmlFor="chk-email" className="block text-xs font-medium text-[#141413] mb-1">
                  Email Address *
                </label>
                <input
                  id="chk-email"
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="clara@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                />
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-xs font-medium text-[#141413] mb-1">
                  Phone Number *
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+1 (503) 555-0192"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                />
              </div>

              {hasPhysicalItemsInCart && (
                <>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="chk-street"
                      className="block text-xs font-medium text-[#141413] mb-1"
                    >
                      Street Address *
                    </label>
                    <input
                      id="chk-street"
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="742 NW Alder Street, Apt 4B"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="chk-city"
                      className="block text-xs font-medium text-[#141413] mb-1"
                    >
                      City &amp; State *
                    </label>
                    <input
                      id="chk-city"
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Portland, OR"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="chk-zip"
                      className="block text-xs font-medium text-[#141413] mb-1"
                    >
                      Postal Code *
                    </label>
                    <input
                      id="chk-zip"
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="97205"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Shipping Speed */}
            {hasPhysicalItemsInCart && (
              <div className="pt-2 space-y-2.5">
                <p className="text-xs font-medium text-[#141413]">Shipping Method</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('standard')}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer ${
                      shippingMethod === 'standard'
                        ? 'border-[#1D4E3E] bg-[#1D4E3E]/5 ring-1 ring-[#1D4E3E]'
                        : 'border-[#E6E4DC]'
                    }`}
                  >
                    <div className="flex justify-between text-sm font-semibold text-[#141413]">
                      <span>Standard Courier</span>
                      <span className="font-mono-num">
                        {cartSubtotal - cartDiscount >= FREE_SHIPPING_THRESHOLD ||
                        appliedPromo?.type === 'shipping'
                          ? 'Free'
                          : '$4.99'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C5A54] mt-0.5">4–5 business days</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('express')}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer ${
                      shippingMethod === 'express'
                        ? 'border-[#1D4E3E] bg-[#1D4E3E]/5 ring-1 ring-[#1D4E3E]'
                        : 'border-[#E6E4DC]'
                    }`}
                  >
                    <div className="flex justify-between text-sm font-semibold text-[#141413]">
                      <span>Express Air</span>
                      <span className="font-mono-num">$12.99</span>
                    </div>
                    <p className="text-xs text-[#5C5A54] mt-0.5">1–2 business days</p>
                  </button>
                </div>

                {/* Optional Gift Wrapping */}
                <div className="pt-3">
                  <label className="inline-flex items-center gap-2.5 text-sm text-[#141413] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="accent-[#1D4E3E] w-4 h-4 rounded"
                    />
                    <span>Add archival linen-paper gift wrap &amp; ribbon (+$3.50)</span>
                  </label>

                  {giftWrap && (
                    <textarea
                      rows={2}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Optional handwritten gift card message..."
                      className="mt-2.5 w-full px-3.5 py-2 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                    />
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Step 2: Payment Method */}
          <section className="bg-white border border-[#E6E4DC] rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EFEA]">
              <CreditCard className="w-4 h-4 text-[#1D4E3E]" aria-hidden="true" />
              <h2 className="font-display text-xl font-semibold text-[#141413]">
                2. Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-lg border text-left cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#1D4E3E] bg-[#1D4E3E]/5 ring-1 ring-[#1D4E3E]'
                    : 'border-[#E6E4DC]'
                }`}
              >
                <p className="text-sm font-semibold text-[#141413]">Credit or Debit Card</p>
                <p className="text-xs text-[#5C5A54] mt-0.5">Visa, Mastercard, Amex</p>
              </button>

              {hasPhysicalItemsInCart && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#1D4E3E] bg-[#1D4E3E]/5 ring-1 ring-[#1D4E3E]'
                      : 'border-[#E6E4DC]'
                  }`}
                >
                  <p className="text-sm font-semibold text-[#141413]">Cash on Delivery (COD)</p>
                  <p className="text-xs text-[#5C5A54] mt-0.5">Pay courier on arrival</p>
                </button>
              )}
            </div>

            {paymentMethod === 'card' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="sm:col-span-2">
                  <label htmlFor="chk-card" className="block text-xs font-medium text-[#141413] mb-1">
                    Card Number
                  </label>
                  <input
                    id="chk-card"
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] font-mono-num text-sm focus:outline-none focus:border-[#1D4E3E]"
                  />
                </div>
                <div>
                  <label htmlFor="chk-exp" className="block text-xs font-medium text-[#141413] mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="chk-exp"
                    type="text"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="08/29"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] font-mono-num text-sm focus:outline-none focus:border-[#1D4E3E]"
                  />
                </div>
                <div>
                  <label htmlFor="chk-cvc" className="block text-xs font-medium text-[#141413] mb-1">
                    Security Code
                  </label>
                  <input
                    id="chk-cvc"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="424"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D5CB] font-mono-num text-sm focus:outline-none focus:border-[#1D4E3E]"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#F2F1EC] border border-[#E6E4DC] text-xs text-[#141413] leading-relaxed">
                <p className="font-semibold mb-1">Cash on Delivery Terms</p>
                <p className="text-[#5C5A54]">
                  Pay <span className="font-mono-num font-semibold text-[#141413]">${total.toFixed(2)}</span>{' '}
                  in cash or mobile tap upon parcel inspection. No extra COD surcharge applies.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Sticky Order Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#E6E4DC] rounded-xl p-6 space-y-5">
          <h2 className="font-display text-xl font-semibold text-[#141413] pb-3 border-b border-[#F0EFEA]">
            Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => {
              const book = books.find((b) => b.id === item.bookId);
              const variant = book?.variants.find((v) => v.format === item.format);
              if (!book || !variant) return null;
              return (
                <div key={`${item.bookId}-${item.format}`} className="flex items-center gap-3.5">
                  <div className="w-12 shrink-0">
                    <BookCover book={book} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#141413] truncate">{book.title}</p>
                    <p className="text-xs text-[#5C5A54]">
                      {item.format} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono-num text-sm font-medium text-[#141413]">
                    ${(variant.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <dl className="pt-4 border-t border-[#E6E4DC] space-y-2 text-sm">
            <div className="flex justify-between text-[#5C5A54]">
              <dt>Subtotal</dt>
              <dd className="font-mono-num text-[#141413]">${cartSubtotal.toFixed(2)}</dd>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-[#1D4E3E]">
                <dt>Promo ({appliedPromo?.code})</dt>
                <dd className="font-mono-num">-${cartDiscount.toFixed(2)}</dd>
              </div>
            )}
            {giftWrapCost > 0 && (
              <div className="flex justify-between text-[#5C5A54]">
                <dt>Gift Wrap</dt>
                <dd className="font-mono-num">${giftWrapCost.toFixed(2)}</dd>
              </div>
            )}
            <div className="flex justify-between text-[#5C5A54]">
              <dt>Shipping</dt>
              <dd className="font-mono-num text-[#141413]">
                {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
              </dd>
            </div>
            <div className="flex justify-between text-[#5C5A54]">
              <dt>Estimated Tax (8%)</dt>
              <dd className="font-mono-num text-[#141413]">${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#E6E4DC] text-lg font-semibold text-[#141413]">
              <dt>Total</dt>
              <dd className="font-mono-num">${total.toFixed(2)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 min-h-[48px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] transition-colors cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" aria-hidden="true" />
            <span>
              {paymentMethod === 'cod'
                ? `Place COD Order — $${total.toFixed(2)}`
                : `Complete Order — $${total.toFixed(2)}`}
            </span>
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-[#5C5A54]">
            <ShieldCheck className="w-4 h-4 text-[#1D4E3E]" aria-hidden="true" />
            <span>30-day condition guarantee on all editions</span>
          </p>
        </aside>
      </form>
    </div>
  );
}
