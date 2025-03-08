// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import CircularProgress from "@mui/material/CircularProgress";
// import { fetchDailySalesByPaymentMethod } from "../redux/slices/salesTransactionSlice"; // Adjust path

// // ProgressBar component with total amount display
// const ProgressBar = ({ title, totalAmount, percentage, color }) => {
//   // Format total amount as NGN
//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount || 0);

//   return (
//     <Box width="100%">
//       <Stack direction="row" alignItems="center" justifyContent="space-between">
//         <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
//           {`${title} - ${formatCurrency(totalAmount)}`}
//         </Typography>
//         <Typography fontSize={16} fontWeight={500} color="#fe6c00">
//           {percentage}%
//         </Typography>
//       </Stack>
//       <Box
//         mt={2}
//         position="relative"
//         width="100%"
//         height="8px"
//         borderRadius={1}
//         bgcolor="#e4e8ef"
//       >
//         <Box
//           width={`${percentage}%`}
//           bgcolor={color}
//           position="absolute"
//           height="100%"
//           borderRadius={1}
//         />
//       </Box>
//     </Box>
//   );
// };

// const TopSalesPaymentMethod = () => {
//   const dispatch = useDispatch();
//   const {
//     dailySalesByPaymentMethod,
//     dailySalesByPaymentMethodStatus,
//     dailySalesByPaymentMethodError,
//   } = useSelector((state) => state.salesTransactions);

//   // Fetch daily sales by payment method on mount
//   useEffect(() => {
//     dispatch(fetchDailySalesByPaymentMethod());
//   }, [dispatch]);

//   // Debugging logs
//   console.log("dailySalesByPaymentMethod:", dailySalesByPaymentMethod);
//   console.log(
//     "dailySalesByPaymentMethodStatus:",
//     dailySalesByPaymentMethodStatus
//   );
//   console.log(
//     "dailySalesByPaymentMethodError:",
//     dailySalesByPaymentMethodError
//   );

//   // Prepare progress bar data from dailySalesByPaymentMethod
//   const paymentMethodData = () => {
//     if (
//       dailySalesByPaymentMethodStatus !== "succeeded" ||
//       !Array.isArray(dailySalesByPaymentMethod) ||
//       dailySalesByPaymentMethod.length === 0
//     ) {
//       return [
//         {
//           title: "No Sales Data",
//           totalAmount: 0,
//           percentage: 0,
//           color: "#e0e0e0",
//         },
//       ];
//     }

//     const maxAmount = Math.max(
//       ...dailySalesByPaymentMethod.map((m) => m.totalAmount || 0)
//     );
//     return dailySalesByPaymentMethod.map((method, index) => {
//       const percentage =
//         maxAmount > 0 ? Math.round((method.totalAmount / maxAmount) * 100) : 0;
//       return {
//         title: method.paymentMethod,
//         totalAmount: method.totalAmount,
//         percentage: percentage > 0 ? percentage : 1, // Ensure visible bar for non-zero values
//         color: ["#6C5DD3", "#7FBA7A", "#FFCE73", "#FFA2C0", "#F45252"][
//           index % 5
//         ],
//       };
//     });
//   };

//   const data = paymentMethodData();

//   return (
//     <Box
//       p={4}
//       id="chart"
//       minWidth={490}
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//       sx={{
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Top Payment Methods
//       </Typography>

//       {dailySalesByPaymentMethodStatus === "loading" ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           my="20px"
//         >
//           <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//         </Box>
//       ) : dailySalesByPaymentMethodStatus === "failed" ? (
//         <Typography fontSize={16} color="error.main" my="20px">
//           Error:{" "}
//           {dailySalesByPaymentMethodError?.message || "Failed to load data"}
//         </Typography>
//       ) : (
//         <Stack my="20px" direction="column" gap={4} color="#fff">
//           {data.map((bar) => (
//             <ProgressBar key={bar.title} {...bar} />
//           ))}
//         </Stack>
//       )}
//     </Box>
//   );
// };

// export default TopSalesPaymentMethod;

