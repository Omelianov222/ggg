
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
   title: string;
};

export function PageHeader({ title }: PageHeaderProps) {
   return (
      <div >
         <h1 className={styles.title}>{title}</h1>
      </div>
   );
}
