import "./sectiontwo.css"
import imgfood from "../imgs/image copy 7.png"
import { IoMdCheckboxOutline } from "react-icons/io";


export default function Sectiontwo(){
    return(
        <div className="Two">
            <div className="sectiontwo">
            <img src={imgfood} alt="" />
            <div className="foodtext">
                <h1>Fresh Product Directly <br />
To Your Door With Free <br />
Delivery</h1>
        <p>There are many variations of passage Lorem Ipsum available, but te majority <br /> hav suffered alteration in some form, by injected humour</p>
        <div className="chekdtext">
        <span>
        <IoMdCheckboxOutline  className="men"/>
            <p>Free Delivery For All Order</p>
        </span>
        <span>
        <IoMdCheckboxOutline className="men"/>
            <p>Free Delivery For All Order</p>
        </span>
        </div>
        <button>Find Now</button>
            </div>
        </div>
        </div>
    )
}