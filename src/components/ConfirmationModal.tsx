import React from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { BOOKS_BACKDROP_IMAGE } from '../data/bookstoreData';
import { Order } from '../types/bookstore';
import { BookCoverArt } from './BookCoverArt';

interface ConfirmationModalProps {
  order: Order;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  order,
  onContinueShopping,
  onViewOrders,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-3rem)] w-full flex items-center justify-center p-4 sm:p-8 bg-[#132B45]">
      <img
        src={BOOKS_BACKDROP_IMAGE}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-[#0A192A]/35" />

      <div className="relative z-10 w-full max-w-[740px] bg-[#222226] border border-[#383842] shadow-2xl rounded-sm p-6 sm:p-8 space-y-6">
        {/* Green Checkmark Header */}
        <div className="text-center space-y-3">
          <div className="w-11 h-11 rounded-full bg-[#24A148] text-white flex items-center justify-center mx-auto shadow-lg">
            <Check className="w-6 h-6 stroke-[2.75]" />
          </div>
          <h1 className="text-[17px] sm:text-[18px] font-medium text-white max-w-sm mx-auto leading-snug">
            Your purchase of the following reads is successful
          </h1>
          <p className="text-xs text-[#A8A8B3]">
            Order <span className="font-mono-num text-white">{order.id}</span> · Paid ₹
            <span className="font-mono-num">{order.totalAmount}</span> via {order.paymentMethod} ·{' '}
            <span className="text-[#42BE65]">+{order.pointsEarned} gift pts earned</span>
          </p>
        </div>

        {/* Purchased Books Strip */}
        <div
          className={`grid gap-5 ${
            order.items.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {order.items.map((item) => (
            <div
              key={`${item.bookId}-${item.format}`}
              className="flex gap-3.5 items-start bg-[#1B1B1F] border border-[#2E2E36] p-3.5 rounded-sm"
            >
              <div className="w-[82px] shrink-0">
                <BookCoverArt
                  theme={item.coverTheme}
                  title={item.title}
                  authorName={item.authorName}
                  isbn={item.isbn}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h2 className="text-[14px] font-semibold text-white truncate">{item.title}</h2>
                <p className="text-[11.5px] text-[#78A9FF]">by {item.authorName}</p>
                <p className="text-[11.5px] text-[#B8B8C2] line-clamp-2 leading-snug">
                  {item.description}
                </p>
                <p className="text-[11.5px] text-[#E4E4E7] pt-0.5">
                  {item.format} · Qty {item.quantity}
                </p>
                <p className="text-[11px] text-[#78A9FF] truncate">
                  {item.categories.join(', ')}
                </p>
                <p className="text-[14px] font-semibold font-mono-num text-white pt-0.5">
                  ₹{item.price * item.quantity}
                </p>
                <p className="text-[11px] text-[#9A9AA6]">{item.deliveryEstimate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onContinueShopping}
            className="px-6 py-2.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-[13px] font-medium rounded-sm flex items-center gap-2.5 transition-colors"
          >
            <span>Continue your Shopping</span>
            <ShoppingBag className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onViewOrders}
            className="px-4 py-2.5 bg-[#2C2C34] hover:bg-[#383842] text-[#E4E4E7] text-[13px] font-medium rounded-sm transition-colors"
          >
            View in My Orders
          </button>
        </div>
      </div>
    </div>
  );
};
