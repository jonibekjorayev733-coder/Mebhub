import { useState } from 'react';
import './orederpage.css'
export default function Orderpage(){
  const [loading, setLoading] = useState(true);

  if (loading) return <div className="pm-spinner"><div></div></div>;
  setLoading(true)
  return(
    <h1>ddd</h1>
    
    
  )
}