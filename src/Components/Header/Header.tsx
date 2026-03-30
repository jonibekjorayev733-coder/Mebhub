import "./Hader.css"
export default function header() {
    return (
        <div className="Header">
            <h1 className="h1">Lug'at</h1>
            <ul>
                <li><a href="">about</a></li>
                <li><a href="">lanpage</a></li>
                <li><a href="">herio</a></li>
            </ul>
            <div className="buttons">
                <button>login</button>
                <button>setingis</button>
            </div>
        </div>
    )
}