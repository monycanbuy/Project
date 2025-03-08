// import { iconsImgs } from "../../utils/images";
// import "./ContentTop.css";
// import { useContext } from "react";
// import { SidebarContext } from "../../context/sidebarContext";

// const ContentTop = () => {
//   const { toggleSidebar } = useContext(SidebarContext);
//   return (
//     <div className="main-content-top">
//       <div className="content-top-left">
//         <button
//           type="button"
//           className="sidebar-toggler"
//           onClick={() => toggleSidebar()}
//         >
//           <img src={iconsImgs.menu} alt="" />
//         </button>
//         <h3 className="content-top-title">Home</h3>
//       </div>
//       <div className="content-top-btns">
//         <button type="button" className="search-btn content-top-btn">
//           <img src={iconsImgs.search} alt="" />
//         </button>
//         <button className="notification-btn content-top-btn">
//           <img src={iconsImgs.bell} />
//           <span className="notification-btn-dot"></span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ContentTop;

// import React, { useState, useEffect, useRef } from "react";
// import { iconsImgs } from "../../utils/images";
// import "./ContentTop.css";
// import { useContext } from "react";
// import { SidebarContext } from "../../context/sidebarContext";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchUnreadAlerts,
//   markAlertAsRead,
// } from "../../redux/slices/alertsSlice"; // Import actions
// import { Link } from "react-router-dom"; // Import Link for navigation

// const ContentTop = () => {
//   const { toggleSidebar } = useContext(SidebarContext);
//   const dispatch = useDispatch();
//   const { alerts, status, error } = useSelector((state) => state.alerts);

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null); // Ref for the dropdown

//   // Fetch unread alerts on component mount and periodically
//   useEffect(() => {
//     dispatch(fetchUnreadAlerts());

//     const intervalId = setInterval(() => {
//       dispatch(fetchUnreadAlerts());
//     }, 30000); // Poll every 30 seconds (adjust as needed)

//     return () => clearInterval(intervalId);
//   }, [dispatch]);

//   // Function to close the dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const unreadCount = alerts.filter((alert) => !alert.read).length;

//   // Function to handle marking an alert as read
//   const handleMarkAsRead = (alertId) => {
//     dispatch(markAlertAsRead(alertId));
//   };

//   return (
//     <div className="main-content-top">
//       <div className="content-top-left">
//         <button
//           type="button"
//           className="sidebar-toggler"
//           onClick={() => toggleSidebar()}
//         >
//           <img src={iconsImgs.menu} alt="" />
//         </button>
//         <h3 className="content-top-title">Home</h3>
//       </div>
//       <div className="content-top-btns">
//         <button type="button" className="search-btn content-top-btn">
//           <img src={iconsImgs.search} alt="" />
//         </button>

//         <div className="notification-container" ref={dropdownRef}>
//           <button
//             className={`notification-btn content-top-btn ${
//               isDropdownOpen ? "active" : ""
//             }`}
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
//           >
//             <img src={iconsImgs.bell} alt="Notifications" />
//             {unreadCount > 0 && (
//               <span className="notification-btn-dot">{unreadCount}</span>
//             )}
//           </button>

//           {isDropdownOpen && (
//             <div className="notification-dropdown">
//               {alerts.length === 0 ? (
//                 <p>No unread notifications.</p>
//               ) : (
//                 <>
//                   {alerts.slice(0, 5).map(
//                     (
//                       alert // Show up to 5 alerts
//                     ) => (
//                       <div
//                         key={alert._id}
//                         className={`notification-item ${
//                           alert.read ? "read" : "unread"
//                         }`}
//                         onClick={() => handleMarkAsRead(alert._id)}
//                       >
//                         <p className="notification-message">{alert.message}</p>
//                       </div>
//                     )
//                   )}
//                   <Link to="/alerts" className="see-all-link">
//                     See All Alerts
//                   </Link>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContentTop;

