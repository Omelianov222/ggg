
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
   title: string;
   colorVar?: string;
};

export function SectionHeader({ title, colorVar }: SectionHeaderProps) {
   return (
      <div style={colorVar ? { "--title-color": `var(${colorVar})` } as React.CSSProperties : undefined}>
         <h2 className={styles.title}>{title}</h2>
      </div>
   );
}
