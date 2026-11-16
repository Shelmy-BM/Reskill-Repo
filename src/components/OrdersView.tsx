import { useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronUp, Package, RotateCcw } from 'lucide-react';
import { OrderStatus } from '../types/bookstore';
import { useStore } from '../context/StoreContext';
import { BookCover } from './BookCover';

const STATUS_STEPS: OrderStatus[] = ['Confirmed', 'Packed', 'In Transit', 'Delivered'];

export function OrdersView() {
  const { orders, reorderOrder, openBook, navigateTo } = useStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id ?? null
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <button
        type="button"
        onClick={() => navigateTo('storefront')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5A54] hover:text-[#141413] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Back to Catalog</span>
      </button>

      <div className="mb-10 pb-6 border-b border-[#E6E4DC]">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A54] mb-2">
          Order Tracking &amp; Receipts
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
          Your Orders ({orders.length})
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#E6E4DC] rounded-xl p-12 text-center">
          <Package className="w-8 h-8 text-[#8A877E] mx-auto mb-3" aria-hidden="true" />
          <h2 className="font-display text-2xl font-semibold text-[#141413] mb-2">
            No orders placed yet
          </h2>
          <p className="text-sm text-[#5C5A54] max-w-md mx-auto mb-6">
            Completed purchases appear here with full itemized receipts and delivery tracking.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('storefront')}
            className="px-6 py-2.5 min-h-[44px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] cursor-pointer"
          >
            Start Browsing
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStepIdx = STATUS_STEPS.indexOf(order.status);

            return (
              <article
                key={order.id}
                className="bg-white border border-[#E6E4DC] rounded-xl overflow-hidden"
              >
                {/* Order Summary Header */}
                <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EFEA]">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#5C5A54]">
                        Order Number
                      </p>
                      <p className="font-mono-num text-sm font-semibold text-[#141413]">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#5C5A54]">
                        Placed On
                      </p>
                      <p className="font-mono-num text-sm text-[#141413]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#5C5A54]">
                        Total
                      </p>
                      <p className="font-mono-num text-sm font-semibold text-[#141413]">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#5C5A54]">
                        Status
                      </p>
                      <p className="text-sm font-semibold text-[#1D4E3E]">
                        {order.status} · {order.estimatedDelivery}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => reorderOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border border-[#D8D5CB] bg-white text-xs font-medium text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Buy Again</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#F2F1EC] text-xs font-medium text-[#141413] hover:bg-[#E6E4DC] cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Receipt'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Shipment Progress Bar */}
                <div className="px-5 sm:px-6 py-4 bg-[#FAFAF8] border-b border-[#F0EFEA]">
                  <div className="grid grid-cols-4 gap-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const completed = idx <= currentStepIdx;
                      return (
                        <div key={step} className="space-y-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              completed ? 'bg-[#1D4E3E]' : 'bg-[#E6E4DC]'
                            }`}
                          />
                          <p
                            className={`text-[11px] flex items-center gap-1 ${
                              completed ? 'text-[#141413] font-medium' : 'text-[#8A877E]'
                            }`}
                          >
                            {completed && <Check className="w-3 h-3 text-[#1D4E3E]" />}
                            <span className="truncate">{step}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expanded Receipt & Items */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-7 space-y-4">
                      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5C5A54]">
                        Items in Parcel
                      </h2>
                      {order.items.map((item) => (
                        <div
                          key={`${item.bookId}-${item.format}`}
                          className="flex items-center gap-4"
                        >
                          <button
                            type="button"
                            onClick={() => openBook(item.bookId)}
                            className="w-12 shrink-0 cursor-pointer"
                          >
                            <BookCover
                              book={{
                                title: item.title,
                                author: item.author,
                                genre: 'Edition',
                                coverImage: item.coverImage,
                                coverStyle: item.coverStyle,
                              }}
                              size="sm"
                            />
                          </button>
                          <div className="flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => openBook(item.bookId)}
                              className="font-display text-sm font-semibold text-[#141413] hover:text-[#1D4E3E] text-left truncate block cursor-pointer"
                            >
                              {item.title}
                            </button>
                            <p className="text-xs text-[#5C5A54]">
                              {item.author} · {item.format} × {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono-num text-sm font-medium text-[#141413]">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="md:col-span-5 bg-[#FAFAF8] border border-[#E6E4DC] rounded-lg p-4 space-y-3 text-xs">
                      <div>
                        <p className="font-semibold text-[#141413] mb-0.5">Delivery Address</p>
                        <p className="text-[#5C5A54]">
                          {order.address.fullName}
                          <br />
                          {order.address.street ? `${order.address.street}, ` : ''}
                          {order.address.city} {order.address.postalCode}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#141413] mb-0.5">Payment</p>
                        <p className="text-[#5C5A54]">
                          {order.paymentMethod === 'cod'
                            ? 'Cash on Delivery'
                            : 'Paid by Card'}
                        </p>
                      </div>

                      {order.giftMessage && (
                        <div>
                          <p className="font-semibold text-[#141413] mb-0.5">Gift Note</p>
                          <p className="text-[#5C5A54] italic">&ldquo;{order.giftMessage}&rdquo;</p>
                        </div>
                      )}

                      <dl className="pt-2 border-t border-[#E6E4DC] space-y-1">
                        <div className="flex justify-between text-[#5C5A54]">
                          <dt>Subtotal</dt>
                          <dd className="font-mono-num">${order.subtotal.toFixed(2)}</dd>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-[#1D4E3E]">
                            <dt>Discount</dt>
                            <dd className="font-mono-num">-${order.discount.toFixed(2)}</dd>
                          </div>
                        )}
                        <div className="flex justify-between text-[#5C5A54]">
                          <dt>Shipping</dt>
                          <dd className="font-mono-num">
                            {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
                          </dd>
                        </div>
                        <div className="flex justify-between text-[#5C5A54]">
                          <dt>Tax</dt>
                          <dd className="font-mono-num">${order.tax.toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t border-[#E6E4DC] font-semibold text-[#141413]">
                          <dt>Total</dt>
                          <dd className="font-mono-num">${order.total.toFixed(2)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
