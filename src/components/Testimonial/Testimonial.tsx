// import "./Testimonial.css";
// import img from "./img/image.png"

// const personImage =img

// export default function Testimonial() {
//   return (
//     <section className="ts">
//       <div className="ts__container">
//         {/* LEFT TEXT */}
//         <div className="ts__left">
//           <div className="ts__kicker">
//             <span className="ts__line" />
//             <span>Testimonial</span>
//           </div>

//           <h2 className="ts__title">What They Say?</h2>

//           <p className="ts__p">
//             TOTC has got more than 100k positive ratings from our users around
//             the world.
//           </p>
//           <p className="ts__p">
//             Some of the students and teachers were greatly helped by the
//             Skilline.
//           </p>
//           <p className="ts__p">Are you too? Please give your assessment</p>

//           <button className="ts__btn" type="button">
//             Write your assessment
//             <span className="ts__btnIcon" aria-hidden="true">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                 <path
//                   d="M5 12H19"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M13 6L19 12L13 18"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </span>
//           </button>
//         </div>

//         {/* RIGHT IMAGE + CARD */}
//         <div className="ts__right">
//           <div className="ts__imgWrap">
//             <img className="ts__img" src={personImage} alt="Student" />
//           </div>

//           <button className="ts__arrow" type="button" aria-label="Next">
//             <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//               <path
//                 d="M9 6L15 12L9 18"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>

//           <div className="ts__card">
//             <div className="ts__cardLine" />
//             <p className="ts__quote">
//               "Thank you so much for your help. It's exactly what I've been
//               looking for. You won't regret it. It really saves me time and
//               effort. TOTC is exactly what our business has been lacking."
//             </p>

//             <div className="ts__cardBottom">
//               <div className="ts__name">Gloria Rose</div>
               
//               <div className="ts__rating">
//                 <div className="ts__reviews">12 reviews at Yelp</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


import "./Testimonial.css";
import img from "./img/image.png"

const personImage = img

export default function Testimonial() {
  return (
    <section className="ts">
      <div className="ts__container">
        {/* LEFT TEXT */}
        <div className="ts__left">
          <div className="ts__kicker">
            <span className="ts__line" />
            <span>Testimonial</span>
          </div>

          <h2 className="ts__title">What They Say?</h2>

          <div className="ts__content">
            <p className="ts__p">
              TOTC has got more than 100k positive ratings from our users around
              the world.
            </p>
            <p className="ts__p">
              Some of the students and teachers were greatly helped by the
              Skilline.
            </p>
            <p className="ts__p">Are you too? Please give your assessment</p>
          </div>

          <button className="ts__btn" type="button">
            <span className="ts__btnText">Write your assessment</span>
            <span className="ts__btnIcon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M13 6L19 12L13 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* RIGHT IMAGE + CARD */}
        <div className="ts__right">
          <div className="ts__imageSection">
            <div className="ts__imgWrap">
              <img className="ts__img" src={personImage} alt="Student" />
            </div>

            <button className="ts__arrow" type="button" aria-label="Next testimonial">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="ts__card">
            <div className="ts__cardLine" />
            <p className="ts__quote">
              "Thank you so much for your help. It's exactly what I've been
              looking for. You won't regret it. It really saves me time and
              effort. TOTC is exactly what our business has been lacking."
            </p>

            <div className="ts__cardBottom">
              <div className="ts__authorInfo">
                <div className="ts__name">Gloria Rose</div>
                <div className="ts__rating">
                  <div className="ts__reviews">12 reviews at Yelp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}