export default function NewsList({ items }: { items: any[] }) {
   return (
      <div>
         {items.map(item => {
            const attrs = item.attributes;
            return (
               <article key={item.id}>
                  <h2>{attrs.title}</h2>
               </article>
            );
         })}
      </div>
   );
}
