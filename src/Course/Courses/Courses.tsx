import "./Courses.css"
import Courseheader from "../Courseheader/Courseheader"
import Choice from "../Choice/Choice"
import Coursecategory from "../Coursecategory/Coursecategory"
import Recommended from "../Recommended/Recommended"
import Blog from "../Blog/Blog"
import Courseslider from "../Courseslider/Courseslider"
import Coursestudent from "../Courstudent/Courstudent"
import CourseFooter from "../CourseFooter/CourseFooter"
import Header from "../../components/Header/Header"

export default function Courses(){
    return(
        <div className="courses">
          <Header/>
          <Courseheader/>
          <Choice/>
          <Coursecategory/>
          <Recommended/>
          <Blog/>
          <Courseslider/>
          <Coursestudent/>
          <CourseFooter/>
        </div>
    )
}
