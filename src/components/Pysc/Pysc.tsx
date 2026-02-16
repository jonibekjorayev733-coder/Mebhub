import './Pysc.css';
import lesson from "../Main/img2/lesson.png";
const Pysc = () => {
  return (
    <div className="pysc">
      <div className="lessonvideotext">
        <div className="text-circle top"></div>
        <h1>
        Everything you can do in a physical <br /> classroom, <b>you can do with TOTC</b>
      </h1>
      <p>
        TOTC’s school management software helps traditional <br /> and online schools manage scheduling, attendance, <br /> payments and virtual classrooms all in one secure cloud- <br />based system.
      </p>
      <a href="ss">Learn more</a>
        <div className="text-circle bottom"></div>
      </div>
      <div className="lessonvideo">
        <div className="blue"></div>
        <div className="green"></div>
        <img src={lesson} alt="" />

      </div>
    </div>
  );
};


export default Pysc;