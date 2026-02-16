import "../Totc/Totc.css"
import video from "../Main/img2/video.png"
export default function Totc(){
    return(
        <div className="Totc">
           <div className="totctext">
             <h1 className="men">
                What is <b>TOTC?</b>
            </h1>
            <p>TOTC is a platform that allows educators to create online classes whereby they can <br /> store the course materials online; manage assignments, quizzes and exams; monitor <br /> due dates; grade results and provide students with feedback all in one place.</p>
            <div className="totcvideo">
                <div className="img-container">
                    <img src={video} alt="" />
                    <div className="overlay">
                        <h1>FOR INSTRUCTORS</h1>
                        <button>Start a class today</button>
                    </div>
                </div>
                <div className="img-container">
                    <img src={video} alt="" />
                    <div className="overlay">
                        <h1>FOR INSTRUCTORS</h1>
                        <button>Start a class today</button>
                    </div>
                </div>
            </div>
           </div>
        </div>
    )
}