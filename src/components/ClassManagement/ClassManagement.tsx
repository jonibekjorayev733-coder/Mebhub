// src/components/ClassManagement/ClassManagement.tsx
import "./ClassManagement.css";

const avatars = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
];

export default function ClassManagement() {
  return (
    <section className="cm">
      <div className="cm__container">
        {/* LEFT TEXT */}
        <div className="cm__text">
          <h2 className="cm__title">
            <span>Class Management</span>
            <br />
            Tools for Educators
          </h2>

          <p className="cm__desc">
            Class provides tools to help run and manage the class such as Class Roster,
            Attendance, and more. With the Gradebook, teachers can review and grade tests
            and quizzes in real-time.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="cm__right">
          {/* decorations */}
          <span className="cm__dot cm__dot--big" />
          <span className="cm__dot cm__dot--small1" />
          <span className="cm__dot cm__dot--small2" />

          <div className="cm-card">
            {/* header */}
            <div className="cm-card__header">
              <span className="cm-card__badge">
                <svg width="92" height="93" viewBox="0 0 92 93" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_10_751)">
<path d="M41.4536 20.0001L53.8333 33.0183L71.8073 32.6785L63.2353 48.4595L69.1133 65.4262L51.4358 62.1611L37.0945 72.9869L34.7412 55.188L19.9999 44.9121L36.223 37.1768L41.4536 20.0001Z" fill="#F9BB1C"/>
</g>
<defs>
<filter id="filter0_d_10_751" x="0" y="0" width="91.8076" height="92.9868" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="10"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.976471 0 0 0 0 0.733333 0 0 0 0 0.109804 0 0 0 0.3 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10_751"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10_751" result="shape"/>
</filter>
</defs>
</svg>

              </span>

              <span className="cm-card__headerTitle">GradeBook</span>

              <span className="cm-card__badge">
                <svg width="42" height="51" viewBox="0 0 42 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39.7726 7.17037L15.9427 1.34444C12.9104 0.603105 9.83956 2.46363 9.09724 5.49192L1.46861 36.6128C0.658816 39.9164 2.6912 43.262 5.99914 44.0707L29.3292 49.7744C30.0655 49.9544 30.8084 49.5042 30.9887 48.7689C31.1689 48.0337 30.7182 47.2916 29.9819 47.1116L6.65186 41.4079C4.81412 40.9586 3.68501 39.1 4.1349 37.2647C4.58478 35.4294 6.44592 34.3018 8.28365 34.7511L31.6137 40.4548C32.35 40.6348 33.0929 40.1846 33.2732 39.4493L40.7794 8.82767C40.9596 8.09241 40.5089 7.35038 39.7726 7.17037ZM5.53353 31.559L11.7635 6.14378C12.1465 4.58124 13.7254 3.62468 15.29 4.00719L15.3733 4.02757C15.6033 4.08381 15.7442 4.31573 15.6879 4.54547L9.03501 31.6859C8.98167 31.9035 8.76905 32.0456 8.54826 32.0064C7.69485 31.8545 6.84544 31.8876 6.04431 32.0786C5.73451 32.1525 5.45781 31.8679 5.53353 31.559Z" fill="#3491E7"/>
<path d="M31.1242 42.4515L7.79419 36.7478C7.05788 36.5678 6.31492 37.018 6.13469 37.7532C5.95446 38.4885 6.40516 39.2305 7.14147 39.4105L30.4715 45.1142C31.2078 45.2943 31.9508 44.8441 32.131 44.1088C32.3112 43.3735 31.8605 42.6315 31.1242 42.4515Z" fill="#3491E7"/>
</svg>

              </span>
            </div>

            {/* bars */}
            <div className="cm-bars">
              <div className="cm-bar cm-bar--cyan">
                <div className="cm-bar__float cm-bar__float--p25">
                  <img src={avatars[0]} alt="Student" />
                  <span className="cm-score cm-score--blue">100</span>
                </div>
              </div>

              <div className="cm-bar cm-bar--blue">
                <div className="cm-bar__float cm-bar__float--p55">
                  <img src={avatars[1]} alt="Student" />
                  <span className="cm-score cm-score--blue2">98</span>
                </div>
              </div>

              <div className="cm-bar cm-bar--green">
                <div className="cm-bar__float cm-bar__float--p40">
                  <img src={avatars[2]} alt="Student" />
                  <span className="cm-score cm-score--green">75</span>
                </div>
              </div>

              <div className="cm-bar cm-bar--red">
                <div className="cm-bar__float cm-bar__float--right10">
                  <img src={avatars[0]} alt="Student" />
                  <span className="cm-score cm-score--red">85</span>
                </div>
              </div>
            </div>

            {/* button */}
            <div className="cm-card__footer">
              <button className="cm-export" type="button">
                Export
              </button>
            </div>
          </div>

          {/* bottom decorations */}
          <span className="cm__square" />
          <span className="cm__ring" />
        </div>
      </div>
    </section>
  );
}
