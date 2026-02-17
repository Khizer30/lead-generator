import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import { X, Linkedin, Loader2, ChevronRight, Check } from "lucide-react";
import * as Yup from "yup";
import { Lead, PipelineStage } from "../types";
import { api } from "../services/api";
import { translations, Language } from "../translations";

interface LeadModalProps {
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  owners: Array<{ id: string; name: string }>;
  lang: Language;
}

const LeadModal: React.FC<LeadModalProps> = ({ onClose, onSave, owners, lang }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [enrichmentError, setEnrichmentError] = useState("");

  const t = useMemo(() => translations[lang], [lang]);
  const isDe = lang === "de";
  const lettersOnlyPattern = /^[\p{L}\s'-]+$/u;
  const noDigitsPattern = /^\D+$/;
  const companyNamePattern = /^[\p{L}\p{N}\s]+$/u;
  const isValidLinkedInUrl = (value?: string) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      return host === "linkedin.com" || host === "www.linkedin.com" || host.endsWith(".linkedin.com");
    } catch {
      return false;
    }
  };

  const validationSchema = useMemo(
    () =>
      Yup.object({
        firstName: Yup.string()
          .trim()
          .required(isDe ? "Vorname ist erforderlich" : "First name is required")
          .matches(noDigitsPattern, isDe ? "Vorname darf keine Zahlen enthalten" : "First name cannot contain numbers")
          .matches(lettersOnlyPattern, isDe ? "Vorname enthält ungültige Zeichen" : "First name contains invalid characters"),
        lastName: Yup.string()
          .trim()
          .required(isDe ? "Nachname ist erforderlich" : "Last name is required")
          .matches(noDigitsPattern, isDe ? "Nachname darf keine Zahlen enthalten" : "Last name cannot contain numbers")
          .matches(lettersOnlyPattern, isDe ? "Nachname enthält ungültige Zeichen" : "Last name contains invalid characters"),
        currentPosition: Yup.string()
          .trim()
          .required(isDe ? "Position ist erforderlich" : "Position is required")
          .matches(noDigitsPattern, isDe ? "Position darf keine Zahlen enthalten" : "Position cannot contain numbers")
          .matches(lettersOnlyPattern, isDe ? "Position enthält ungültige Zeichen" : "Position contains invalid characters"),
        company: Yup.string()
          .trim()
          .test(
            "company-chars",
            isDe ? "Firma darf nur Buchstaben, Zahlen und Leerzeichen enthalten" : "Company can only contain letters, numbers, and spaces",
            (value) => {
            if (!value) return true;
            return companyNamePattern.test(value);
          }
          ),
        ownerName: Yup.string().trim().required(isDe ? "Betreuer ist erforderlich" : "Owner is required"),
        email: Yup.string()
          .transform((value) => (typeof value === "string" ? value.trim() : value))
          .required("Email must be a valid email address")
          .test("email-or-empty", "Email must be a valid email address", (value) => {
            const normalized = typeof value === "string" ? value.trim() : "";
            if (!normalized) return false;
            return Yup.string().email().isValidSync(normalized);
          }),
        phone: Yup.string()
          .transform((value) => (typeof value === "string" ? value.trim() : value))
          .required("Phone must contain only digits, spaces, and an optional leading +")
          .test("phone-or-empty", "Phone must contain only digits, spaces, and an optional leading +", (value) => {
            const normalized = typeof value === "string" ? value.trim() : "";
            if (!normalized) return false;
            return /^\+?\d[\d\s]*$/.test(normalized);
          }),
        linkedinUrl: Yup.string()
          .transform((value) => (typeof value === "string" ? value.trim() : value))
          .test("valid-linkedin-url", isDe ? "Ungültige LinkedIn URL" : "Invalid LinkedIn URL", (value) => {
            const normalized = typeof value === "string" ? value.trim() : "";
            if (!normalized) return true;
            return Yup.string().url().isValidSync(normalized) && isValidLinkedInUrl(normalized);
          }),
        birthday: Yup.string().test("valid-date", isDe ? "Ungültiges Datum" : "Invalid date", (value) => {
          if (!value) return true;
          return !Number.isNaN(new Date(value).getTime());
        })
      }),
    [companyNamePattern, isDe]
  );

  const formik = useFormik<Partial<Lead>>({
    initialValues: {
      firstName: "",
      lastName: "",
      currentPosition: "",
      company: "",
      linkedinUrl: "",
      ownerName: "",
      pipelineStage: PipelineStage.IDENTIFIED,
      email: "",
      phone: "",
      birthday: ""
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    }
  });

  const handleEnrich = async () => {
    if (!formik.values.linkedinUrl || !Yup.string().url().isValidSync(formik.values.linkedinUrl) || !formik.values.linkedinUrl.includes("linkedin.com")) {
      setEnrichmentError(
        lang === "de" ? "Bitte geben Sie eine gültige LinkedIn URL ein." : "Please enter a valid LinkedIn URL."
      );
      return;
    }

    setLoading(true);
    setEnrichmentError("");
    try {
      const data = await api.enrichLinkedIn(formik.values.linkedinUrl);
      formik.setValues({ ...formik.values, ...data });
      setStep(2);
    } catch (err) {
      setEnrichmentError(
        lang === "de"
          ? "Enrichment fehlgeschlagen. Bitte manuell ausfüllen."
          : "Enrichment failed. Please fill manually."
      );
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">{t.leadModal.title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Stepper */}
          <div className="flex items-center mb-8">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </div>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.leadModal.linkedinLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Linkedin size={18} />
                  </div>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formik.values.linkedinUrl || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="https://www.linkedin.com/in/nutzername"
                    className="w-full pl-10 pr-4 py-3 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                {enrichmentError && <p className="mt-2 text-xs text-red-500">{enrichmentError}</p>}
                {formik.touched.linkedinUrl && formik.errors.linkedinUrl && (
                  <p className="mt-2 text-xs text-red-500">{formik.errors.linkedinUrl}</p>
                )}
                <p className="mt-2 text-xs text-gray-400">{t.leadModal.helpText}</p>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleEnrich}
                  disabled={loading || !formik.values.linkedinUrl}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Check className="mr-2" size={18} />}
                  {t.leadModal.enrichBtn}
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-white text-gray-600 font-bold py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  {t.leadModal.manualBtn}
                  <ChevronRight className="ml-2" size={18} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-4 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.leadModal.firstName} *
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formik.values.firstName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.leadModal.lastName} *
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formik.values.lastName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.leadModal.position} *
                  </label>
                  <input
                    name="currentPosition"
                    type="text"
                    value={formik.values.currentPosition || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.currentPosition && formik.errors.currentPosition && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.currentPosition}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.leadModal.company}</label>
                  <input
                    name="company"
                    type="text"
                    value={formik.values.company || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.leadModal.owner} *</label>
                <select
                  name="ownerName"
                  value={formik.values.ownerName || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="" disabled>
                    {t.leadModal.selectOwner}
                  </option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
                {formik.touched.ownerName && formik.errors.ownerName && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.ownerName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.leadModal.email}</label>
                  <input
                    name="email"
                    type="email"
                    value={formik.values.email || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.leadModal.phone}</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formik.values.phone || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.phone}</p>
                  )}
                </div>
              </div>

              {/* LinkedIn URL field added to manual step */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  {t.leadModal.linkedinLabel}
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    name="linkedinUrl"
                    type="url"
                    value={formik.values.linkedinUrl || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formik.touched.linkedinUrl && formik.errors.linkedinUrl && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.linkedinUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.leadModal.birthday}</label>
                <input
                  name="birthday"
                  type="date"
                  value={formik.values.birthday || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.birthday && formik.errors.birthday && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.birthday}</p>
                )}
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  {t.leadModal.back}
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  {t.leadModal.save}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
