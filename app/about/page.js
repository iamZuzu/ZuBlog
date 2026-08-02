import { getAboutContent } from "../../lib/about";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <div className="about-page">
      <div className="about-header">
        {about.photo && (
          <img src={about.photo} alt={about.name} className="about-photo" />
        )}
        <div>
          <h1 className="post-title">{about.name}</h1>
          {about.tagline && <p className="post-meta">{about.tagline}</p>}
        </div>
      </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: about.html }}
      />

      {about.links.length > 0 && (
        <ul className="about-links">
          {about.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer noopener">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