// TopSalesPaymentMethod.jsx
// import React, { useEffect, useRef } from "react"; // Import useRef
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import CircularProgress from "@mui/material/CircularProgress";
// import { getPaymentMethodsReport } from "../redux/slices/aggregateSalesSlice";

// const ProgressBar = ({ title, totalAmount, percentage, color }) => {
//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount || 0);

//   return (
//     <Box width="100%">
//       <Stack direction="row" alignItems="center" justifyContent="space-between">
//         <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
//           {`${title} - ${formatCurrency(totalAmount)}`}
//         </Typography>
//         <Typography fontSize={16} fontWeight={500} color="#fe6c00">
//           {percentage}%
//         </Typography>
//       </Stack>
//       <Box
//         mt={2}
//         position="relative"
//         width="100%"
//         height="8px"
//         borderRadius={1}
//         bgcolor="#e4e8ef"
//       >
//         <Box
//           width={`${percentage}%`}
//           bgcolor={color}
//           position="absolute"
//           height="100%"
//           borderRadius={1}
//         />
//       </Box>
//     </Box>
//   );
// };

// const TopSalesPaymentMethod = () => {
//   const dispatch = useDispatch();
//   const { paymentMethodsReport, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     // Initial fetch
//     dispatch(getPaymentMethodsReport());

//     // Set up polling (e.g., every 10 seconds)
//     intervalRef.current = setInterval(() => {
//       dispatch(getPaymentMethodsReport());
//     }, 10000); // 10 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalRef.current);
//   }, [dispatch]);

//   // Prepare progress bar data
//   const paymentMethodData = () => {
//     // Handle loading and error states *within* the function
//     if (status === "loading") {
//       return []; // Return an empty array while loading
//     }

//     if (status === "failed") {
//       return []; // Return empty array on error
//     }
//     // Check if paymentMethodsReport is null or undefined
//     if (!paymentMethodsReport) {
//       return [
//         {
//           title: "No Data",
//           totalAmount: 0,
//           percentage: 0,
//           color: "#e0e0e0",
//         },
//       ];
//     }
//     // Convert the object to an array of payment method data
//     const paymentMethodsArray = Object.entries(paymentMethodsReport).map(
//       ([paymentMethod, data]) => ({
//         paymentMethod,
//         totalAmount: data.totalSales,
//       })
//     );

//     const maxAmount = Math.max(
//       ...paymentMethodsArray.map((m) => m.totalAmount || 0)
//     );

//     return paymentMethodsArray.map((method, index) => {
//       const percentage =
//         maxAmount > 0 ? Math.round((method.totalAmount / maxAmount) * 100) : 0;
//       return {
//         title: method.paymentMethod,
//         totalAmount: method.totalAmount,
//         percentage: percentage > 0 ? percentage : 1,
//         color: ["#6C5DD3", "#7FBA7A", "#FFCE73", "#FFA2C0", "#F45252"][
//           index % 5
//         ],
//       };
//     });
//   };

//   const data = paymentMethodData(); // Get the processed data

//   return (
//     <Box
//       p={4}
//       id="chart"
//       minWidth={490}
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//       sx={{
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Top Payment Methods
//       </Typography>

//       {status === "loading" ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           my="20px"
//         >
//           <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//         </Box>
//       ) : status === "failed" ? (
//         <Typography fontSize={16} color="error.main" my="20px">
//           Error: {error || "Failed to load data"}
//         </Typography>
//       ) : (
//         <Stack my="20px" direction="column" gap={4} color="#fff">
//           {data.map((bar) => (
//             <ProgressBar key={bar.title} {...bar} />
//           ))}
//         </Stack>
//       )}
//     </Box>
//   );
// };

// export default TopSalesPaymentMethod;

// TopSalesPaymentMethod.jsx (Modified for Extensive Logging)
// import React, { useEffect, useRef } from "react"; // Import useRef
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import CircularProgress from "@mui/material/CircularProgress";
// import { getPaymentMethodsReport } from "../redux/slices/aggregateSalesSlice";

// const ProgressBar = ({ title, totalAmount, percentage, color }) => {
//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount || 0);

