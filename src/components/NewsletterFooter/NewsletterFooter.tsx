import "./NewsletterFooter.css";
// import iconImage from "./image.png";

export default function NewsletterFooter() {
  return (
    <section className="nf">
      <div className="nf__container">
        {/* TOP */}
        <div className="nf__brand">
          <div className="nf__logoWrap">
            {/* <img src={iconImage} alt="Logo" className="nf__logo" /> */}
            <div className="nf__divider" />
          </div>
          <span className="nf__brandText">Virtual Class for Zoom</span>
        </div>

        {/* TITLE */}
        <h3 className="nf__title">Subscribe to get our Newsletter</h3>

        {/* FORM */}
        <div className="nf__form">
          <input
            type="email"
            className="nf__input"
            placeholder="Your Email"
          />
          <button className="nf__btn" type="button">
            Subscribe
          </button>
        </div>

        {/* LINKS */}
        <div className="nf__links">
          <span>Careers</span>
          <span className="nf__sep">|</span>
          <span>Privacy Policy</span>
          <span className="nf__sep">|</span>
          <span>Terms &amp; Conditions</span>
        </div>

        {/* COPYRIGHT */}
        <div className="nf__copy">
          (c) 2021 Class Technologies Inc.
        </div>
      </div>
    </section>
  );
}
