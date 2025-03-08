// KabasaTopSellingItem.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fetchKabasaTopSellingItems } from "../redux/slices/kabasaSlice"; // Adjust path

const ProgressBar = ({ title, percentage, color }) => (
  <Box width="100%">
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography fontSize={16} fontWeight={500} color="#d9cfcf">
        {title}
      </Typography>
      <Typography fontSize={16} fontWeight={500} color="#d9cfcf">
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

const KabasaTopSellingItem = () => {
  const dispatch = useDispatch();
  const { topSellingItems, status, error } = useSelector(
    (state) => state.kabasa
  );

  // Fetch top selling items on mount
  useEffect(() => {
    dispatch(fetchKabasaTopSellingItems());
  }, [dispatch]);

  // Process top selling items for progress bars
  const getTopSellingItemsData = () => {
    if (!topSellingItems || topSellingItems.length === 0) return [];
    const maxQty = Math.max(...topSellingItems.map((item) => item.totalQty));
    const colors = ["#fe6c00", "#ffc397", "#475be8", "#e827b5", "#ff6f61"];

    return topSellingItems.map((item, index) => ({
      title: item.itemName,
      percentage: maxQty > 0 ? Math.round((item.totalQty / maxQty) * 100) : 0,
      color: colors[index % colors.length],
    }));
  };

  const topSellingItemsData = getTopSellingItemsData();

  return (
    <Box
      p={4}
      bgcolor="#fcfcfc"
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
      <Typography fontSize={18} fontWeight={600} color="#d9cfcf">
        Kabasa Top Selling Items
      </Typography>

      {status === "loading" ? (
        <Typography color="#fff" mt="20px">
          Loading top items...
        </Typography>
      ) : error ? (
        <Typography color="error" mt="20px">
          Error: {error.message}
        </Typography>
      ) : topSellingItemsData.length > 0 ? (
        <Stack my="20px" direction="column" gap={4}>
          {topSellingItemsData.map((bar) => (
            <ProgressBar key={bar.title} {...bar} />
          ))}
        </Stack>
      ) : (
        <Typography color="#d9cfcf" mt="20px">
          No items sold yet
        </Typography>
      )}
    </Box>
  );
};

export default KabasaTopSellingItem;
