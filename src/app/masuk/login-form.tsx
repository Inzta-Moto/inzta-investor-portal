"use client";

import { useActionState, useState } from "react";

import { AlertIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

import { signIn, type SignInState } from "./actions";

const INITIAL: SignInState = { error: null, username: "" };

export function LoginForm({ configError }: { configError: string | null }) {
  const [state, action, pending] = useActionState(signIn, INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const error = configError ?? state.error;

  return (
    <form action={action} className="grid gap-3.5" noValidate>
      <div className="grid gap-1.5">
        <label htmlFor="username" className="text-[13px] font-semibold text-ink-2">
          Username
        </label>
        <input
          id="username"
          name="username"
          defaultValue={state.username}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="Username dari admin Inzta"
          aria-invalid={error ? true : undefined}
          className="min-h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-base text-ink placeholder:text-ink-3 focus:border-ink"
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="password" className="text-[13px] font-semibold text-ink-2">
          Kata sandi
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            className="min-h-12 w-full rounded-[10px] border border-line-strong bg-surface pr-12 pl-3.5 text-base text-ink focus:border-ink"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-ink-3 hover:text-ink"
          >
            {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
          </button>
        </div>
      </div>
      {error ? (
        <p id="login-error" role="alert" className="flex items-start gap-1.5 text-[13px] text-bad">
          <AlertIcon className="mt-px size-4" />
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending || configError !== null}
        className="mt-1 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-solid px-5 text-[15px] font-bold text-on-solid hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
