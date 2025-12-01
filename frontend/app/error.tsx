"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage({ error, reset }: { error?: Error; reset?: () => void }) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    // start countdown
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    // redirect after 10 seconds
    const timeout = setTimeout(() => {
      // try to reset error boundary if available, otherwise navigate to root
      if (typeof reset === "function") {
        reset();
      }
      router.push("/");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router, reset]);

  // No extra effect — we'll cap the displayed seconds in render to avoid
  // calling setState synchronously inside an effect.

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ maxWidth: 720, textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "0.5rem" }}>Сталася помилка</h1>
        <p style={{ marginBottom: "1rem" }}>Виникла несподівана помилка. Через {secondsLeft} сек. ви будете перенаправлені на головну сторінку.</p>
        {error && (
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap", background: "#f7f7f7", padding: "1rem", borderRadius: 6 }}>{String(error?.message || error)}</pre>
        )}
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => router.push("/")}
            style={{ marginRight: 8, padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Перейти зараз
          </button>
          {typeof reset === "function" && (
            <button
              onClick={() => {
                reset();
              }}
              style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
            >
              Спробувати ще раз
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
