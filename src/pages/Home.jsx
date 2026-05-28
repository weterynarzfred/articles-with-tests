import { Link } from "react-router-dom";

function Home() {
  return <div className="content">
    <h1>articles with tests</h1>
    <p>Pretend there's something smart and informative written here.</p>
    <div className="button-list">
      <Link to="/articles/articles" className="button">go to the articles</Link>
    </div>
  </div>;
}

export default Home;
