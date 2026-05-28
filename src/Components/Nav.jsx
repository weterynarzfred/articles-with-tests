import { Link } from "react-router-dom";

export default function Nav() {

  return (
    <nav>
      <div><Link to="/">Home Page</Link></div>
      <div><Link to="/articles/biology">Biology</Link></div>
    </nav>
  );

}