// ContentTop.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { iconsImgs } from "../../utils/images";
// import "./ContentTop.css";
// import { useContext } from "react";
// import { SidebarContext } from "../../context/sidebarContext";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   markAlertAsRead,
//   addNewAlert,
//   updateExistingAlert,
//   fetchAlerts,
// } from "../../redux/slices/alertsSlice";
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import { toast } from "react-hot-toast";
// import axios from "axios";

// const ContentTop = () => {
//   const { toggleSidebar } = useContext(SidebarContext);
//   const dispatch = useDispatch();
//   const { alerts, status, error } = useSelector((state) => state.alerts);
//   const navigate = useNavigate(); // Get the navigate function

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; //for event source

//   // Fetch initial alerts using fetchAlerts
//   useEffect(() => {
//     dispatch(fetchAlerts());
//   }, [dispatch]);

//   useEffect(() => {
//     // Setup SSE connection
//     let eventSource;

//     const getSSETokenAndConnect = async () => {
//       try {
//         // 1. Get the SSE token
//         const token = localStorage.getItem("accessToken"); // Get main token
//         if (!token) {
//           console.log("No access token.  Not connecting to SSE.");
//           return; // Don't connect if not logged in
//         }
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const tokenResponse = await axios.get(
//           `${API_BASE_URL}/api/alerts/sse-token`,
//           config
//         ); // Use axios
//         const sseToken = tokenResponse.data.sseToken;

//         // 2. Connect to SSE *with* the token
//         eventSource = new EventSource(
//           `${API_BASE_URL}/api/alerts/unread/sse?token=${sseToken}`
//         );

//         eventSource.onopen = () => {
//           console.log("SSE connection opened");
//         };

//         eventSource.onmessage = (event) => {
//           const newAlert = JSON.parse(event.data);
//           // Use optional chaining to prevent errors if alerts is undefined
//           const existingAlert = alerts?.find(
//             (alert) => alert._id === newAlert._id
//           );

//           if (existingAlert) {
//             // If the alert exists, update it
//             dispatch(updateExistingAlert(newAlert));
//           } else {
//             // If it's a new alert, add it
//             dispatch(addNewAlert(newAlert));
//             // showNotification(newAlert); // Show notification for new alerts -- REMOVED
//           }
//         };

//         eventSource.onerror = (error) => {
//           console.error("EventSource failed:", error);
//           let errorMessage = "An unknown error occurred with the EventSource.";
//           if (error instanceof Event) {
//             errorMessage =
//               "EventSource connection failed. Check your network and server.";
//           }
//           toast.error(`Error with alert: ${errorMessage}`, { duration: 7000 });
//           eventSource.close();
//         };
//       } catch (error) {
//         console.error("Error getting SSE token or connecting:", error);
//         //  Handle errors (e.g., show a message to the user)
//       }
//     };
//     getSSETokenAndConnect(); // Call the function to connect

//     return () => {
//       if (eventSource) {
//         eventSource.close(); // Close connection when component unmounts
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch]); //  Removed 'alerts' from dependency array.

//   const handleMouseEnter = () => {
//     setIsDropdownOpen(true);
//   };

//   const handleMouseLeave = () => {
//     setIsDropdownOpen(false);
//   };

//   const unreadCount = alerts ? alerts.filter((alert) => !alert.read).length : 0;

//   const handleMarkAsReadAndNavigate = (alertId) => {
//     dispatch(markAlertAsRead(alertId)) // Still mark as read
//       .then(() => {
//         navigate("/admin/alerts"); // Navigate *after* marking as read
//       });
//   };

//   const requestNotificationPermission = async () => {
//     /* ... (same as before) ... */
//   };
//   const showNotification = (alert) => {
//     /* ... (same as before) ... */
//   };

//   return (
//     <div className="main-content-top">
//       <div className="content-top-left">
//         <button
//           type="button"
//           className="sidebar-toggler"
//           onClick={() => toggleSidebar()}
//         >
//           <img src={iconsImgs.menu} alt="" />
//         </button>
//         <h3 className="content-top-title">Home</h3>
//       </div>
//       <div className="content-top-btns">
//         <button type="button" className="search-btn content-top-btn">
//           <img src={iconsImgs.search} alt="" />
//         </button>

