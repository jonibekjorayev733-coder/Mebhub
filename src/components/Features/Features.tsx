import "./Features.css";
import image from "./userimg/image.png"
import im3 from "./userimg/im3.png"
import im1 from "./userimg/im1.png"


const images: string[] = [
  image,
  im1,
  im3,
  im3,
  im3

];

export default function Features() {
  return (
    <section className="features">
      <div className="features__top">
        <h2>
          Our <span>Features</span>
        </h2>
        <p>
          This very extraordinary feature, can make learning activities more
          efficient
        </p>
      </div>

      {/* CONTENT */}
      <div className="features__content">
        <div className="mockup">
          {/* decorations */}
          <span className="dot green" />
          <span className="dot blue" />
          <span className="dot red" />
          <span className="ring" />

          <div className="mockup__window">
            <div className="mockup__topbar">
              <span />
              <span />
              <span />
            </div>

            <div className="mockup__grid">
              <div className="mockup__col main">
                <img src={images[0]} alt="" />
                <div className="actions">
                  <button className="present">Present</button>
                  <button className="call">Call</button>
                </div>
              </div>

              <div className="mockup__col">
                <img src={images[1]} alt="" />
                <img src={images[2]} alt="" />
              </div>

              <div className="mockup__col">
                <img src={images[3]} alt="" />
                <img src={images[4]} alt=""/>

              </div>
            </div>

            <div className="knob" />
          </div>
        </div>

        <div  className="features__text">
          <h3>
            A <span>user interface</span> designed <br /> for the classroom
          </h3>

          <ul>
            <li>
              <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="11.8182" height="11.8182" rx="2" fill="#2F327D"/>
<rect y="14.1819" width="11.8182" height="11.8182" rx="2" fill="#2F327D"/>
<rect x="14.7734" width="11.8182" height="11.8182" rx="2" fill="#2F327D"/>
<rect x="14.7734" y="14.1819" width="11.8182" height="11.8182" rx="2" fill="#F48C06"/>
</svg>

              Teachers don’t get lost in the grid view and have a dedicated
              Podium space.
            </li>
            <li>
              <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="8" y="6" width="20" height="20" rx="2" fill="#2F327D"/>
<rect width="21.2245" height="21.2245" rx="2" fill="#F48C06"/>
</svg>

              TA’s and presenters can be moved to the front of the class.
            </li>
            <li>
              <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 11.375C6.15469 11.375 7.5 9.91758 7.5 8.125C7.5 6.33242 6.15469 4.875 4.5 4.875C2.84531 4.875 1.5 6.33242 1.5 8.125C1.5 9.91758 2.84531 11.375 4.5 11.375ZM25.5 11.375C27.1547 11.375 28.5 9.91758 28.5 8.125C28.5 6.33242 27.1547 4.875 25.5 4.875C23.8453 4.875 22.5 6.33242 22.5 8.125C22.5 9.91758 23.8453 11.375 25.5 11.375ZM27 13H24C23.175 13 22.4297 13.3605 21.8859 13.9445C23.775 15.0668 25.1156 17.093 25.4062 19.5H28.5C29.3297 19.5 30 18.7738 30 17.875V16.25C30 14.4574 28.6547 13 27 13ZM15 13C17.9016 13 20.25 10.4559 20.25 7.3125C20.25 4.16914 17.9016 1.625 15 1.625C12.0984 1.625 9.75 4.16914 9.75 7.3125C9.75 10.4559 12.0984 13 15 13ZM18.6 14.625H18.2109C17.2359 15.1328 16.1531 15.4375 15 15.4375C13.8469 15.4375 12.7688 15.1328 11.7891 14.625H11.4C8.41875 14.625 6 17.2453 6 20.475V21.9375C6 23.2832 7.00781 24.375 8.25 24.375H21.75C22.9922 24.375 24 23.2832 24 21.9375V20.475C24 17.2453 21.5812 14.625 18.6 14.625ZM8.11406 13.9445C7.57031 13.3605 6.825 13 6 13H3C1.34531 13 0 14.4574 0 16.25V17.875C0 18.7738 0.670312 19.5 1.5 19.5H4.58906C4.88438 17.093 6.225 15.0668 8.11406 13.9445Z" fill="#2F327D"/>
</svg>
              Teachers can easily see all students and class data at one time.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
