import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="content">
      <div className="table-of-contents"><h3>Contents</h3>
        <Link to="/articles/biology">biology</Link>
        <div className="button-list">
          <Link to="/articles/foxes" className="button">drag and drop test</Link>
        </div>
      </div>
    </div>
  );

}

export default Home;