//   return (
//     <Box width="100%">
//       <Stack direction="row" alignItems="center" justifyContent="space-between">
//         <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
//           {`${title} - ${formatCurrency(totalAmount)}`}
//         </Typography>
//         <Typography fontSize={16} fontWeight={500} color="#fe6c00">
//           {percentage}%
//         </Typography>
//       </Stack>
//       <Box
//         mt={2}
//         position="relative"
//         width="100%"
//         height="8px"
//         borderRadius={1}
//         bgcolor="#e4e8ef"
//       >
//         <Box
//           width={`${percentage}%`}
//           bgcolor={color}
//           position="absolute"
//           height="100%"
//           borderRadius={1}
//         />
//       </Box>
//     </Box>
//   );
// };

// const TopSalesPaymentMethod = () => {
//   const dispatch = useDispatch();
//   const { paymentMethodsReport, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     // Initial fetch
//     dispatch(getPaymentMethodsReport());

//     // Set up polling (e.g., every 10 seconds)
//     intervalRef.current = setInterval(() => {
//       dispatch(getPaymentMethodsReport());
//     }, 10000); // 10 seconds

//     // Cleanup on unmount
//     return () => clearInterval(intervalRef.current);
//   }, [dispatch]);

//   console.log("Component Rendered"); // *** ADD THIS ***
//   console.log("Redux State:", { paymentMethodsReport, status, error }); // *** ADD THIS ***

//   // Prepare progress bar data
//   const paymentMethodData = () => {
//     console.log("paymentMethodData function called"); // *** ADD THIS ***

//     if (status === "loading") {
//       console.log("Status is loading"); // *** ADD THIS ***
//       return [];
//     }

//     if (status === "failed") {
//       console.log("Status is failed. Error:", error); // *** ADD THIS ***
//       return [];
//     }

//     if (!paymentMethodsReport) {
//       console.log("paymentMethodsReport is null/undefined"); // *** ADD THIS ***
//       return [
//         {
//           title: "No Data",
//           totalAmount: 0,
//           percentage: 0,
//           color: "#e0e0e0",
//         },
//       ];
//     }

//     // Convert the object to an array
//     const paymentMethodsArray = Object.entries(paymentMethodsReport).map(
//       ([paymentMethod, data]) => ({
//         paymentMethod,
//         totalAmount: data.totalSales,
//       })
//     );
//     console.log("paymentMethodsArray", paymentMethodsArray);

//     const maxAmount = Math.max(
//       ...paymentMethodsArray.map((m) => m.totalAmount || 0)
//     );

//     return paymentMethodsArray.map((method, index) => {
//       const percentage =
//         maxAmount > 0 ? Math.round((method.totalAmount / maxAmount) * 100) : 0;
//       return {
//         title: method.paymentMethod,
//         totalAmount: method.totalAmount,
//         percentage: percentage > 0 ? percentage : 1,
//         color: ["#6C5DD3", "#7FBA7A", "#FFCE73", "#FFA2C0", "#F45252"][
//           index % 5
//         ],
//       };
//     });
//   };

//   const data = paymentMethodData();
//   console.log("Processed Data:", data); // *** ADD THIS ***

//   return (
//     <Box
//       p={4}
//       id="chart"
//       minWidth={490}
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//       sx={{
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Top Payment Methods
//       </Typography>

//       {status === "loading" ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           my="20px"
//         >
//           <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//         </Box>
//       ) : status === "failed" ? (
//         <Typography fontSize={16} color="error.main" my="20px">
//           Error: {error || "Failed to load data"}
//         </Typography>
//       ) : (
//         <Stack my="20px" direction="column" gap={4} color="#fff">
//           {data.map((bar) => (
//             <ProgressBar key={bar.title} {...bar} />
//           ))}
//         </Stack>
//       )}
//     </Box>
//   );
// };

// export default TopSalesPaymentMethod;

import React, { useEffect, useRef, useState } from "react"; // Import useState
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { getPaymentMethodsReport } from "../redux/slices/aggregateSalesSlice";

