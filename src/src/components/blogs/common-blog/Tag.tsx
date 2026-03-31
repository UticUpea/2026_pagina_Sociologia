/* NO LO USAMOS */
import Link from "next/link";

const tags: string[] = ["Creative", "Article", "Designer", "Portfolio", "Project", "Personal", "Landing"];
const Tag = () => {
  return (
    <div className="widget widget_tags mb-0">
      {/* <h4 className="widget-title">Tags</h4>
      <div className="tagcloud">
        {tags.map((tag, i) => (
          <Link key={i} href="#">{tag}</Link>
        ))}
      </div> */}
    </div>
  )
}

export default Tag
