import "./sidebar.css";
// import { PermIdentity } from "@material-ui/icons";
import { PermIdentity } from "@mui/icons-material";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu"></div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                Homepage
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
