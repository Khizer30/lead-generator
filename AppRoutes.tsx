import React, { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useSearchParams } from "react-router-dom";

import App from "./App";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import {
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
  verifyAccount
} from "./store/actions/authActions";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { clearAuthMessages } from "./store/slices/authSlice";

const SignInRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const signedOut = searchParams.get("signedOut") === "1";
  const verifySent = searchParams.get("verifySent") === "1";
  const verifyFlag = searchParams.get("verify") === "true";
  const verifiedFlag = searchParams.get("verified") === "1";
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";
  const hasVerificationParams = Boolean(email && code);
  const hasTriggeredVerification = useRef(false);
  const { signInStatus, verifyStatus, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  useEffect(() => {
    if (!verifyFlag) return;
    navigate("/sign-in?verified=1", { replace: true });
  }, [navigate, verifyFlag]);

  useEffect(() => {
    if (!hasVerificationParams || hasTriggeredVerification.current) return;
    hasTriggeredVerification.current = true;
    dispatch(verifyAccount({ email, code }));
  }, [code, dispatch, email, hasVerificationParams]);

  useEffect(() => {
    if (!hasVerificationParams) return;
    if (verifyStatus !== "succeeded") return;
    navigate("/sign-in?verified=1", { replace: true });
  }, [hasVerificationParams, navigate, verifyStatus]);

  return (
    <SignInPage
      onSubmit={(data) => dispatch(signIn(data))}
      onSwitchToSignUp={() => navigate("/sign-up")}
      onForgotPassword={() => navigate("/forgot-password")}
      isLoading={signInStatus === "loading" || (hasVerificationParams && verifyStatus === "loading")}
      errorMessage={error}
      successMessage={
        signedOut
          ? "You have been signed out successfully."
          : verifiedFlag || verifyFlag
            ? "Account verified successfully. You can sign in now."
          : verifySent
            ? "Verification email sent. Please check your inbox and then sign in."
            : null
      }
    />
  );
};

const SignUpRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";
  const hasVerificationParams = Boolean(email && code);
  const hasTriggeredVerification = useRef(false);

  const { signUpStatus, verifyStatus, signUpMessage, verifyMessage, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  useEffect(() => {
    if (!hasVerificationParams || hasTriggeredVerification.current) return;
    hasTriggeredVerification.current = true;
    dispatch(verifyAccount({ email, code }));
  }, [code, dispatch, email, hasVerificationParams]);

  useEffect(() => {
    if (signUpStatus !== "succeeded") return;
    navigate("/sign-in?verifySent=1", { replace: true });
  }, [navigate, signUpStatus]);

  const computedSuccessMessage = verifyMessage || signUpMessage;
  const isLoading = signUpStatus === "loading" || verifyStatus === "loading";

  return (
    <SignUpPage
      onSubmit={(data) => dispatch(signUp(data))}
      onSwitchToSignIn={() => navigate("/sign-in")}
      isLoading={isLoading}
      errorMessage={error}
      successMessage={computedSuccessMessage}
    />
  );
};

const ForgotPasswordRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const hasResetParams = Boolean(email && code);

  const { forgotStatus, forgotMessage, resetStatus, resetMessage, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  if (hasResetParams) {
    return (
      <ResetPasswordPage
        emailFromUrl={email}
        codeFromUrl={code}
        onSubmit={(data) => dispatch(resetPassword(data))}
        onBackToSignIn={() => navigate("/sign-in")}
        isLoading={resetStatus === "loading"}
        successMessage={resetStatus === "succeeded" ? resetMessage : null}
        errorMessage={error}
      />
    );
  }

  return (
    <ForgotPasswordPage
      onSubmit={(data) => dispatch(forgotPassword(data))}
      onBackToSignIn={() => navigate("/sign-in")}
      isLoading={forgotStatus === "loading"}
      isSubmitted={forgotStatus === "succeeded"}
      successMessage={forgotMessage}
      errorMessage={error}
    />
  );
};

const ResetPasswordRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const { resetStatus, resetMessage, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  return (
    <ResetPasswordPage
      emailFromUrl={email}
      codeFromUrl={code}
      onSubmit={(data) => dispatch(resetPassword(data))}
      onBackToSignIn={() => navigate("/sign-in")}
      isLoading={resetStatus === "loading"}
      successMessage={resetStatus === "succeeded" ? resetMessage : null}
      errorMessage={error}
    />
  );
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/sign-in" element={<SignInRoute />} />
          <Route path="/signin" element={<SignInRoute />} />
          <Route path="/login" element={<SignInRoute />} />
          <Route path="/sign-up" element={<SignUpRoute />} />
          <Route path="/signup" element={<SignUpRoute />} />
          <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
          <Route path="/reset-password" element={<ResetPasswordRoute />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />} />
        </Route>

        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
