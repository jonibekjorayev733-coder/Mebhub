import "../Cloud/cloud.css"
import { FaCalendarAlt } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
export default function Cloud(){
    return(
       <div className="cloud">
        <h1>All-In-One 
            <b>Cloud Software</b>
        </h1>
        <p>
            TOTC is one powerful online software suite that combines all the tools <br /> needed to run a successful school or office.

        </p>
        <div className="drop">
            <div className="drop1">
               <div className="text">
                <FiFileText  className="mens"/>
               </div>

                <h1>
                Online Billing <br /> Invoicing, & Contracts

               </h1>
               <p>
                Simple and secure control of your <br /> organization’s financial and legal <br /> transactions. Send customized <br /> invoices and contracts
               </p>
               
            </div>
            <div className="drop1">
                <div className="text" style={{background:"#00CBB8"}}>
                    <FaCalendarAlt className="mens" />
               </div>

                <h1>
                Online Billing <br /> Invoicing, & Contracts

               </h1>
               <p>
                Simple and secure control of your <br /> organization’s financial and legal <br /> transactions. Send customized <br /> invoices and contracts
               </p>
            </div>
            <div className="drop1">
                <div className="text" style={{background:"#29B9E7"}}>
                    <MdPeople className="mens" />
               </div>

                <h1>
                Online Billing <br /> Invoicing, & Contracts

               </h1>
               <p>
                Simple and secure control of your <br /> organization’s financial and legal <br /> transactions. Send customized <br /> invoices and contracts
               </p>
            </div>
        </div>
       </div>
    )
}