//         <div
//           className="notification-container"
//           ref={dropdownRef}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           <button className="notification-btn content-top-btn">
//             <img src={iconsImgs.bell} alt="Notifications" />
//             {unreadCount > 0 && (
//               <span className="notification-btn-dot">{unreadCount}</span>
//             )}
//           </button>

//           {isDropdownOpen && (
//             <div className="notification-dropdown">
//               {alerts && alerts.filter((alert) => !alert.read).length > 0 ? (
//                 <>
//                   {alerts
//                     .filter((alert) => !alert.read)
//                     .slice(0, 4)
//                     .map((alert) => (
//                       <div
//                         key={alert._id}
//                         className={`notification-item ${
//                           alert.read ? "read" : "unread"
//                         }`}
//                         onClick={() => handleMarkAsReadAndNavigate(alert._id)} // Call new function
//                       >
//                         <p className="notification-message">{alert.message}</p>
//                       </div>
//                     ))}
//                   <Link to="/admin/alerts" className="see-all-link">
//                     See All Alerts
//                   </Link>
//                 </>
//               ) : (
//                 <p>No unread notifications.</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContentTop;

// import React, { useState, useEffect, useRef } from "react";
// import { iconsImgs } from "../../utils/images";
// import "./ContentTop.css";
// import { useContext } from "react";
// import { SidebarContext } from "../../context/sidebarContext";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   markAlertAsRead,
//   addNewAlert,
//   updateExistingAlert,
//   fetchAlerts,
// } from "../../redux/slices/alertsSlice";
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import { toast } from "react-hot-toast";
// import axios from "axios";

// // Create the Audio object *outside* the component.
// const notificationSound = new Audio("/sounds/alert.mp3"); //  your sound file path

// const ContentTop = () => {
//   const { toggleSidebar } = useContext(SidebarContext);
//   const dispatch = useDispatch();
//   const { alerts, status, error } = useSelector((state) => state.alerts);
//   const navigate = useNavigate(); // Get the navigate function

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; //for event source

//   const [soundEnabled, setSoundEnabled] = useState(true); //  Add state for sound toggle

//   // Fetch initial alerts using fetchAlerts
//   useEffect(() => {
//     dispatch(fetchAlerts());
//   }, [dispatch]);

//   useEffect(() => {
//     // Setup SSE connection
//     let eventSource;

//     const getSSETokenAndConnect = async () => {
//       try {
//         // 1. Get the SSE token
//         const token = localStorage.getItem("accessToken"); // Get main token
//         if (!token) {
//           console.log("No access token.  Not connecting to SSE.");
//           return; // Don't connect if not logged in
//         }
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const tokenResponse = await axios.get(
//           `${API_BASE_URL}/api/alerts/sse-token`,
//           config
//         ); // Use axios
//         const sseToken = tokenResponse.data.sseToken;

//         // 2. Connect to SSE *with* the token
//         eventSource = new EventSource(
//           `${API_BASE_URL}/api/alerts/unread/sse?token=${sseToken}`
//         );

//         eventSource.onopen = () => {
//           console.log("SSE connection opened");
//         };

//         eventSource.onmessage = (event) => {
//           const newAlert = JSON.parse(event.data);
//           // Use optional chaining to prevent errors if alerts is undefined
//           const existingAlert = alerts?.find(
//             (alert) => alert._id === newAlert._id
//           );

//           if (existingAlert) {
//             // If the alert exists, update it
//             dispatch(updateExistingAlert(newAlert));
//           } else {
//             // If it's a new alert, add it
//             dispatch(addNewAlert(newAlert));
//             //showNotification(newAlert);
//             if (soundEnabled) {
//               //  Play sound *only if* enabled
//               notificationSound
//                 .play()
//                 .catch((e) => console.error("Error playing sound:", e)); //  Play the sound
//             }
//           }
//         };

//         eventSource.onerror = (error) => {
//           console.error("EventSource failed:", error);
//           let errorMessage = "An unknown error occurred with the EventSource.";
//           if (error instanceof Event) {
//             errorMessage =
//               "EventSource connection failed. Check your network and server.";
//           }
//           toast.error(`Error with alert: ${errorMessage}`, { duration: 7000 });
//           eventSource.close();
//         };
//       } catch (error) {
//         console.error("Error getting SSE token or connecting:", error);
//         //  Handle errors (e.g., show a message to the user)
//       }
//     };
//     getSSETokenAndConnect(); // Call the function to connect

//     return () => {
//       if (eventSource) {
//         eventSource.close(); // Close connection when component unmounts
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch]); //  Removed 'alerts' from dependency array.

