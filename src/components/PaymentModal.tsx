import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { BOOKS_BACKDROP_IMAGE } from '../data/bookstoreData';
import { PaymentMethodType } from '../types/bookstore';

interface PaymentModalProps {
  payableAmount: number;
  onBackToCheckout: () => void;
  onCompletePayment: (method: PaymentMethodType) => void;
}

const PAYMENT_METHODS: PaymentMethodType[] = ['Credit Card', 'Debit card', 'UPI', 'Wallet'];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  payableAmount,
  onBackToCheckout,
  onCompletePayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [upiId, setUpiId] = useState('aarav.mehta@okaxis');
  const [walletProvider, setWalletProvider] = useState('Book Worm Wallet');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const formatCardInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join('-') : '';
  };

  const formatExpiryInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const fillDemoCard = () => {
    setCardNumber('4532-8910-4412-7721');
    setNameOnCard('Aarav Mehta');
    setCvv('428');
    setExpiry('08/2029');
    setError(null);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedMethod === 'Credit Card' || selectedMethod === 'Debit card') {
      if (cardNumber.replace(/\D/g, '').length < 12 || !nameOnCard.trim() || cvv.length < 3 || expiry.length < 5) {
        setError('Enter valid card details or click "Use Demo Card" to continue.');
        return;
      }
    } else if (selectedMethod === 'UPI') {
      if (!upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g. name@okaxis).');
        return;
      }
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onCompletePayment(selectedMethod);
    }, 550);
  };

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

      <div className="relative z-10 w-full max-w-[680px] bg-[#222226] border border-[#383842] shadow-2xl rounded-sm overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#32323A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToCheckout}
              aria-label="Back to shopping cart"
              className="text-[#A8A8B3] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-[16px] font-medium text-white">Complete Payment</h1>
          </div>
          <p className="text-[15px] font-semibold text-white font-mono-num">
            Payable Amount: ₹{payableAmount}
          </p>
        </div>

        {/* Modal Body: Left Vertical Tabs + Right Form */}
        <form onSubmit={handlePaySubmit} className="grid grid-cols-1 sm:grid-cols-12">
          {/* Payment Methods List */}
          <div
            role="tablist"
            aria-label="Payment method"
            className="sm:col-span-4 bg-[#1B1B1F] border-b sm:border-b-0 sm:border-r border-[#32323A] flex sm:flex-col overflow-x-auto"
          >
            {PAYMENT_METHODS.map((method) => {
              const active = selectedMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedMethod(method);
                    setError(null);
                  }}
                  className={`px-4 py-3.5 text-left text-[13px] whitespace-nowrap transition-colors border-b border-[#2A2A32] relative ${
                    active
                      ? 'bg-[#2C2C32] text-white font-medium'
                      : 'text-[#A8A8B3] hover:bg-[#24242A] hover:text-white'
                  }`}
                >
                  {active && (
                    <span className="hidden sm:block absolute left-0 top-0 bottom-0 w-[3px] bg-white" />
                  )}
                  {method}
                </button>
              );
            })}
          </div>

          {/* Right Form Fields */}
          <div className="sm:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-5">
            {(selectedMethod === 'Credit Card' || selectedMethod === 'Debit card') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A8A8B3]">{selectedMethod} Details</span>
                  <button
                    type="button"
                    onClick={fillDemoCard}
                    className="text-[11.5px] text-[#78A9FF] hover:underline"
                  >
                    Use Demo Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pay-card-num" className="block text-[11px] text-[#A8A8B3] mb-1">
                      Card Number
                    </label>
                    <input
                      id="pay-card-num"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      className="w-full bg-[#2E2E34] border-b border-[#52525E] focus:border-[#0F62FE] px-3 py-2 text-[13px] font-mono-num text-white placeholder-[#73737E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="pay-card-name" className="block text-[11px] text-[#A8A8B3] mb-1">
                      Name on Card
                    </label>
                    <input
                      id="pay-card-name"
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Name"
                      className="w-full bg-[#2E2E34] border-b border-[#52525E] focus:border-[#0F62FE] px-3 py-2 text-[13px] text-white placeholder-[#73737E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="pay-card-cvv" className="block text-[11px] text-[#A8A8B3] mb-1">
                      CVV
                    </label>
                    <input
                      id="pay-card-cvv"
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="XXX"
                      className="w-full bg-[#2E2E34] border-b border-[#52525E] focus:border-[#0F62FE] px-3 py-2 text-[13px] font-mono-num text-white placeholder-[#73737E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="pay-card-exp" className="block text-[11px] text-[#A8A8B3] mb-1">
                      Date of Expiry
                    </label>
                    <input
                      id="pay-card-exp"
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiryInput(e.target.value))}
                      placeholder="MM/YYYY"
                      className="w-full bg-[#2E2E34] border-b border-[#52525E] focus:border-[#0F62FE] px-3 py-2 text-[13px] font-mono-num text-white placeholder-[#73737E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'UPI' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="pay-upi-id" className="block text-[11px] text-[#A8A8B3] mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    id="pay-upi-id"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okaxis"
                    className="w-full bg-[#2E2E34] border-b border-[#52525E] focus:border-[#0F62FE] px-3 py-2 text-[13px] text-white placeholder-[#73737E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] text-[#A8A8B3]">Quick UPI Apps</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiId(`aarav@${app.toLowerCase().replace(/\s+/g, '')}`)}
                        className="px-2.5 py-2 bg-[#2C2C32] hover:bg-[#383842] border border-[#3E3E48] rounded-sm text-xs text-[#E4E4E7] transition-colors"
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'Wallet' && (
              <div className="space-y-3">
                <p className="text-xs text-[#A8A8B3]">Select Digital Wallet</p>
                <div className="space-y-2">
                  {['Book Worm Wallet', 'Amazon Pay', 'Paytm Wallet'].map((provider) => (
                    <label
                      key={provider}
                      className={`flex items-center justify-between p-3 rounded-sm border cursor-pointer transition-colors ${
                        walletProvider === provider
                          ? 'bg-[#2C2C34] border-[#0F62FE] text-white'
                          : 'bg-[#1D1D22] border-[#32323A] text-[#C6C6D0]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 text-xs font-medium">
                        <input
                          type="radio"
                          name="wallet-provider"
                          checked={walletProvider === provider}
                          onChange={() => setWalletProvider(provider)}
                          className="accent-[#0F62FE]"
                        />
                        {provider}
                      </span>
                      <span className="text-[11px] font-mono-num text-[#42BE65]">Instant</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-[#FA4D56]" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2.5 bg-[#0F62FE] hover:bg-[#0353E9] disabled:opacity-70 text-white text-[13px] font-medium rounded-sm flex items-center gap-2.5 transition-colors"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay Now</span>
                    <CreditCard className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
