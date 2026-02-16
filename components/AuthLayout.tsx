import { BarChart3, ShieldCheck, Sparkles } from "lucide-react";
import React from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerActionText: string;
  onFooterAction: () => void;
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  footerText,
  footerActionText,
  onFooterAction,
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid lg:grid-cols-2">
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-10 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur px-3 py-2 rounded-lg mb-8">
              <BarChart3 size={18} />
              <span className="text-sm font-semibold tracking-wide">LeadGen Pro</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight">Close more leads with a faster workflow.</h1>
            <p className="mt-4 text-blue-100 text-sm leading-relaxed">
              Manage your pipeline, keep every team aligned, and turn qualified opportunities into predictable
              revenue.
            </p>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-100" />
                <span>Unified lead pipeline and team view</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-100" />
                <span>Secure account access for your workspace</span>
              </div>
            </div>
          </div>
        </section>

        <section className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>

          {children}

          <p className="text-sm text-gray-500 mt-6 text-center">
            {footerText}{" "}
            <button
              type="button"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              onClick={onFooterAction}
            >
              {footerActionText}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
