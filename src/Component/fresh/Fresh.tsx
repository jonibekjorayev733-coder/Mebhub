import fresh from  "../imgs/image copy 6.png"
import "./fresh.css"

export default function Fresh(){
    return(
        <div className="Freesh">
            <div className="fresh">
            <div className="imgfresh">
             <img src={fresh} alt="" />
            </div>
            <div className="freshtext">
                <h1>Our Spiceal Service <br />
                Fresh Beef</h1>
                <span style={{"display":"flex","alignItems":"center","gap":"10px"}}>
                    <s style={{"color":"grey"}}>$20.00</s>
                    <strong>$18.00</strong>
                </span>
                <button style={{"background":"none","border":"1px solid #E21A43"}}>shop now</button>
            </div>
        </div>
        </div>
    )
}