//   const handleMouseEnter = () => {
//     setIsDropdownOpen(true);
//   };

//   const handleMouseLeave = () => {
//     setIsDropdownOpen(false);
//   };

//   const unreadCount = alerts ? alerts.filter((alert) => !alert.read).length : 0;

//   const handleMarkAsReadAndNavigate = (alertId) => {
//     dispatch(markAlertAsRead(alertId)) // Still mark as read
//       .then(() => {
//         navigate("/admin/alerts"); // Navigate *after* marking as read
//       });
//   };

//   const requestNotificationPermission = async () => {
//     /* ... (same as before) ... */
//   };
//   const showNotification = (alert) => {
//     /* ... (same as before) ... */
//   };

//   return (
//     <div className="main-content-top">
//       <div className="content-top-left">
//         <button
//           type="button"
//           className="sidebar-toggler"
//           onClick={() => toggleSidebar()}
//         >
//           <img src={iconsImgs.menu} alt="" />
//         </button>
//         <h3 className="content-top-title">Home</h3>
//       </div>
//       <div className="content-top-btns">
//         <button type="button" className="search-btn content-top-btn">
//           <img src={iconsImgs.search} alt="" />
//         </button>

//         <div
//           className="notification-container"
//           ref={dropdownRef}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           <button
//             className="notification-btn content-top-btn"
//             style={{ marginRight: "1rem" }}
//           >
//             <img src={iconsImgs.bell} alt="Notifications" />
//             {unreadCount > 0 && (
//               <span className="notification-btn-dot">{unreadCount}</span>
//             )}
//           </button>
//           {/* Sound Toggle Button */}
//           <button
//             onClick={() => setSoundEnabled(!soundEnabled)}
//             className="content-top-btn"
//             title={soundEnabled ? "Mute Notifications" : "Unmute Notifications"}
//           >
//             <img
//               src={soundEnabled ? iconsImgs.volumemute : iconsImgs.volumup}
//               alt="sound"
//             />
//           </button>

//           {isDropdownOpen && (
//             <div className="notification-dropdown">
//               {alerts && alerts.filter((alert) => !alert.read).length > 0 ? (
//                 <>
//                   {alerts
//                     .filter((alert) => !alert.read)
//                     .slice(0, 4)
//                     .map((alert) => (
//                       <div
//                         key={alert._id}
//                         className={`notification-item ${
//                           alert.read ? "read" : "unread"
//                         }`}
//                         onClick={() => handleMarkAsReadAndNavigate(alert._id)} // Call new function
//                       >
//                         <p className="notification-message">{alert.message}</p>
//                       </div>
//                     ))}
//                   <Link to="/admin/alerts" className="see-all-link">
//                     See All Alerts
//                   </Link>
//                 </>
//               ) : (
//                 <p>No unread notifications.</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContentTop;

// ContentTop.jsx
import React, { useState, useEffect, useRef } from "react";
import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import { useDispatch, useSelector } from "react-redux";
import {
  markAlertAsRead,
  addNewAlert,
  updateExistingAlert,
  fetchAlerts,
} from "../../redux/slices/alertsSlice";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-hot-toast";
import axios from "axios";

