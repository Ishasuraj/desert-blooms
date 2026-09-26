import React, { FormEvent, useState, useEffect } from "react";
import { ENQUIRY_SERVICES, EnquiryService } from "@shared/enquirySchema";
import { ArrowUpRight, Check, ChevronDown, X } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export function ConsultationModal({
  isOpen,
  onClose,
  defaultService = "",
}: ConsultationModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: defaultService,
    message: "",
    _gotcha: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultService) {
      setForm((prev) => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ consultationModalOpen: true }, "");

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const handleModalClose = () => {
    onClose();
    if (window.history.state?.consultationModalOpen) {
      window.history.back();
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? "We could not send your enquiry.");
      }

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({
          name: "",
          email: "",
          service: defaultService,
          message: "",
          _gotcha: "",
        });
        onClose();
      }, 2500);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your enquiry."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={handleModalClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#274032] border border-[rgba(231,225,212,0.2)] rounded-lg shadow-2xl p-6 sm:p-8 text-[#f1eadf] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-[#bdc8ba] hover:text-white transition-colors p-1"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <p className="text-[#d27a58] text-[10px] font-bold tracking-[0.18em] uppercase mb-1">
            Desert Blooms Consultation
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#f1eadf]">
            Request a <i>Free Consultation</i>
          </h3>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="hp-field" aria-hidden="true">
            Company
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form._gotcha}
              onChange={(e) => setForm((c) => ({ ...c, _gotcha: e.target.value }))}
            />
          </label>

          <div className="flex flex-col gap-1">
            <label className="text-[#bdc8ba] text-[10px] tracking-[0.14em] font-semibold uppercase">
              NAME
            </label>
            <input
              required
              placeholder="Your name"
              value={form.name}
              maxLength={100}
              disabled={submitting || sent}
              onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
              className="w-full pt-1 pb-2 bg-transparent border-b border-white/30 text-sm text-[#f1eadf] placeholder:text-[#8ba08d] focus:outline-none focus:border-[#d27a58] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#bdc8ba] text-[10px] tracking-[0.14em] font-semibold uppercase">
              EMAIL
            </label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              maxLength={254}
              disabled={submitting || sent}
              onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
              className="w-full pt-1 pb-2 bg-transparent border-b border-white/30 text-sm text-[#f1eadf] placeholder:text-[#8ba08d] focus:outline-none focus:border-[#d27a58] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-[#bdc8ba] text-[10px] tracking-[0.14em] font-semibold uppercase">
              HOW CAN WE HELP?
            </label>
            <select
              required
              value={form.service}
              disabled={submitting || sent}
              onChange={(e) => setForm((c) => ({ ...c, service: e.target.value }))}
              className="w-full pt-1 pb-2 pr-8 bg-transparent border-b border-white/30 text-sm text-[#f1eadf] focus:outline-none focus:border-[#d27a58] transition-colors appearance-none"
            >
              <option value="" disabled className="text-gray-900 bg-white">
                Select a service
              </option>
              {ENQUIRY_SERVICES.map((srv) => (
                <option key={srv} value={srv} className="text-gray-900 bg-white">
                  {srv}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-0 bottom-2 text-[#d27a58] pointer-events-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#bdc8ba] text-[10px] tracking-[0.14em] font-semibold uppercase">
              TELL US ABOUT THE SPACE
            </label>
            <textarea
              required
              placeholder="A few details about your project..."
              rows={3}
              value={form.message}
              maxLength={5000}
              disabled={submitting || sent}
              onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
              className="w-full pt-1 pb-2 bg-transparent border-b border-white/30 text-sm text-[#f1eadf] placeholder:text-[#8ba08d] focus:outline-none focus:border-[#d27a58] transition-colors resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || sent}
            className="w-full mt-4 py-4 px-6 bg-[#e8dfce] hover:bg-[#decfae] text-[#22352b] text-xs tracking-[0.15em] font-bold uppercase rounded flex items-center justify-center gap-2 transition-transform duration-180 active:scale-95"
          >
            {sent ? (
              <>
                <Check size={16} className="text-green-700" /> Message Sent
              </>
            ) : submitting ? (
              "Sending..."
            ) : (
              <>
                SEND AN ENQUIRY <ArrowUpRight size={16} />
              </>
            )}
          </button>

          {error ? (
            <p className="text-xs text-[#f0b4a0] text-center">{error}</p>
          ) : null}

          <p className="text-[10px] text-[#95a497] text-center pt-1">
            {sent
              ? "Thank you — we'll reply to your email shortly."
              : "Your enquiry goes straight to the Desert Blooms inbox."}
          </p>
        </form>
      </div>
    </div>
  );
}
