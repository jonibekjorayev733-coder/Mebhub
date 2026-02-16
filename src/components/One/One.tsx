
import "./One.css";
import userimg from "../Features/userimg/image.png"
import im1 from "../Features/userimg/im1.png"


const imgLeft =
userimg
const imgRight =
im1

export default function OneOnOne() {
  return (
    <section className="o1">
      <div className="o1__container">
        {/* LEFT SIDE */}
        <div className="o1__left">
          {/* back window */}
          <div className="o1-back">
            <div className="o1-back__dots">
              <span />
              <span />
              <span />
            </div>
            <div className="o1-back__blurbar" />
          </div>

          {/* top ring */}
          <span className="o1-ring" />

          {/* tiny triangle */}
          <span className="o1-triangle" />

          {/* front card */}
          <div className="o1-card">
            <div className="o1-card__dots">
              <span className="d red" />
              <span className="d yellow" />
              <span className="d green" />
            </div>

            <div className="o1-grid">
              <div className="o1-img">
                <img src={imgLeft} alt="Participant" />
              </div>

              <div className="o1-img">
                <img src={imgRight} alt="Participant" />
                <div className="o1-name">Patricia Mendoza</div>
              </div>
            </div>

            <div className="o1-bottom">
              <div className="o1-info">
                <div className="o1-info__title">Private Discussion</div>
                <div className="o1-info__sub">
                  Your video can’t be seen by others
                </div>
              </div>

              <button className="o1-end" type="button">
                End Discussion
              </button>
            </div>
          </div>

          {/* left floating user icon */}
          <div className="o1-float">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2f7bf4"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Z" />
              <path d="M7 11c1.7 0 3-1.3 3-3S8.7 5 7 5 4 6.3 4 8s1.3 3 3 3Z" />
              <path d="M3 20c0-2.5 2.6-4.5 5.8-4.5 1.1 0 2.1.2 3 .5" />
              <path d="M13 20c.3-2.2 2.5-4 5.2-4 2.9 0 5.3 1.9 5.3 4" />
            </svg>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="o1__right">
          <h2 className="o1__title">
            One-on-One <br />
            <span>Discussions</span>
          </h2>
          <p className="o1__desc">
            Teachers and teacher assistants can talk with students privately
            without leaving the Zoom environment.
          </p>
        </div>

        {/* FOOTER */}
        <div className="o1__footer">
          <button className="o1-more" type="button">
            See more features
          </button>
        </div>
      </div>
    </section>
  );
}
