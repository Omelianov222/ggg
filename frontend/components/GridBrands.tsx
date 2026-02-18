import styles from './GridBrand.module.css'

interface BlockData {
   num: string
   tag: string
   title: string
   description: string
}

const blocks: BlockData[] = [
   {
      num: '02',
      tag: 'Лівий',
      title: 'Лівий\nблок',
      description: 'Зрізаний правий верхній кут — вказує на центр.',
   },
   {
      num: '03',
      tag: 'Центр',
      title: 'Центральний\nблок',
      description: '',
   },
   {
      num: '04',
      tag: 'Правий',
      title: 'Правий\nблок',
      description: 'Зрізаний лівий верхній кут — дзеркало лівого.',
   },
]

const variantClass: Record<number, string> = {
   0: styles.blockLeft,
   1: styles.blockCenter,
   2: styles.blockRight,
}

export default function GridClipPath() {
   return (
      <div className={styles.wrapper}>
         <div className={styles.grid}>

            {/* Верхній блок */}
            <div className={`${styles.block} ${styles.blockTop}`}>
               <span className={styles.num}>01</span>
               <div className={styles.accentLine} />
               <p className={styles.tag}>Головний блок</p>
               <h2 className={`${styles.title} ${styles.titleLarge}`}>
                  Верхній блок<br />на всю ширину
               </h2>
               <p className={styles.desc}>
                  Два нижні кути зрізані через clip-path: polygon().
                  Діагональний зріз під 45° надає формі динаміки.
               </p>
            </div>

            {/* Три нижні блоки */}
            {blocks.map((block, i) => (
               <div
                  key={block.num}
                  className={`${styles.block} ${variantClass[i]}`}
               >
                  <span className={styles.num}>{block.num}</span>
                  <p className={styles.tag}>{block.tag}</p>
                  <h2 className={styles.title}>
                     {block.title.split('\n').map((line, j) => (
                        <span key={j}>{line}{j === 0 && <br />}</span>
                     ))}
                  </h2>
                  <p className={styles.desc}>{block.description}</p>
               </div>
            ))}

         </div>
      </div>
   )
}