// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import CircularProgress from "@mui/material/CircularProgress";
// import { getPaymentMethodsReport } from "../redux/slices/aggregateSalesSlice";

// // ProgressBar component (unchanged)
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

// const AggregatePaymentMethod = () => {
//   const dispatch = useDispatch();
//   const { paymentMethodsReport, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );

//   // Fetch payment methods report on mount
//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(getPaymentMethodsReport());
//     }
//   }, [dispatch, status]);

//   // Debugging logs
//   console.log("paymentMethodsReport:", paymentMethodsReport);
//   console.log("status:", status);
//   console.log("error:", error);

//   // Transform paymentMethodsReport object into array for progress bars
//   const paymentMethodData = () => {
//     if (status !== "succeeded" || !paymentMethodsReport) {
//       return [
//         {
//           title: "No Sales Data",
//           totalAmount: 0,
//           percentage: 0,
//           color: "#e0e0e0",
//         },
//       ];
//     }

//     // Convert object to array of { title, totalAmount }
//     const methodsArray = Object.entries(paymentMethodsReport).map(
//       ([method, data]) => ({
//         title: method,
//         totalAmount: data.totalSales,
//       })
//     );

//     const maxAmount = Math.max(...methodsArray.map((m) => m.totalAmount || 0));
//     return methodsArray.map((method, index) => {
//       const percentage =
//         maxAmount > 0 ? Math.round((method.totalAmount / maxAmount) * 100) : 0;
//       return {
//         title: method.title,
//         totalAmount: method.totalAmount,
//         percentage: percentage > 0 ? percentage : 1, // Ensure visible bar for non-zero
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
//         Aggregate Payment Methods
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

// export default AggregatePaymentMethod;

// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";

// const ProgressBar = ({ title, percentage, color }) => (
//   <Box width="100%">
//     <Stack direction="row" alignItems="center" justifyContent="space-between">
//       <Typography fontSize={16} fontWeight={500} color="#11142d">
//         {title}
//       </Typography>
//       <Typography fontSize={16} fontWeight={500} color="#11142d">
//         {percentage}%
//       </Typography>
//     </Stack>
//     <Box
//       mt={2}
//       position="relative"
//       width="100%"
//       height="8px"
//       borderRadius={1}
//       bgcolor="#e4e8ef"
//     >
//       <Box
//         width={`${percentage}%`}
//         bgcolor={color}
//         position="absolute"
//         height="100%"
//         borderRadius={1}
//       />
//     </Box>
//   </Box>
// );

// const AggregatePaymentMethod = () => {
//   return (
//     <Box
//       p={4}
//       bgcolor="#fcfcfc"
//       id="chart"
//       minWidth={490}
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//     >
//       <Typography fontSize={18} fontWeight={600} color="#11142d">
//         Aggregate Payment Method
//       </Typography>

//       <Stack my="20px" direction="column" gap={4}>
//         {propertyReferralsInfo.map((bar) => (
//           <ProgressBar key={bar.title} {...bar} />
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default AggregatePaymentMethod;

// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import { getPaymentMethodsReport } from "../redux/slices/aggregateSalesSlice";

// const ProgressBar = ({ title, totalSales, percentage, color }) => (
//   <Box width="100%">
//     <Stack direction="row" alignItems="center" justifyContent="space-between">
//       <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
//         {title}
//       </Typography>
//       <Typography fontSize={16} fontWeight={500} color="#fe6c00">
//         {totalSales} ({percentage}%)
//       </Typography>
//     </Stack>
//     <Box
//       mt={2}
//       position="relative"
//       width="100%"
//       height="8px"
//       borderRadius={1}
//       bgcolor="#e4e8ef"
//     >
//       <Box
//         width={`${percentage}%`}
//         bgcolor={color}
//         position="absolute"
//         height="100%"
//         borderRadius={1}
//       />
//     </Box>
//   </Box>
// );

// const AggregatePaymentMethod = () => {
//   const dispatch = useDispatch();
//   const { paymentMethodsReport, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(getPaymentMethodsReport());
//     }
//   }, [dispatch, status]);

