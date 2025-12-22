import "./sectionone.css"
import { SlArrowRight } from "react-icons/sl";
import Ice from "../imgs/image copy 2.png"
import { SlArrowLeft } from "react-icons/sl";

export default function Sectionone() {
    return(
       <div className="Sectiongroup">
         <div className="sectionone">
            <div className="lintext">
            <span>New Products</span>
            </div>
            <ul>
                <li><a href="">friuts</a></li>
                <li><a href="">Vegetable</a></li>
                <li><a href="">Meal</a></li>
                <li><a href="">Cakes</a></li>
                <li><a href="">Drinks</a></li>
            </ul>
            <div className="products">
                                <div className='productone'>
                                  <img src={Ice} alt="" />
                                  <div className="price">
                                  <p style={{"color":"#666666"}}>ICE cream cones sundae...</p>
                                  <span className='span'>
                                    <s>$20.00</s>
                                    <strong>$15.00</strong>
                                    <p>(450ml)</p>
                                  </span>
                                  </div>
                                </div>
                                <div className='productone'>
                                  <img src={Ice} alt="" />
                                  <div className="price">
                                  <p style={{"color":"#666666"}}>ICE cream cones sundae...</p>
                                  <span className='span'>
                                    <s>$20.00</s>
                                    <strong>$15.00</strong>
                                    <p>(450ml)</p>
                                  </span>
                                  </div>
                                </div>
                                <div className='productone'>
                                  <img src={Ice} alt="" />
                                  <div className="price">
                                  <p style={{"color":"#666666"}}>ICE cream cones sundae...</p>
                                  <span className='span'>
                                    <s>$20.00</s>
                                    <strong>$15.00</strong>
                                    <p>(450ml)</p>
                                  </span>
                                  </div>
                                </div>
                                <div className='productone'>
                                  <img src={Ice} alt="" />
                                  <div className="price">
                                  <p style={{"color":"#666666"}}>ICE cream cones sundae...</p>
                                  <span className='span'>
                                    <s>$20.00</s>
                                    <strong>$15.00</strong>
                                    <p>(450ml)</p>
                                  </span>
                                  </div>
                                </div>
                            </div>
                            <div className="probutton">
                                                <button>
                                                <SlArrowLeft />
                                                </button>
                                                <button>
                                                <SlArrowRight />
                                                </button>
                                            </div>
        </div>
       </div>
    )
}