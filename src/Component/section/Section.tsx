import './section.css'
import { SlArrowRight } from "react-icons/sl";
import Ice from "../imgs/image copy 2.png"
import { SlArrowLeft } from "react-icons/sl";

export default function Section(){
    return(
        <div className="Enter">
          <div className="section">
            <div className="line-text">
            <span>New Products</span>
            </div>
            <div className="product">
                <div className="productbutton">
                    <button>
                    <SlArrowLeft />
                    </button>
                    <button>
                    <SlArrowRight />
                    </button>
                </div>
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
            </div>
        </div>
        </div>
        
    )
}