//   console.log("Current paymentMethodsReport state:", paymentMethodsReport); // Log the state

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (status === "failed") {
//     return <div>Error: {error}</div>;
//   }

//   const totalSales = Object.values(paymentMethodsReport).reduce(
//     (sum, method) => sum + method.totalSales,
//     0
//   );

//   const propertyReferralsInfo = Object.entries(paymentMethodsReport).map(
//     ([method, { totalSales }]) => ({
//       title: method,
//       totalSales,
//       percentage: totalSales ? ((totalSales / totalSales) * 100).toFixed(2) : 0,
//       color: "#275be8", // You can customize colors as needed
//     })
//   );

//   return (
//     <Box
//       p={4}
//       //bgcolor="#fcfcfc"
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
//         Aggregate Payment Method
//       </Typography>

//       <Stack my="20px" direction="column" gap={4}>
//         {propertyReferralsInfo.map((bar) => (
//           <ProgressBar key={bar.title} {...bar} />
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default AggregatePaymentMethod;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import { getPaymentMethodsReport } from "../redux/slices/aggregateSalesSlice";

// const ProgressBar = ({ title, totalSales, percentage, color }) => (
//   <Box width="100%">
//     <Stack direction="row" alignItems="center" justifyContent="space-between">
//       <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
//         {title}
//       </Typography>
//       <Typography fontSize={16} fontWeight={500} color="#fe6c00">
//         {totalSales} ({percentage}%)
//       </Typography>
//     </Stack>
//     <Box
//       mt={2}
//       position="relative"
//       width="100%"
//       height="8px"
//       borderRadius={1}
//       bgcolor="#e4e8ef"
//     >
//       <Box
//         width={`${percentage}%`}
//         bgcolor={color}
//         position="absolute"
//         height="100%"
//         borderRadius={1}
//       />
//     </Box>
//   </Box>
// );

// const AggregatePaymentMethod = () => {
//   const dispatch = useDispatch();
//   const { paymentMethodsReport, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(getPaymentMethodsReport());
//     }
//   }, [dispatch, status]);

//   console.log("Current paymentMethodsReport state:", paymentMethodsReport); // Log the state

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (status === "failed") {
//     return <div>Error: {error}</div>;
//   }

//   const totalSales = Object.values(paymentMethodsReport).reduce(
//     (sum, method) => sum + method.totalSales,
//     0
//   );

//   const propertyReferralsInfo = Object.entries(paymentMethodsReport).map(
//     ([method, { totalSales: methodSales }]) => ({
//       title: method,
//       totalSales: methodSales,
//       percentage:
//         totalSales > 0 ? ((methodSales / totalSales) * 100).toFixed(2) : 0,
//       color: "#275be8",
//     })
//   );

//   return (
//     <Box
//       p={4}
//       //bgcolor="#fcfcfc"
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
//         Aggregate Payment Method
//       </Typography>

//       <Stack my="20px" direction="column" gap={4}>
//         {propertyReferralsInfo.map((bar) => (
//           <ProgressBar key={bar.title} {...bar} />
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default AggregatePaymentMethod;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getPaymentMethodsReport } from "../redux/slices/aggregateSalesSlice";
import CircularProgress from "@mui/material/CircularProgress";

const ProgressBar = ({ title, totalSales, percentage, color }) => (
  <Box width="100%">
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
        {title}
      </Typography>
      <Typography fontSize={16} fontWeight={500} color="#fe6c00">
        ₦{totalSales.toLocaleString("en-NG")} ({percentage}%)
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

const AggregatePaymentMethod = () => {
  const dispatch = useDispatch();
  const { paymentMethodsReport, status, error } = useSelector(
    (state) => state.aggregateSales
  );

  useEffect(() => {
    console.log("Fetching AggregatePaymentMethod data...");
    dispatch(getPaymentMethodsReport());
    const interval = setInterval(() => {
      dispatch(getPaymentMethodsReport());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  if (status === "loading") {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress sx={{ color: "#fe6c00" }} />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box p={4}>
        <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
          Error: {error || "Failed to load data"}
        </Typography>
      </Box>
    );
  }

  const totalSales = Object.values(paymentMethodsReport).reduce(
    (sum, method) => sum + method.totalSales,
    0
  );

  const propertyReferralsInfo = Object.entries(paymentMethodsReport).map(
    ([method, { totalSales: methodSales }]) => ({
      title: method,
      totalSales: methodSales,
      percentage:
        totalSales > 0 ? ((methodSales / totalSales) * 100).toFixed(2) : 0,
      color: "#275be8",
    })
  );

  return (
    <Box
      p={4}
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
        Aggregate Payment Method
      </Typography>
      <Stack my="20px" direction="column" gap={4}>
        {propertyReferralsInfo.map((bar) => (
          <ProgressBar key={bar.title} {...bar} />
        ))}
      </Stack>
    </Box>
  );
};

export default AggregatePaymentMethod;
