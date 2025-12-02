"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage({ error, reset }: { error?: Error; reset?: () => void }) {
   const router = useRouter();
   const [secondsLeft, setSecondsLeft] = useState(10);

   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      intervalRef.current = setInterval(() => {
         setSecondsLeft((s) => s - 1);
      }, 1000);

      timeoutRef.current = setTimeout(() => {
         if (typeof reset === "function") {
            reset();
         }
         router.push("/");
      }, 10000);

      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
   }, [router, reset]);

   const safeReset = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (typeof reset === "function") reset();
   };

   const safeGoHome = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Спочатку скидаємо error boundary
      if (typeof reset === "function") {
         reset();
      }

      // Даємо Next.js завершити reset()
      setTimeout(() => {
         router.replace("/");
      }, 0);
   };


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
            <p style={{ marginBottom: "1rem" }}>
               Через {secondsLeft} сек. буде виконано перенаправлення.
            </p>

            {error && (
               <pre style={{ textAlign: "left", whiteSpace: "pre-wrap", background: "#423838ff", padding: "1rem", borderRadius: 6 }}>
                  {String(error?.message || error)}
               </pre>
            )}

            <div style={{ marginTop: "1rem" }}>
               <button onClick={safeGoHome} style={{ marginRight: 8, padding: "0.5rem 1rem", cursor: "pointer" }}>
                  Перейти зараз
               </button>

               {typeof reset === "function" && (
                  <button onClick={safeReset} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                     Спробувати ще раз
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