const ProgressBar = ({ title, totalAmount, percentage, color }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <Box width="100%">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
          {`${title} - ${formatCurrency(totalAmount)}`}
        </Typography>
        <Typography fontSize={16} fontWeight={500} color="#fe6c00">
          {percentage}%
        </Typography>
      </Stack>
      <Box
        mt={2}
        position="relative"
        width="100%"
        height="8px"
        borderRadius={1}
        bgcolor="#e4e8ef"
      >
        <Box
          width={`${percentage}%`}
          bgcolor={color}
          position="absolute"
          height="100%"
          borderRadius={1}
        />
      </Box>
    </Box>
  );
};

const TopSalesPaymentMethod = () => {
  const dispatch = useDispatch();
  const { paymentMethodsReport, status, error, pollingStatus } = useSelector(
    (state) => state.aggregateSales
  );
  const intervalRef = useRef(null);
  const [showInitialLoading, setShowInitialLoading] = useState(true); // New state

  useEffect(() => {
    // Initial fetch
    dispatch(getPaymentMethodsReport());

    // Set up polling (e.g., every 10 seconds)
    intervalRef.current = setInterval(() => {
      dispatch(getPaymentMethodsReport());
    }, 10000); // 10 seconds

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, [dispatch]);

  // Hide initial loading indicator after first load/failure
  useEffect(() => {
    if (status !== "idle") {
      setShowInitialLoading(false);
    }
  }, [status]);

  console.log("Component Rendered");
  console.log("Redux State:", { paymentMethodsReport, status, error });

  // Prepare progress bar data
  const paymentMethodData = () => {
    console.log("paymentMethodData function called");

    // Use pollingStatus for loading during updates, status for initial load
    if (pollingStatus === "loading" && !showInitialLoading) {
      return []; // Return empty during polling updates
    }

    if (status === "loading" && showInitialLoading) {
      return [];
    }

    if (status === "failed") {
      console.log("Status is failed. Error:", error);
      return [];
    }

    if (!paymentMethodsReport) {
      console.log("paymentMethodsReport is null/undefined");
      return [
        {
          title: "No Data",
          totalAmount: 0,
          percentage: 0,
          color: "#e0e0e0",
        },
      ];
    }

    // Convert the object to an array
    const paymentMethodsArray = Object.entries(paymentMethodsReport).map(
      ([paymentMethod, data]) => ({
        paymentMethod,
        totalAmount: data.totalSales,
      })
    );
    console.log("paymentMethodsArray", paymentMethodsArray);

    const maxAmount = Math.max(
      ...paymentMethodsArray.map((m) => m.totalAmount || 0)
    );

    return paymentMethodsArray.map((method, index) => {
      const percentage =
        maxAmount > 0 ? Math.round((method.totalAmount / maxAmount) * 100) : 0;
      return {
        title: method.paymentMethod,
        totalAmount: method.totalAmount,
        percentage: percentage > 0 ? percentage : 1,
        color: ["#6C5DD3", "#7FBA7A", "#FFCE73", "#FFA2C0", "#F45252"][
          index % 5
        ],
      };
    });
  };

  const data = paymentMethodData();
  console.log("Processed Data:", data);

  return (
    <Box
      p={4}
      id="chart"
      minWidth={490}
      display="flex"
      flexDirection="column"
      borderRadius="15px"
      sx={{
        background:
          "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
      }}
    >
      <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
        Top Payment Methods
      </Typography>

      {/* Initial Loading Indicator */}
      {showInitialLoading && status === "loading" && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          my="20px"
        >
          <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
        </Box>
      )}

      {/* Show error only on initial load failure */}
      {status === "failed" && (
        <Typography fontSize={16} color="error.main" my="20px">
          Error: {error || "Failed to load data"}
        </Typography>
      )}

      {/* Show data when loaded and not polling */}
      {!showInitialLoading && (
        <Stack my="20px" direction="column" gap={4} color="#fff">
          {data.map((bar) => (
            <ProgressBar key={bar.title} {...bar} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TopSalesPaymentMethod;
