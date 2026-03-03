
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
   title: string;
   colorVar?: string;
};

export function PageHeader({ title, colorVar }: PageHeaderProps) {
   return (
      <div style={colorVar ? { "--title-color": `var(${colorVar})` } as React.CSSProperties : undefined}>
         <h1 className={styles.title}>{title}</h1>
      </div>
   );
}
