import React, { useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../data/books';
import { useStore } from '../context/StoreContext';
import { BookCover } from './BookCover';

export function BagDrawer() {
  const {
    books,
    cart,
    isBagOpen,
    setIsBagOpen,
    updateCartQuantity,
    removeFromCart,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    cartSubtotal,
    cartDiscount,
    shippingEstimate,
    hasPhysicalItemsInCart,
    navigateTo,
    openBook,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isBagOpen) return null;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - (cartSubtotal - cartDiscount)
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round(((cartSubtotal - cartDiscount) / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const estimatedTotal = Math.max(0, cartSubtotal - cartDiscount + shippingEstimate);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={() => setIsBagOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="relative z-10 w-full max-w-md bg-[#FAFAF8] h-full flex flex-col border-l border-[#E6E4DC] shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E6E4DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1D4E3E]" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-[#141413]">Your Bag</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsBagOpen(false)}
            aria-label="Close shopping bag"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#5C5A54] hover:text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {cart.length > 0 && hasPhysicalItemsInCart && (
          <div className="px-6 py-3 bg-[#F2F1EC] border-b border-[#E6E4DC]">
            <p className="text-xs text-[#141413] mb-1.5">
              {remainingForFreeShipping === 0 || appliedPromo?.type === 'shipping' ? (
                <span className="font-medium text-[#1D4E3E]">
                  Your order qualifies for complimentary standard shipping.
                </span>
              ) : (
                <span>
                  Add{' '}
                  <span className="font-mono-num font-semibold">
                    ${remainingForFreeShipping.toFixed(2)}
                  </span>{' '}
                  more for complimentary shipping.
                </span>
              )}
            </p>
            <div className="h-1.5 w-full rounded-full bg-[#E0DDD3] overflow-hidden">
              <div
                className="h-full bg-[#1D4E3E] transition-all duration-300"
                style={{
                  width: `${appliedPromo?.type === 'shipping' ? 100 : freeShippingProgress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-semibold text-[#141413] mb-2">
                Your reading bag is empty
              </p>
              <p className="text-sm text-[#5C5A54] mb-6">
                Explore curated literary fiction, natural history, and architecture monographs.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsBagOpen(false);
                  navigateTo('storefront');
                }}
                className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const book = books.find((b) => b.id === item.bookId);
              const variant = book?.variants.find((v) => v.format === item.format);
              if (!book || !variant) return null;

              return (
                <div
                  key={`${item.bookId}-${item.format}`}
                  className="bg-white border border-[#E6E4DC] rounded-xl p-4 flex gap-4"
                >
                  <button
                    type="button"
                    onClick={() => openBook(book.id)}
                    className="w-16 shrink-0 cursor-pointer"
                  >
                    <BookCover book={book} size="sm" />
                  </button>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => openBook(book.id)}
                          className="font-display text-sm font-semibold text-[#141413] hover:text-[#1D4E3E] text-left line-clamp-2 cursor-pointer"
                        >
                          {book.title}
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${book.title}`}
                          onClick={() => removeFromCart(item.bookId, item.format)}
                          className="p-1 text-[#8A877E] hover:text-[#991B1B] cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#5C5A54] mt-0.5">
                        {book.author} · {item.format}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-3">
                      <div className="inline-flex items-center border border-[#E6E4DC] rounded-md bg-[#FAFAF8]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateCartQuantity(item.bookId, item.format, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num w-8 text-center text-xs font-medium text-[#141413]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateCartQuantity(item.bookId, item.format, item.quantity + 1)
                          }
                          disabled={item.quantity >= variant.stockCount}
                          className="w-8 h-8 flex items-center justify-center text-[#141413] hover:bg-[#F2F1EC] disabled:opacity-40 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono-num text-sm font-medium text-[#141413]">
                        ${(variant.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Totals & Promo */}
        {cart.length > 0 && (
          <div className="px-6 py-5 bg-white border-t border-[#E6E4DC] space-y-4">
            {/* Promo Code Form */}
            {appliedPromo ? (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#1D4E3E]/8 border border-[#1D4E3E]/25 text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#1D4E3E] font-medium">
                  <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                  {appliedPromo.code} — {appliedPromo.label}
                </span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-[#5C5A54] hover:text-[#141413] font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handlePromoSubmit} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (try READ10)"
                    aria-label="Promo code"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D8D5CB] text-xs text-[#141413] placeholder:text-[#8A877E] focus:outline-none focus:border-[#1D4E3E]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg border border-[#D8D5CB] bg-[#FAFAF8] text-xs font-medium text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-[#991B1B]">{promoError}</p>}
              </form>
            )}

            {/* Breakdown */}
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5C5A54]">
                <dt>Subtotal</dt>
                <dd className="font-mono-num text-[#141413]">${cartSubtotal.toFixed(2)}</dd>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#1D4E3E]">
                  <dt>Discount ({appliedPromo?.code})</dt>
                  <dd className="font-mono-num">-${cartDiscount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between text-[#5C5A54]">
                <dt>Estimated Shipping</dt>
                <dd className="font-mono-num text-[#141413]">
                  {shippingEstimate === 0 ? 'Free' : `$${shippingEstimate.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E6E4DC] text-base font-semibold text-[#141413]">
                <dt>Estimated Total</dt>
                <dd className="font-mono-num">${estimatedTotal.toFixed(2)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => navigateTo('checkout')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
