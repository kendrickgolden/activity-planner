import "./Recs.css";

function Recs() {
  return (
    <div id="recs">
      <h2>Recomendations:</h2>
      <div className="rec_card">
        <h3 className="datetime">Date: --- Time:</h3>
        <div className="venue">
          <img src="" alt="" />
          <div className="details">
            <h4 className="name">Venue Name</h4>
            <div className="stars">Stars</div>
            <div className="desc">Desc</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recs;
