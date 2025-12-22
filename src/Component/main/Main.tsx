
import { useState, useEffect } from "react"
import { SlArrowLeft } from "react-icons/sl";
import "./mainad.css"
import { SlArrowRight } from "react-icons/sl";
import img1 from "../imgs/image copy.png"
import img2 from "../imgs/image copy 11.png"

const slides = [
  {
    title: "All You Need For Perfect Breakfast",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500",
    img: img1,
  },
  {
    title: "Fresh Vegetables Everyday",
    desc: "Healthy and organic vegetables for your family. Eat fresh, stay healthy, and enjoy your meals!",
    img: img2,
  },
]

export default function Main() {
  const [index, setIndex] = useState(0)

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)

  useEffect(() => {
    const timer = setInterval(nextSlide, 2000) // 2 sekundda avtomatik o‘zgaradi
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="main">
        <button className="arrow left" onClick={prevSlide}><SlArrowLeft /></button>
        <div className="last">
          <h1>{slides[index].title}</h1>
          <p>{slides[index].desc}</p>
          <div className="buttons">
            <button>Buy Now</button>
            <button>See More</button>
          </div>
        </div>
        <img src={slides[index].img} alt="" />
        <button className="arrow right" onClick={nextSlide}><SlArrowRight /></button>
      </div>

      <div className="mainbuttons">
        <div>
          <button>
            <img src={img2} alt="" />
          </button>
          <p>Vegetables</p>
        </div>
        <div>
          <button>
            <img src={img2} alt="" />
          </button>
          <p>Vegetables</p>
        </div>
        <div>
          <button>
            <img src={img2} alt="" />
          </button>
          <p>Vegetables</p>
        </div>
        <div>
          <button>
            <img src={img2} alt="" />
          </button>
          <p>Vegetables</p>
        </div>
        <div>
          <button>
            <img src={img2} alt="" />
          </button>
          <p>Vegetables</p>
        </div>
        <div>
          <button>
            <img src={img2} alt="" />
          </button>
          <p>Vegetables</p>
        </div>
        <div>
          <button>
            <img src={img2} alt="" />
          </button>
          <p>Vegetables</p>
        </div>
      </div>
    </>
  )
}
