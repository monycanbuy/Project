// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";

// //import { propertyReferralsInfo } from "constants/index";

// const propertyReferralsInfo = [
//   {
//     title: "Social Media",
//     percentage: 64,
//     color: "#6C5DD3",
//   },
//   {
//     title: "Marketplace",
//     percentage: 40,
//     color: "#7FBA7A",
//   },
//   {
//     title: "Websites",
//     percentage: 50,
//     color: "#FFCE73",
//   },
//   {
//     title: "Digital Ads",
//     percentage: 80,
//     color: "#FFA2C0",
//   },
//   {
//     title: "Others",
//     percentage: 15,
//     color: "#F45252",
//   },
// ];

// const ProgressBar = ({ title, percentage, color }) => (
//   <Box width="100%">
//     <Stack direction="row" alignItems="center" justifyContent="space-between">
//       <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
//         {title}
//       </Typography>
//       <Typography fontSize={16} fontWeight={500} color="#fe6c00">
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

// const PropertyReferrals = () => {
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
//         Inventory Value Report
//       </Typography>

//       <Stack my="20px" direction="column" gap={4} color="#fff">
//         {propertyReferralsInfo.map((bar) => (
//           <ProgressBar key={bar.title} {...bar} />
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default PropertyReferrals;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchTopSellingItems } from "../redux/slices/inventoriesSlice";

const ProgressBar = ({ title, percentage, color }) => (
  <Box width="100%">
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
        {title}
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

const TopSellingItems = () => {
  const dispatch = useDispatch();
  const { topSellingItems, topSellingItemsStatus, topSellingItemsError } =
    useSelector((state) => state.inventories);

  // Fetch top-selling items on mount
  useEffect(() => {
    dispatch(fetchTopSellingItems({ limit: 5 })); // Fetch top 5 items
  }, [dispatch]);

  // Prepare progress bar data from topSellingItems
  const topItemsData =
    topSellingItemsStatus === "succeeded" && topSellingItems.length > 0
      ? topSellingItems.map((item, index) => {
          const maxSales = topSellingItems[0].totalSales; // Use top seller as 100%
          const percentage = Math.round((item.totalSales / maxSales) * 100); // Scale percentage
          return {
            title: item.name,
            percentage: percentage > 0 ? percentage : 1, // Ensure visible bar even for small values
            color: ["#6C5DD3", "#7FBA7A", "#FFCE73", "#FFA2C0", "#F45252"][
              index % 5
            ], // Cycle colors
          };
        })
      : [
          {
            title: "No Sales Data",
            percentage: 0,
            color: "#e0e0e0",
          },
        ];

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
        Top Selling Items
      </Typography>

      {topSellingItemsStatus === "loading" ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          my="20px"
        >
          <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
        </Box>
      ) : topSellingItemsStatus === "failed" ? (
        <Typography fontSize={16} color="error" my="20px">
          Error: {topSellingItemsError || "Failed to load data"}
        </Typography>
      ) : (
        <Stack my="20px" direction="column" gap={4} color="#fff">
          {topItemsData.map((bar) => (
            <ProgressBar key={bar.title} {...bar} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TopSellingItems;
