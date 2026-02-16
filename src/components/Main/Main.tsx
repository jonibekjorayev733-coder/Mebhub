import "./main.css"
import img2 from "../main/img2/image.png";
import gril from "../main/img2/gril.png"
import person from "../Main/img2/person.png"
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

export default function Main(){
    return(
        <main>
            <div className="mainleft">
                <div>
                    <h1> <b>Studying</b> Online is now <br /> much easier</h1>
                <p>Everything you can do in a physical classroom, you can do with TOTC</p>
                <div className="maintext">
                    <button>Join for free</button>
                    <button className="play">
                        <img src={img2} alt="" />
                    </button>
                    <h4>Watch how it works</h4>
                </div>
                </div>
                <div className="mainright">
             <img src={gril} alt="" />
             <div className="pet1">
      
                <div className="icon">
<FaRegCalendarAlt className="FaRegCalendarAlt" />
                </div>
                <p>250k</p> 
                <p>Assisted Student</p>

             </div>
             <div className="pet2">
                
                <div className="icon">
<MdOutlineMail className="MdOutlineMail" />
                </div>
                <p>250k</p> 
                <p>Assisted Student</p>

             </div>
             <div className="pet3">
                <div className="pet3text">
                   <img src={person} alt="" />
                   <h1>
                   User Experience Class <br />
                   Today at 12.00 PM 
                   </h1>    
                </div> 
                <button>save</button>
             </div>
            </div>
            </div>
            
        </main>
    )
}