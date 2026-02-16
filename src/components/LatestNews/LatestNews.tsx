import "./LatestNews.css";
import image from "./imglen/image.png"
import im1 from "./imglen/im1.png"
import im2 from "./imglen/im2.png"
const mainImage =image
const side1 =im1
const side2 =im2
const side3 =im2

export default function LatestNews() {
  return (
    <section className="ln">
      <div className="ln__container">
        {/* HEADER */}
        <div className="ln__header">
          <h2 className="ln__title">Lastest News and Resources</h2>
          <p className="ln__subtitle">
            See the developments that have occurred to TOTC in the world
          </p>
        </div>

        {/* GRID */}
        <div className="ln__grid">
          {/* LEFT BIG */}
          <div className="ln__main">
            <div className="ln__mainImgWrap">
              <img className="ln__mainImg" src={mainImage} alt="News" />
            </div>

            <span className="ln__pill ln__pill--news">NEWS</span>

            <h3 className="ln__mainTitle">
              Class adds $30 million to its balance sheet for a Zoom-friendly
              edtech solution
            </h3>

            <p className="ln__mainDesc">
              Class, launched less than a year ago by Blackboard co-founder
              Michael Chasen, integrates exclusively...
            </p>

            <button className="ln__readMore" type="button">
              Read more
            </button>
          </div>

          {/* RIGHT LIST */}
          <div className="ln__list">
            {/* item 1 */}
            <article className="ln__item">
              <div className="ln__thumb">
                <img src={side1} alt="Press" />
                <span className="ln__pill ln__pill--press">PRESS RELEASE</span>
              </div>
              <div className="ln__itemText">
                <h4 className="ln__itemTitle">
                  Class Technologies Inc. Closes $30 Million Series A Financing
                  to Meet High Demand
                </h4>
                <p className="ln__itemDesc">
                  Class Technologies Inc., the company that created Class,...
                </p>
              </div>
            </article>

            {/* item 2 */}
            <article className="ln__item">
              <div className="ln__thumb">
                <img src={side2} alt="News" />
                <span className="ln__pill ln__pill--news">NEWS</span>
              </div>
              <div className="ln__itemText">
                <h4 className="ln__itemTitle">
                  Zoom's earliest investors are betting millions on a better
                  Zoom for schools
                </h4>
                <p className="ln__itemDesc">
                  Zoom was never created to be a consumer product. Nonetheless,
                  the...
                </p>
              </div>
            </article>

            {/* item 3 */}
            <article className="ln__item">
              <div className="ln__thumb">
                <img src={side3} alt="News" />
                <span className="ln__pill ln__pill--news">NEWS</span>
              </div>
              <div className="ln__itemText">
                <h4 className="ln__itemTitle">
                  Former Blackboard CEO Raises $16M to Bring LMS Features to
                  Zoom Classrooms
                </h4>
                <p className="ln__itemDesc">
                  This year, investors have reaped big financial returns from
                  betting on Zoom...
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
