// // import React, { useEffect, useState, useContext } from "react";
// // import { defaultImgs } from "../../utils/images";
// // import { navigationLinks } from "../../data/data";
// // import "./Sidebar.css";
// // import { SidebarContext } from "../../context/sidebarContext";
// // import { useSelector, useDispatch } from "react-redux";
// // import { fetchUserDetails } from "../../redux/slices/authSlice";

// // const Sidebar = () => {
// //   const [activeLinkIdx, setActiveLinkIdx] = useState(1);
// //   const [sidebarClass, setSidebarClass] = useState("");
// //   const { isSidebarOpen, toggleDrawer } = useContext(SidebarContext) || {};
// //   const { user } = useSelector((state) => state.auth);
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     if (!user) {
// //       dispatch(fetchUserDetails());
// //     }
// //   }, [dispatch, user]);

// //   // useEffect(() => {
// //   //   if (isSidebarOpen) {
// //   //     setSidebarClass("sidebar-change");
// //   //   } else {
// //   //     setSidebarClass("");
// //   //   }
// //   // }, [isSidebarOpen]);

// //   const handleLinkClick = (id) => {
// //     setActiveLinkIdx(id);
// //   };

// //   // Hypothetical function to update user data
// //   const handleUserUpdate = (updatedUserData) => {
// //     dispatch(updateUser(updatedUserData)).then(() => {
// //       console.log(
// //         "After update:",
// //         useSelector((state) => state.auth.user)
// //       );
// //       // Optionally, if updateUser doesn't return full user details:
// //       // dispatch(fetchUserDetails());
// //     });
// //   };

// //   // Example usage: Trigger update when clicking on user info
// //   const handleProfileUpdate = () => {
// //     // This is where you'd pass new user data
// //     const updatedUserData = {
// //       _id: user._id, // Make sure to include the user's ID for updating
// //       fullName: "New Name",
// //       // Other fields to update, including profileImage if needed
// //     };
// //     handleUserUpdate(updatedUserData);
// //   };

// //   const getProfileImage = () => {
// //     const baseURL = "http://localhost:8000";
// //     if (user && user.profileImage) {
// //       return `${baseURL}${user.profileImage}?v=${Date.now()}`;
// //     }
// //     return defaultImgs.bg_img;
// //   };
// //   console.log("Constructed Image URL:", getProfileImage());

// //   return (
// //     <div className={`sidebar ${sidebarClass}`}>
// //       <div className="user-info" onClick={handleProfileUpdate}>
// //         {" "}
// //         <div className="info-img img-fit-cover">
// //           <img
// //             src={getProfileImage()}
// //             alt="profile image"
// //             style={{ cursor: "pointer" }}
// //           />
// //         </div>
// //         <span className="info-name">{user?.fullName || "alice-doe"}</span>
// //       </div>

// //       <nav className="navigation">
// //         <ul className="nav-list">
// //           {navigationLinks.map((navigationLink) => (
// //             <li className="nav-item" key={navigationLink.id}>
// //               <a
// //                 href={navigationLink.route}
// //                 className={`nav-link ${
// //                   navigationLink.id === activeLinkIdx ? "active" : ""
// //                 }`}
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   handleLinkClick(navigationLink.id);
// //                 }}
// //               >
// //                 <img
// //                   src={navigationLink.image}
// //                   className="nav-link-icon"
// //                   alt={navigationLink.title}
// //                 />
// //                 <span className="nav-link-text">{navigationLink.title}</span>
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       </nav>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// // import React, { useEffect, useState, useContext } from "react";
// // import { defaultImgs } from "../../utils/images";
// // import { navigationLinks } from "../../data/data";
// // import "./Sidebar.css";
// // import { SidebarContext } from "../../context/sidebarContext";
// // import { useSelector, useDispatch } from "react-redux";
// // import { fetchUserDetails } from "../../redux/slices/authSlice";
// // import { NavLink } from "react-router-dom";

// // const Sidebar = () => {
// //   const [sidebarClass, setSidebarClass] = useState("");
// //   const { isSidebarOpen, toggleDrawer } = useContext(SidebarContext) || {};
// //   const { user } = useSelector((state) => state.auth);
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     if (!user) {
// //       dispatch(fetchUserDetails());
// //     }
// //   }, [dispatch, user]);

// //   useEffect(() => {
// //     setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
// //   }, [isSidebarOpen]);

// //   // Hypothetical function to update user data
// //   const handleUserUpdate = (updatedUserData) => {
// //     dispatch(updateUser(updatedUserData)).then(() => {
// //       console.log(
// //         "After update:",
// //         useSelector((state) => state.auth.user)
// //       );
// //       // Optionally, if updateUser doesn't return full user details:
// //       // dispatch(fetchUserDetails());
// //     });
// //   };

// //   // Example usage: Trigger update when clicking on user info
// //   const handleProfileUpdate = () => {
// //     // This is where you'd pass new user data
// //     const updatedUserData = {
// //       _id: user._id, // Make sure to include the user's ID for updating
// //       fullName: "New Name",
// //       // Other fields to update, including profileImage if needed
// //     };
// //     handleUserUpdate(updatedUserData);
// //   };

// //   const getProfileImage = () => {
// //     const baseURL = "http://localhost:8000";
// //     if (user && user.profileImage) {
// //       return `${baseURL}${user.profileImage}?v=${Date.now()}`;
// //     }
// //     return defaultImgs.bg_img;
// //   };
// //   console.log("Constructed Image URL:", getProfileImage());

// //   return (
// //     <div className={`sidebar ${sidebarClass}`}>
// //       <div className="user-info" onClick={handleProfileUpdate}>
// //         <div className="info-img img-fit-cover">
// //           <img
// //             src={getProfileImage()}
// //             alt="profile image"
// //             style={{ cursor: "pointer" }}
// //           />
// //         </div>
// //         <span className="info-name">{user?.fullName || "alice-doe"}</span>
// //       </div>

// //       <nav className="navigation">
// //         <ul className="nav-list">
// //           {navigationLinks.map((navigationLink) => (
// //             <li className="nav-item" key={navigationLink.id}>
// //               <NavLink
// //                 to={navigationLink.route}
// //                 className={({ isActive }) =>
// //                   `nav-link ${isActive ? "active" : ""}`
// //                 }
// //               >
// //                 <img
// //                   src={navigationLink.image}
// //                   className="nav-link-icon"
// //                   alt={navigationLink.title}
// //                 />
// //                 <span className="nav-link-text">{navigationLink.title}</span>
// //               </NavLink>
// //             </li>
// //           ))}
// //         </ul>
// //       </nav>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// // import React, { useEffect, useState, useContext } from "react";
// // import { defaultImgs } from "../../utils/images";
// // import { navigationLinks } from "../../data/data";
// // import "./Sidebar.css";
// // import { SidebarContext } from "../../context/sidebarContext";
// // import { useSelector, useDispatch } from "react-redux";
// // import { fetchUserDetails } from "../../redux/slices/authSlice";
// // import { NavLink } from "react-router-dom";
// // import { hasPermission } from "../../utils/authUtils"; // Import hasPermission

// // const Sidebar = () => {
// //   const [sidebarClass, setSidebarClass] = useState("");
// //   const { isSidebarOpen, toggleDrawer } = useContext(SidebarContext) || {};
// //   const { user } = useSelector((state) => state.auth);
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     if (!user) {
// //       dispatch(fetchUserDetails());
// //     }
// //   }, [dispatch, user]);

// //   useEffect(() => {
// //     setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
// //   }, [isSidebarOpen]);

// //   const getProfileImage = () => {
// //     const baseURL = "http://localhost:8000";
// //     if (user && user.profileImage) {
// //       return `${baseURL}${user.profileImage}?v=${Date.now()}`;
// //     }
// //     return defaultImgs.bg_img;
// //   };

// //   return (
// //     <div className={`sidebar ${sidebarClass}`}>
// //       <div className="user-info">
// //         <div className="info-img img-fit-cover">
// //           <img
// //             src={getProfileImage()}
// //             alt="profile image"
// //             style={{ cursor: "pointer" }}
// //           />
// //         </div>
// //         <span className="info-name">{user?.fullName || "alice-doe"}</span>
// //       </div>

// //       <nav className="navigation">
// //         <ul className="nav-list">
// //           {navigationLinks.map(
// //             (navigationLink) =>
// //               hasPermission(
// //                 user,
// //                 `read:${navigationLink.title
// //                   .toLowerCase()
// //                   .replace(/\s+/g, "-")}`
// //               ) && (
// //                 <li className="nav-item" key={navigationLink.id}>
// //                   <NavLink
// //                     to={navigationLink.route}
// //                     className={({ isActive }) =>
// //                       `nav-link ${isActive ? "active" : ""}`
// //                     }
// //                   >
// //                     <img
// //                       src={navigationLink.image}
// //                       className="nav-link-icon"
// //                       alt={navigationLink.title}
// //                     />
// //                     <span className="nav-link-text">
// //                       {navigationLink.title}
// //                     </span>
// //                   </NavLink>
// //                 </li>
// //               )
// //           )}
// //         </ul>
// //       </nav>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// import React, { useEffect, useState, useContext } from "react";
// import { defaultImgs } from "../../utils/images";
// import { navigationLinks } from "../../data/data";
// import "./Sidebar.css";
// import { SidebarContext } from "../../context/sidebarContext";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUserDetails } from "../../redux/slices/authSlice";
// import { NavLink } from "react-router-dom";
// import { hasPermission } from "../../utils/authUtils"; // Import hasPermission

// const Sidebar = () => {
//   const [sidebarClass, setSidebarClass] = useState("");
//   const { isSidebarOpen, toggleDrawer } = useContext(SidebarContext) || {};
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!user) {
//       dispatch(fetchUserDetails());
//     }
//   }, [dispatch, user]);

//   useEffect(() => {
//     setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
//   }, [isSidebarOpen]);

//   const getProfileImage = () => {
//     const baseURL = "http://localhost:8000";
//     if (user && user.profileImage) {
//       return `${baseURL}${user.profileImage}?v=${Date.now()}`;
//     }
//     return defaultImgs.bg_img;
//   };

//   console.log("User object:", user); // Log user object to verify roles and permissions

//   return (
//     <div className={`sidebar ${sidebarClass}`}>
//       <div className="user-info">
//         <div className="info-img img-fit-cover">
//           <img
//             src={getProfileImage()}
//             alt="profile image"
//             style={{ cursor: "pointer" }}
//           />
//         </div>
//         <span className="info-name">{user?.fullName || "alice-doe"}</span>
//       </div>

//       <nav className="navigation">
//         <ul className="nav-list">
//           {navigationLinks.map((navigationLink) => {
//             const permission = `read:${navigationLink.title
//               .toLowerCase()
//               .replace(/\s+/g, "-")}`;
//             const hasPerm = hasPermission(user, permission);
//             console.log(
//               `Checking permission for ${navigationLink.title}: ${permission} - ${hasPerm}`
//             );
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
//                       {navigationLink.title}
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
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
  }, [isSidebarOpen]);

  const getProfileImage = () => {
    const baseURL = "http://localhost:8000";
    if (user && user.profileImage) {
      return `${baseURL}${user.profileImage}?v=${Date.now()}`;
    }
    return defaultImgs.bg_img;
  };

  console.log("Sidebar user:", user);

  if (!user) return null; // Wait for user to load

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          <img
            src={getProfileImage()}
            alt="profile image"
            style={{ cursor: "pointer" }}
          />
        </div>
        <span className="info-name">{user.fullName || "alice-doe"}</span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks.map((navigationLink) => {
            const permission = `read:${navigationLink.title
              .toLowerCase()
              .replace(/\s+/g, "-")}`;
            const hasPerm = hasPermission(user, permission);
            console.log(
              `Checking ${navigationLink.title}: ${permission} - ${hasPerm}`
            );
            return (
              hasPerm && (
                <li className="nav-item" key={navigationLink.id}>
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
                      {navigationLink.title}
                    </span>
                  </NavLink>
                </li>
              )
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
