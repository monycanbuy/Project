// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import AdminCharts from "../../../charts/AdminBoard/AdminCharts";

// const AdminReports = () => {
//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#11142D">
//         Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         <AdminCharts
//           title="Properties for Sale"
//           value={684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <AdminCharts
//           title="Properties for Rent"
//           value={550}
//           series={[60, 40]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <AdminCharts
//           title="Total customers"
//           value={5684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <AdminCharts
//           title="Properties for Cities"
//           value={555}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//       </Box>

//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       ></Stack>
//     </Box>
//   );
// };

// export default AdminReports;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getCurrentlyLoggedInUsers,
//   getLoggedInToday,
//   //getStaffTaskAchievements,
//   getTotalUsers,
// } from "../../../redux/slices/authSlice"; // Adjust path as needed
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import CircularProgress from "@mui/material/CircularProgress";
// import AdminCharts from "../../../charts/AdminBoard/AdminCharts"; // Adjust path as needed
// import AdminRevenue from "../../../charts/AdminBoard/AdminRevenue";

// const AdminReports = () => {
//   const dispatch = useDispatch();
//   const {
//     currentlyLoggedInUsers,
//     loggedInToday,
//     //staffTaskAchievements,
//     userStats,
//     isLoading,
//     error,
//   } = useSelector((state) => state.auth);

//   // Fetch data on component mount
//   useEffect(() => {
//     dispatch(getCurrentlyLoggedInUsers());
//     dispatch(getLoggedInToday());
//     //dispatch(getStaffTaskAchievements());
//     dispatch(getTotalUsers());
//   }, [dispatch]);

//   // Dynamic series calculation
//   const calculateSeries = (value, total) => {
//     if (!total || total === 0) return [100, 0]; // Default to 100% if no total
//     const percentage = Math.round((value / total) * 100);
//     return [percentage, 100 - percentage];
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress size={40} sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <Box sx={{ color: "red", textAlign: "center", mt: 4 }}>
//         <Typography variant="h6">Error: {error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//         Admin Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         <AdminCharts
//           title="Total Users"
//           value={userStats.totalUsers || 0}
//           series={calculateSeries(userStats.totalUsers, userStats.totalUsers)} // 100% of itself
//           colors={["#fe6c00", "#e0e0e0"]}
//         />
//         <AdminCharts
//           title="Active Users"
//           value={userStats.activeUsers || 0}
//           series={calculateSeries(userStats.activeUsers, userStats.totalUsers)}
//           colors={["#1bf81b", "#efecc4"]}
//         />
//         <AdminCharts
//           title="Inactive Users"
//           value={userStats.inactiveUsers || 0}
//           series={calculateSeries(
//             userStats.inactiveUsers,
//             userStats.totalUsers
//           )}
//           colors={["#e827be", "#efdbc4"]}
//         />
//         <AdminCharts
//           title="Logged In Today"
//           value={loggedInToday || 0}
//           series={calculateSeries(loggedInToday, userStats.totalUsers)}
//           colors={["#0344f5", "#fcfcfc"]}
//         />
//         <AdminCharts
//           title="Currently Logged In Users"
//           value={currentlyLoggedInUsers || 0}
//           series={calculateSeries(currentlyLoggedInUsers, userStats.totalUsers)}
//           colors={["#7411d6", "#e91313"]}
//         />
//       </Box>

//       {/* Placeholder for staffTaskAchievements (could be a separate chart) */}
//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         <AdminRevenue />
//       </Stack>
//     </Box>
//   );
// };

// export default AdminReports;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentlyLoggedInUsers,
  getLoggedInToday,
  getStaffTaskAchievements,
  getTotalUsers,
} from "../../../redux/slices/authSlice"; // Adjust path
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import AdminCharts from "../../../charts/AdminBoard/AdminCharts"; // Adjust path
import AdminRevenue from "../../../charts/AdminBoard/AdminRevenue"; // Adjust path

const AdminReports = () => {
  const dispatch = useDispatch();
  const {
    currentlyLoggedInUsers,
    loggedInToday,
    staffTaskAchievements,
    userStats,
    isLoading,
    error,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    //console.log("Fetching auth data...");
    dispatch(getCurrentlyLoggedInUsers());
    dispatch(getLoggedInToday());
    dispatch(getStaffTaskAchievements());
    dispatch(getTotalUsers());
  }, [dispatch]);

  useEffect(() => {
    // console.log("Redux state updated:", {
    //   currentlyLoggedInUsers,
    //   loggedInToday,
    //   staffTaskAchievements,
    //   userStats,
    //   isLoading,
    //   error,
    // });
  }, [
    currentlyLoggedInUsers,
    loggedInToday,
    staffTaskAchievements,
    userStats,
    isLoading,
    error,
  ]);

  const calculateSeries = (value, total) => {
    if (!total || total === 0) return [100, 0];
    const percentage = Math.round((value / total) * 100);
    return [percentage, 100 - percentage];
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={40} sx={{ color: "#fe6c00" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: "red", textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#fe6c00">
        Admin Dashboard
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <AdminCharts
          title="Total Users"
          value={userStats.totalUsers || 0}
          series={calculateSeries(userStats.totalUsers, userStats.totalUsers)}
          colors={["#fe6c00", "#e0e0e0"]}
        />
        <AdminCharts
          title="Active Users"
          value={userStats.activeUsers || 0}
          series={calculateSeries(userStats.activeUsers, userStats.totalUsers)}
          colors={["#1bf81b", "#efecc4"]}
        />
        <AdminCharts
          title="Inactive Users"
          value={userStats.inactiveUsers || 0}
          series={calculateSeries(
            userStats.inactiveUsers,
            userStats.totalUsers
          )}
          colors={["#e827be", "#efdbc4"]}
        />
        <AdminCharts
          title="Logged In Today"
          value={loggedInToday || 0}
          series={calculateSeries(loggedInToday, userStats.totalUsers)}
          colors={["#0344f5", "#fcfcfc"]}
        />
        <AdminCharts
          title="Currently Logged In Users"
          value={currentlyLoggedInUsers || 0}
          series={calculateSeries(currentlyLoggedInUsers, userStats.totalUsers)}
          colors={["#7411d6", "#e91313"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <AdminRevenue staffTaskAchievements={staffTaskAchievements || []} />
      </Stack>
    </Box>
  );
};

export default AdminReports;
