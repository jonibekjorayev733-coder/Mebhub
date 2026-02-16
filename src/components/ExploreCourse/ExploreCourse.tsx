// src/components/ExploreCourse/ExploreCourse.tsx
import "./ExploreCourse.css";

const courseChips = [
  { label: "Ut Sed Eros", color: "chip--orange" },
  { label: "Curabitur Egestas", color: "chip--red" },
  { label: "Quisque Conseq", color: "chip--brown" },
  { label: "Cras Convallis", color: "chip--yellow" },
  { label: "Vestibulum Facili", color: "chip--purple" },
  { label: "Ut Sed Eros", color: "chip--blue" },
  { label: "Vestibulum Facili", color: "chip--mint"  },
  
];

const chipTilt = -10.02;

export default function ExploreCourse() {
  return (
    <section className="ec">
      <div className="ec__container">
        {/* TOP */}
        <div className="ec__top">
          <div>
            <h2 className="ec__title">Explore Course</h2>
            <p className="ec__subtitle">Ut sed eros finibus, placerat orci id, dapibus.</p>
          </div>

         
        </div>

        {/* TAG ROW */}
        <div className="ec__tag">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3C7.58 3 4 6.58 4 11C4 15.42 7.58 19 12 19C16.42 19 20 15.42 20 11C20 6.58 16.42 3 12 3Z"
              fill="#7d8499"
            />
            <circle cx="9" cy="9" r="1.5" fill="#f5f7fb" />
            <circle cx="14.5" cy="8" r="1.3" fill="#f5f7fb" />
            <circle cx="15.5" cy="12.5" r="1.3" fill="#f5f7fb" />
            <circle cx="10.5" cy="13.5" r="1.3" fill="#f5f7fb" />
          </svg>
          <p>LOREM IPSUM</p>
          <div className="inp">
             <button className="ec__seeAll" type="button">
            SEE ALL
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" stroke="#00a8c9" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M13 6L19 12L13 18"
                stroke="#00a8c9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="ec__content">
          <div className="ec__underline" />

          <div className="ec__row">
            {/* CHIPS */}
            <div className="ec__chips">
              {courseChips.map((chip, index) => (
                <div
                  key={`${chip.label}-${index}`}
                  className="ec-chip"
                  style={{
                    transform: `rotate(${chipTilt}deg)`,
                  }}
                >
                  <div className="ec-chip__innerBg" />
                  <div className={`ec-chip__color ${chip.color}`} />
                  <div className="ec-chip__label">
                    <span>{chip.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* BIG CARD */}
            <article className="ec-card">
              <div className="ec-card__body">
                <div className="ec-card__imgWrap">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
                    alt="Food"
                  />
                  <div className="ec-card__badge">
                    <div>
                      <h1>LOREM IPSUM</h1>
                    <p>LOREM ipsum  dolor sit amet</p>
                    </div>
                  </div>
                </div>

                <div className="ec-card__info">
                  <h3 className="ec-card__title">Integer id Orc Sed Ante Tincidunt</h3>

                  <p className="ec-card__desc">
                    Cras convallis lacus orci, tristique tincidunt magna fringilla at faucibus vel.
                  </p>

                  <div className="ec-card__meta">
                    <div className="ec-card__price">$ 450</div>
                  </div>

                  <button className="ec-card__btn" type="button">
                    EXPLORE
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
        {/* keyingi */}
        <div className="ec__content">
          <div className="ec__underline" />
 <div className="ec__tag">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M15.3101 0C6.85453 0 0 6.86944 0 15.3433C0 23.8171 6.85453 30.6866 15.3101 30.6866C23.7657 30.6866 30.6203 23.8171 30.6203 15.3433C30.6203 6.86944 23.7657 0 15.3101 0ZM13.724 28.3997C10.8192 28.0511 8.13153 26.748 6.03073 24.6427C3.5521 22.1587 2.18714 18.8562 2.18714 15.3433C2.18714 12.1809 3.29389 9.18944 5.32285 6.8116C5.37511 7.43987 5.50414 8.11342 5.4711 8.59489C5.35038 10.3501 5.17755 11.4487 6.20274 12.9295C6.60213 13.5063 6.70025 14.3331 6.89464 15.0007C7.08477 15.6538 7.84432 15.9964 8.36817 16.3988C9.42509 17.2109 10.4362 18.1548 11.557 18.8695C12.2966 19.3412 12.7587 19.5759 12.542 20.4805C12.3678 21.208 12.3191 21.6561 11.9436 22.3042C11.829 22.5019 12.3762 23.7735 12.5583 23.9559C13.1102 24.509 13.6578 25.0163 14.2594 25.5142C15.1921 26.2865 14.1688 27.2899 13.724 28.3997ZM24.5895 24.6427C22.7027 26.5335 20.3425 27.7767 17.7768 28.2632C18.1404 27.3621 18.7878 26.5614 19.3884 26.0973C19.9108 25.6934 20.5651 24.9164 20.8379 24.3009C21.1106 23.6863 21.4717 23.1535 21.8373 22.5883C22.3573 21.7844 20.5551 20.5719 19.9711 20.3177C18.657 19.746 17.6677 18.9745 16.4998 18.1509C15.6677 17.5641 13.9782 18.4573 13.0388 18.0464C11.7521 17.4833 10.692 16.5049 9.57355 15.6608C8.4194 14.7897 8.4752 13.7742 8.4752 12.4891C9.37923 12.5225 10.6653 12.2384 11.2655 12.967C11.4549 13.1969 12.1061 14.2241 12.542 13.8591C12.8981 13.5609 12.2781 12.3654 12.1583 12.0844C11.7899 11.2202 12.9977 10.8832 13.6159 10.2972C14.4227 9.53267 16.1532 8.33369 16.0164 7.78568C15.8796 7.23768 14.2849 5.68505 13.3482 5.9273C13.2079 5.96359 11.972 7.26224 11.7332 7.46598C11.7396 7.04212 11.7459 6.61834 11.7524 6.19448C11.7564 5.92686 11.2542 5.65215 11.2775 5.47954C11.3364 5.04329 12.5481 4.25156 12.8496 3.90413C12.6384 3.77186 11.9178 3.15157 11.6997 3.2426C11.1716 3.46315 10.5753 3.61511 10.0472 3.8356C10.0472 3.65207 10.025 3.47968 9.99848 3.30943C11.0566 2.83991 12.1763 2.51342 13.3336 2.33926L14.3703 2.75677L15.1022 3.62728L15.8327 4.38213L16.4712 4.5883L17.4854 3.62972L17.2239 2.94539V2.33026C19.2297 2.62223 21.1239 3.37213 22.7828 4.52848C22.486 4.55511 22.1599 4.59885 21.7919 4.64577C21.6399 4.55577 21.445 4.51491 21.2793 4.45228C21.76 5.4881 22.2614 6.50961 22.7708 7.53171C23.315 8.62351 24.5221 9.79462 24.7341 10.9471C24.9839 12.3056 24.8106 13.5396 24.9473 15.1378C25.0789 16.677 26.6788 18.4257 26.6788 18.4257C26.6788 18.4257 27.4176 18.6779 28.032 18.5901C27.4593 20.8608 26.2851 22.9433 24.5895 24.6427Z" fill="black" fillOpacity="0.54"/>
</svg>

          <p>Quisque a Consequat</p>
          <div className="inp">
             <button className="ec__seeAll" type="button">
            SEE ALL
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" stroke="#00a8c9" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M13 6L19 12L13 18"
                stroke="#00a8c9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          </div>
        </div>
          <div className="ec__row">
            {/* CHIPS */}
            <div className="ec__chips">
              {courseChips.map((chip, index) => (
                <div
                  key={`${chip.label}-${index}`}
                  className="ec-chip"
                  style={{
                    transform: `rotate(${chipTilt}deg)`,
                  }}
                >
                  <div className="ec-chip__innerBg" />
                  <div className={`ec-chip__color ${chip.color}`} />
                  <div className="ec-chip__label">
                    <span>{chip.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* BIG CARD */}
            <article className="ec-card2">
              <div className="ec-card__body">
                <div className="ec-card__imgWrap">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
                    alt="Food"
                  />
                  <div className="ec-card__badge">
                    <div>
                      <h1>LOREM IPSUM</h1>
                    <p>LOREM ipsum  dolor sit amet</p>
                    </div>
                  </div>
                </div>

                <div className="ec-card__info">
                  <h3 className="ec-card__title">Integer id Orc Sed Ante Tincidunt</h3>

                  <p className="ec-card__desc">
                    Cras convallis lacus orci, tristique tincidunt magna fringilla at faucibus vel.
                  </p>

                  <div className="ec-card__meta">
                    <div className="ec-card__price">$ 450</div>
                  </div>

                  <button className="ec-card__btn" type="button">
                    EXPLORE
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
        {/* keyingi */}
        <div className="ec__content">
          <div className="ec__underline" />
 <div className="ec__tag">
          <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M11.8305 2.52441C8.84068 2.52441 6.4082 5.01587 6.4082 8.07823C6.4082 11.1406 8.84068 13.632 11.8305 13.632C14.8204 13.632 17.2529 11.1406 17.2529 8.07823C17.2529 5.01587 14.8204 2.52441 11.8305 2.52441Z" fill="black" fillOpacity="0.54"/>
<path fillRule="evenodd" clipRule="evenodd" d="M11.8304 0C7.47454 0 3.94336 3.6168 3.94336 8.07828C3.94336 12.5398 7.47454 16.1566 11.8304 16.1566C16.1863 16.1566 19.7174 12.5398 19.7174 8.07828C19.7174 3.6168 16.1863 0 11.8304 0ZM11.8304 14.137C8.56344 14.137 5.91512 11.4245 5.91512 8.07828C5.91512 4.73211 8.56344 2.01957 11.8304 2.01957C15.0974 2.01957 17.7457 4.73211 17.7457 8.07828C17.7457 11.4245 15.0974 14.137 11.8304 14.137Z" fill="black" fillOpacity="0.54"/>
<path fillRule="evenodd" clipRule="evenodd" d="M5.11993 14.0244L0 23.2254H5.91528L8.87293 28.2744L11.8306 21.5967L13.9034 16.9168C13.2384 17.0798 12.5444 17.1667 11.8306 17.1667C9.1499 17.1667 6.74694 15.9491 5.11993 14.0244Z" fill="black" fillOpacity="0.54"/>
<path fillRule="evenodd" clipRule="evenodd" d="M18.5408 14.0244C17.6118 15.1233 16.4298 15.9917 15.0876 16.5346L12.3301 22.7254L14.7878 28.2743L17.7455 23.2254H23.6607L18.5408 14.0244Z" fill="black" fillOpacity="0.54"/>
</svg>

          <p>LOREM IPSUM</p>
          <div className="inp">
             <button className="ec__seeAll" type="button">
            SEE ALL
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" stroke="#00a8c9" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M13 6L19 12L13 18"
                stroke="#00a8c9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          </div>
        </div>
          <div className="ec__row">
            {/* CHIPS */}
            <div className="ec__chips">
              {courseChips.map((chip, index) => (
                <div
                  key={`${chip.label}-${index}`}
                  className="ec-chip"
                  style={{
                    transform: `rotate(${chipTilt}deg)`,
                  }}
                >
                  <div className="ec-chip__innerBg" />
                  <div className={`ec-chip__color ${chip.color}`} />
                  <div className="ec-chip__label">
                    <span>{chip.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* BIG CARD */}
            <article className="ec-card3">
              <div className="ec-card__body">
                <div className="ec-card__imgWrap">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
                    alt="Food"
                  />
                  <div className="ec-card__badge">
                    <div>
                      <h1>LOREM IPSUM</h1>
                    <p>LOREM ipsum  dolor sit amet</p>
                    </div>
                  </div>
                </div>

                <div className="ec-card__info">
                  <h3 className="ec-card__title">Integer id Orc Sed Ante Tincidunt</h3>

                  <p className="ec-card__desc">
                    Cras convallis lacus orci, tristique tincidunt magna fringilla at faucibus vel.
                  </p>

                  <div className="ec-card__meta">
                    <div className="ec-card__price">$ 450</div>
                  </div>

                  <button className="ec-card__btn" type="button">
                    EXPLORE
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
