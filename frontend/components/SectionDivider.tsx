import styles from './SectionDivider.module.css';

const SectionDivider = ({ height = 200 }) => {
   return (
      <div
         className={styles.divider}
         style={{
            height: `${height}px`,
            marginTop: `-${height / 2}px`,
            marginBottom: `-${height / 2}px`
         }}
      >
         <div className={styles.blurLayer} />
         <div className={styles.overlayLayer} />
      </div>
   );
};
export default SectionDivider;
