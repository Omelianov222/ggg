
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
   title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
   return (
      <div >
         <h2 className={styles.title}>{title}</h2>
      </div>
   );
}
