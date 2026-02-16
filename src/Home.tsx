import Cloud from "./components/Cloud/Cloud";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Section from "./components/Section/Section";
import Totc from "./components/Totc/Totc";
import Pysc from "./components/Pysc/Pysc";
import Features from "./components/Features/Features";
import One from "./components/One/One";
import ExploreCourse from "./components/ExploreCourse/ExploreCourse";
import ClassManagement from "./components/ClassManagement/ClassManagement";
import Assessments from "./components/Assessments/Assessments";
import Testimonial from "./components/Testimonial/Testimonial";
import LatestNews from "./components/LatestNews/LatestNews";
import NewsletterFooter from "./components/NewsletterFooter/NewsletterFooter";

export default function Home() {
  return (
    <div className="web-clone">
      <div className="center">
        <Header />
        <Main />
        <Section />
        <Cloud />a
        <Totc />
        <Pysc />
        <Features />
        <Assessments />
        <ClassManagement />
        <One />
        <ExploreCourse />
        <Testimonial />
        <LatestNews />
        <NewsletterFooter />
      </div>
    </div>
  );
}
