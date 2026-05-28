import { Link } from "react-router-dom";

export default function Nav() {

  return (
    <nav>
      <div><Link to="/">home</Link></div>
      <div><Link to="/articles/articles">articles</Link></div>
    </nav>
  );

}

