// import React, { useEffect, useState, useContext } from "react";
// import { defaultImgs } from "../../utils/images";
// import { navigationLinks } from "../../data/data";
// import "./Sidebar.css";
// import { SidebarContext } from "../../context/sidebarContext";
// import { useSelector } from "react-redux";
// import { NavLink } from "react-router-dom";
// import { hasPermission } from "../../utils/authUtils";

// const Sidebar = () => {
//   const [sidebarClass, setSidebarClass] = useState("");
//   const { isSidebarOpen } = useContext(SidebarContext) || {};
//   const { user, isLoading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
//   }, [isSidebarOpen]);

//   const getProfileImage = () => {
//     const url = user?.profileImage || defaultImgs.bg_img; // Use persisted URL
//     console.log("Sidebar profile image URL:", url);
//     return url;
//   };

//   if (isLoading || !user) {
//     return (
//       <div className={`sidebar ${sidebarClass}`}>
//         <div className="user-info">
//           <div className="info-img img-fit-cover">
//             <img src={defaultImgs.bg_img} alt="loading" />
//           </div>
//           <span className="info-name">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`sidebar ${sidebarClass}`}>
//       <div className="user-info">
//         <div className="info-img img-fit-cover">
//           <img
//             src={getProfileImage()}
//             alt="profile image"
//             style={{ cursor: "pointer" }}
//             onError={(e) => {
//               console.error("Sidebar image load error:", e.target.src);
//               e.target.src = defaultImgs.bg_img;
//             }}
//           />
//         </div>
//         <span className="info-name">{user.fullName || "User"}</span>
//       </div>

//       <nav className="navigation">
//         <ul className="nav-list">
//           {navigationLinks.map((navigationLink) => {
//             const permission = `read:${navigationLink.title
//               .toLowerCase()
//               .replace(/\s+/g, "-")}`;
//             const hasPerm = hasPermission(user, permission);
//             return (
//               hasPerm && (
//                 <li className="nav-item" key={navigationLink.id}>
//                   <NavLink
//                     to={navigationLink.route}
//                     className={({ isActive }) =>
//                       `nav-link ${isActive ? "active" : ""}`
//                     }
//                   >
//                     <img
//                       src={navigationLink.image}
//                       className="nav-link-icon"
//                       alt={navigationLink.title}
//                     />
//                     <span className="nav-link-text">
//                       {navigationLink.displayTitle || navigationLink.title}
//                     </span>
//                   </NavLink>
//                 </li>
//               )
//             );
//           })}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState, useContext } from "react";
import { defaultImgs } from "../../utils/images";
import { navigationLinks } from "../../data/data";
import "./Sidebar.css";
import { SidebarContext } from "../../context/sidebarContext";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { hasPermission } from "../../utils/authUtils";

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext) || {};
  const { user, isLoading } = useSelector((state) => state.auth);
  const [openDropdowns, setOpenDropdowns] = useState({}); // State for dropdowns

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
  }, [isSidebarOpen]);

  const getProfileImage = () => {
    const url = user?.profileImage || defaultImgs.bg_img;
    //console.log("Sidebar profile image URL:", url);
    return url;
  };

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading || !user) {
    return (
      <div className={`sidebar ${sidebarClass}`}>
        <div className="user-info">
          <div className="info-img img-fit-cover">
            <img src={defaultImgs.bg_img} alt="loading" />
          </div>
          <span className="info-name">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          <img
            src={getProfileImage()}
            alt="profile image"
            style={{ cursor: "pointer" }}
            onError={(e) => {
              console.error("Sidebar image load error:", e.target.src);
              e.target.src = defaultImgs.bg_img;
            }}
          />
        </div>
        <span className="info-name">{user.fullName || "User"}</span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks.map((navigationLink) => {
            const permission = `read:${navigationLink.title
              .toLowerCase()
              .replace(/\s+/g, "-")}`;
            const hasParentPerm = hasPermission(user, permission);

            // Skip if user lacks permission for the parent item
            if (!hasParentPerm) return null;

            return (
              <li className="nav-item" key={navigationLink.id}>
                {/* Parent item (with or without children) */}
                {navigationLink.children ? (
                  <>
                    <div
                      className="nav-link dropdown-toggle"
                      onClick={() => toggleDropdown(navigationLink.id)}
                    >
                      <img
                        src={navigationLink.image}
                        className="nav-link-icon"
                        alt={navigationLink.title}
                      />
                      <span className="nav-link-text">
                        {navigationLink.displayTitle || navigationLink.title}
                      </span>
                      <span className="dropdown-arrow">
                        {openDropdowns[navigationLink.id] ? "▲" : "▼"}
                      </span>
                    </div>
                    {/* Nested items */}
                    {openDropdowns[navigationLink.id] && (
                      <ul className="dropdown-list">
                        {navigationLink.children.map((childLink) => {
                          const childPermission = `read:${childLink.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`;
                          const hasChildPerm = hasPermission(
                            user,
                            childPermission
                          );

                          return (
                            hasChildPerm && (
                              <li className="dropdown-item" key={childLink.id}>
                                <NavLink
                                  to={childLink.route}
                                  className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                  }
                                >
                                  <img
                                    src={childLink.image}
                                    className="nav-link-icon"
                                    alt={childLink.title}
                                  />
                                  <span className="nav-link-text">
                                    {childLink.displayTitle || childLink.title}
                                  </span>
                                </NavLink>
                              </li>
                            )
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={navigationLink.route}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <img
                      src={navigationLink.image}
                      className="nav-link-icon"
                      alt={navigationLink.title}
                    />
                    <span className="nav-link-text">
                      {navigationLink.displayTitle || navigationLink.title}
                    </span>
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
