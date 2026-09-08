/* Desert Botanical Editorial direction: a lost-path wayfinding moment using limestone, Oasis Green, terracotta, and calm garden language. */
import { ArrowUpRight, Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-topline"><span>DESERT BLOOMS · KUWAIT</span><span>FIELD NOTE / 404</span></div>
      <section className="not-found-content">
        <div className="not-found-mark"><Leaf size={21} strokeWidth={1.4} /></div>
        <p className="eyebrow"><span className="eyebrow-line" /> A path worth retracing</p>
        <h1>This path hasn’t<br /><i>grown here.</i></h1>
        <p className="not-found-copy">The page you’re looking for has wandered off the garden map. Let’s take you back to the beginning.</p>
        <a className="button button-dark" href="/">Return to the garden <ArrowUpRight size={17} /></a>
      </section>
      <div className="not-found-footer"><span>LANDSCAPING & AGRICULTURAL CARE</span><span>AL SHARQ · KUWAIT</span></div>
    </main>
  );
}
