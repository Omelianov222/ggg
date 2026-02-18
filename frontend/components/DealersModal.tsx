"use client";

import React from "react";
import styles from './Dealers-modal.module.css';

type Contact = { name: string; phone?: string; email?: string };

export default function DealersModal({
   open,
   onClose,
   country,
   region,
   contacts,
}: {
   open: boolean;
   onClose: () => void;
   country?: string;
   region?: string;
   contacts?: Contact[];
}) {
   if (!open) return null;

   return (
      <div className={styles.dmRoot}>
         <div className={styles.dmBackdrop} onClick={onClose}></div>
         <div className={styles.dmPanel}>
            <div className={styles.dmHeader}>
               <div>
                  <div className={styles.dmTitle}>{country}</div>
                  <div className={styles.dmRegion}>{region}</div>
               </div>
               <button className={styles.dmCloseBtn} onClick={onClose} aria-label="Close">
                  ✕
               </button>
            </div>

            <div className={styles.dmBody}>
               <div className={styles.dmContacts}>
                  {contacts && contacts.length > 0 ? (
                     contacts.map((c, i) => (
                        <div key={i} className={styles.dmCard}>
                           <div className={styles.dmAvatar}>👤</div>
                           <div>
                              <div className={styles.dmName}>{c.name}</div>
                              <div className={styles.dmPhone}>{c.phone}</div>
                              <div className={styles.dmEmail}>{c.email}</div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div style={{ color: 'var(--dm-sub)' }}>No dealers listed for this location.</div>
                  )}
               </div>
            </div>

            <div className={styles.dmFooter}>
               <button className={styles.dmCloseAction} onClick={onClose}>Close</button>
            </div>
         </div>
      </div>
   );
}