const ContentTop = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const dispatch = useDispatch();
  const { alerts, status, error } = useSelector((state) => state.alerts);
  const navigate = useNavigate(); // Get the navigate function

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; //for event source

  // Fetch initial alerts using fetchAlerts
  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  useEffect(() => {
    // Setup SSE connection
    let eventSource;

    const getSSETokenAndConnect = async () => {
      try {
        // 1. Get the SSE token
        const token = localStorage.getItem("accessToken"); // Get main token
        if (!token) {
          console.log("No access token.  Not connecting to SSE.");
          return; // Don't connect if not logged in
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const tokenResponse = await axios.get(
          `${API_BASE_URL}/api/alerts/sse-token`,
          config
        ); // Use axios
        const sseToken = tokenResponse.data.sseToken;

        // 2. Connect to SSE *with* the token
        eventSource = new EventSource(
          `${API_BASE_URL}/api/alerts/unread/sse?token=${sseToken}`
        );

        eventSource.onopen = () => {
          console.log("SSE connection opened");
        };

        eventSource.onmessage = (event) => {
          const newAlert = JSON.parse(event.data);
          // Use optional chaining to prevent errors if alerts is undefined
          const existingAlert = alerts?.find(
            (alert) => alert._id === newAlert._id
          );

          if (existingAlert) {
            // If the alert exists, update it
            dispatch(updateExistingAlert(newAlert));
          } else {
            // If it's a new alert, add it
            dispatch(addNewAlert(newAlert));
            // showNotification(newAlert); // Show notification for new alerts -- REMOVED
          }
        };

        eventSource.onerror = (error) => {
          console.error("EventSource failed:", error);
          let errorMessage = "An unknown error occurred with the EventSource.";
          if (error instanceof Event) {
            errorMessage =
              "EventSource connection failed. Check your network and server.";
          }
          toast.error(`Error with alert: ${errorMessage}`, { duration: 7000 });
          eventSource.close();
        };
      } catch (error) {
        console.error("Error getting SSE token or connecting:", error);
        //  Handle errors (e.g., show a message to the user)
      }
    };
    getSSETokenAndConnect(); // Call the function to connect

    return () => {
      if (eventSource) {
        eventSource.close(); // Close connection when component unmounts
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); //  Removed 'alerts' from dependency array.

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const unreadCount = alerts ? alerts.filter((alert) => !alert.read).length : 0;

  const handleMarkAsReadAndNavigate = (alertId) => {
    dispatch(markAlertAsRead(alertId)) // Still mark as read
      .then(() => {
        navigate("/admin/alerts"); // Navigate *after* marking as read
      });
  };

  const requestNotificationPermission = async () => {
    /* ... (same as before) ... */
  };
  const showNotification = (alert) => {
    /* ... (same as before) ... */
  };

  return (
    <div className="main-content-top">
      <div className="content-top-left">
        <button
          type="button"
          className="sidebar-toggler"
          onClick={() => toggleSidebar()}
        >
          <img src={iconsImgs.menu} alt="" />
        </button>
        <h3 className="content-top-title">Home</h3>
      </div>
      <div className="content-top-btns">
        <button type="button" className="search-btn content-top-btn">
          <img src={iconsImgs.search} alt="" />
        </button>

        <div
          className="notification-container"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="notification-btn content-top-btn">
            <img src={iconsImgs.bell} alt="Notifications" />
            {unreadCount > 0 && (
              <span className="notification-btn-dot">{unreadCount}</span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="notification-dropdown">
              {alerts && alerts.filter((alert) => !alert.read).length > 0 ? (
                <>
                  {alerts
                    .filter((alert) => !alert.read)
                    .slice(0, 4)
                    .map((alert) => (
                      <div
                        key={alert._id}
                        className={`notification-item ${
                          alert.read ? "read" : "unread"
                        }`}
                        onClick={() => handleMarkAsReadAndNavigate(alert._id)} // Call new function
                      >
                        <p className="notification-message">{alert.message}</p>
                      </div>
                    ))}
                  <Link to="/admin/alerts" className="see-all-link">
                    See All Alerts
                  </Link>
                </>
              ) : (
                <p>No unread notifications.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentTop;
