import React from "react";

type AuthInputProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
};

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  touched
}) => {
  const hasError = Boolean(error && touched);

  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-gray-50/70 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
          hasError ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-blue-500"
        }`}
        required
      />
      {hasError && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AuthInput;
