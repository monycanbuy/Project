// import React, { useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useDispatch, useSelector } from "react-redux";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Box, CircularProgress, Typography } from "@mui/material";
// import { fetchAllPettyCashTransactions } from "../../../redux/slices/pettyCashSlice";

// const PettyCashDashboard = () => {
//   const dispatch = useDispatch();
//   const { transactions, status, error } = useSelector(
//     (state) => state.pettyCash
//   );
//   console.log("Redux transactions:", transactions);

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchAllPettyCashTransactions());
//     }
//   }, [dispatch, status]);

//   const expenseMapping = {
//     Gasoline: "fuel",
//     Transport: "transportExpense",
//     Internet: "internet",
//     DSTV: "dstv",
//     Diesel: "dieselLubricant",
//     Furniture: "furnitureFixturesFittings",
//     Equipment: "equipmentBuildingMaterialRepair",
//     Maintenance: "maintenanceRepair",
//     Electricity: "electricNepa",
//     Directors: "directorsHouseMDExpenses",
//     Wages: "wagesLabourAllowance",
//     Housekeeping: "housekeepingItemsLaundryEXP",
//     Acquirium: "acquirium",
//     Postage: "postageTelesRCard",
//     Sadaka: "sadakaMISCPR",
//     Medical: "medicalExpenses",
//     Motor: "motorVehicleRepair",
//     Stationaries: "stationariesPrinting",
//     Generator: "generatorEXP",
//     Unknown: "misc",
//   };

//   const columns = [
//     { field: "date", headerName: "Date", width: 120 },
//     { field: "details", headerName: "Details", width: 200 },
//     { field: "voucherNo", headerName: "Voucher No", width: 120 },
//     { field: "fuel", headerName: "Fuel", width: 120, type: "number" },
//     {
//       field: "transportExpense",
//       headerName: "Transport",
//       width: 150,
//       type: "number",
//     },
//     { field: "internet", headerName: "Internet", width: 120, type: "number" },
//     { field: "dstv", headerName: "DSTV", width: 120, type: "number" },
//     {
//       field: "dieselLubricant",
//       headerName: "Diesel",
//       width: 120,
//       type: "number",
//     },
//     {
//       field: "furnitureFixturesFittings",
//       headerName: "Furniture",
//       width: 150,
//       type: "number",
//     },
//     {
//       field: "equipmentBuildingMaterialRepair",
//       headerName: "Equipment",
//       width: 150,
//       type: "number",
//     },
//     {
//       field: "maintenanceRepair",
//       headerName: "Maintenance",
//       width: 150,
//       type: "number",
//     },
//     {
//       field: "electricNepa",
//       headerName: "Electricity",
//       width: 120,
//       type: "number",
//     },
//     {
//       field: "directorsHouseMDExpenses",
//       headerName: "Directors",
//       width: 150,
//       type: "number",
//     },
//     {
//       field: "wagesLabourAllowance",
//       headerName: "Wages",
//       width: 120,
//       type: "number",
//     },
//     {
//       field: "housekeepingItemsLaundryEXP",
//       headerName: "Housekeeping",
//       width: 150,
//       type: "number",
//     },
//     { field: "acquirium", headerName: "Acquirium", width: 120, type: "number" },
//     {
//       field: "postageTelesRCard",
//       headerName: "Postage",
//       width: 120,
//       type: "number",
//     },
//     {
//       field: "sadakaMISCPR",
//       headerName: "Sadaka MISC & PR",
//       width: 150,
//       type: "number",
//     },
//     {
//       field: "medicalExpenses",
//       headerName: "Medical",
//       width: 120,
//       type: "number",
//     },
//     {
//       field: "motorVehicleRepair",
//       headerName: "Motor",
//       width: 120,
//       type: "number",
//     },
//     {
//       field: "stationariesPrinting",
//       headerName: "Stationaries",
//       width: 150,
//       type: "number",
//     },
//     {
//       field: "generatorEXP",
//       headerName: "Generator",
//       width: 120,
//       type: "number",
//     },
//     { field: "misc", headerName: "Miscellaneous", width: 150, type: "number" },
//     {
//       field: "totalPayment",
//       headerName: "Total Payment",
//       width: 150,
//       type: "number",
//     },
//   ];

//   const rows = transactions.map((tx, index) => {
//     const expenseBreakdowns = tx.expenseBreakdowns.reduce((acc, breakdown) => {
//       const categoryKey = expenseMapping[breakdown.category] || "misc";
//       acc[categoryKey] = (acc[categoryKey] || 0) + breakdown.amount;
//       return acc;
//     }, {});

//     const row = {
//       id: tx.id || index,
//       date: new Date(tx.date).toLocaleDateString(),
//       details: tx.details || "N/A",
//       voucherNo: tx.voucherNo || "N/A",
//       totalPayment: tx.totalPayment || 0,
//       fuel: expenseBreakdowns.fuel || 0,
//       transportExpense: expenseBreakdowns.transportExpense || 0,
//       internet: expenseBreakdowns.internet || 0,
//       dstv: expenseBreakdowns.dstv || 0,
//       dieselLubricant: expenseBreakdowns.dieselLubricant || 0,
//       furnitureFixturesFittings:
//         expenseBreakdowns.furnitureFixturesFittings || 0,
//       equipmentBuildingMaterialRepair:
//         expenseBreakdowns.equipmentBuildingMaterialRepair || 0,
//       maintenanceRepair: expenseBreakdowns.maintenanceRepair || 0,
//       electricNepa: expenseBreakdowns.electricNepa || 0,
//       directorsHouseMDExpenses: expenseBreakdowns.directorsHouseMDExpenses || 0,
//       wagesLabourAllowance: expenseBreakdowns.wagesLabourAllowance || 0,
//       housekeepingItemsLaundryEXP:
//         expenseBreakdowns.housekeepingItemsLaundryEXP || 0,
//       acquirium: expenseBreakdowns.acquirium || 0,
//       postageTelesRCard: expenseBreakdowns.postageTelesRCard || 0,
//       sadakaMISCPR: expenseBreakdowns.sadakaMISCPR || 0,
//       medicalExpenses: expenseBreakdowns.medicalExpenses || 0,
//       motorVehicleRepair: expenseBreakdowns.motorVehicleRepair || 0,
//       stationariesPrinting: expenseBreakdowns.stationariesPrinting || 0,
//       generatorEXP: expenseBreakdowns.generatorEXP || 0,
//       misc: expenseBreakdowns.misc || 0,
//     };
//     console.log("Row:", row);
//     return row;
//   });

//   const totals = {
//     id: "totals",
//     date: "Totals",
//     details: "",
//     voucherNo: "",
//     totalPayment: rows.reduce((sum, row) => sum + (row.totalPayment || 0), 0),
//     fuel: rows.reduce((sum, row) => sum + (row.fuel || 0), 0),
//     transportExpense: rows.reduce(
//       (sum, row) => sum + (row.transportExpense || 0),
//       0
//     ),
//     internet: rows.reduce((sum, row) => sum + (row.internet || 0), 0),
//     dstv: rows.reduce((sum, row) => sum + (row.dstv || 0), 0),
//     dieselLubricant: rows.reduce(
//       (sum, row) => sum + (row.dieselLubricant || 0),
//       0
//     ),
//     furnitureFixturesFittings: rows.reduce(
//       (sum, row) => sum + (row.furnitureFixturesFittings || 0),
//       0
//     ),
//     equipmentBuildingMaterialRepair: rows.reduce(
//       (sum, row) => sum + (row.equipmentBuildingMaterialRepair || 0),
//       0
//     ),
//     maintenanceRepair: rows.reduce(
//       (sum, row) => sum + (row.maintenanceRepair || 0),
//       0
//     ),
//     electricNepa: rows.reduce((sum, row) => sum + (row.electricNepa || 0), 0),
//     directorsHouseMDExpenses: rows.reduce(
//       (sum, row) => sum + (row.directorsHouseMDExpenses || 0),
//       0
//     ),
//     wagesLabourAllowance: rows.reduce(
//       (sum, row) => sum + (row.wagesLabourAllowance || 0),
//       0
//     ),
//     housekeepingItemsLaundryEXP: rows.reduce(
//       (sum, row) => sum + (row.housekeepingItemsLaundryEXP || 0),
//       0
//     ),
//     acquirium: rows.reduce((sum, row) => sum + (row.acquirium || 0), 0),
//     postageTelesRCard: rows.reduce(
//       (sum, row) => sum + (row.postageTelesRCard || 0),
//       0
//     ),
//     sadakaMISCPR: rows.reduce((sum, row) => sum + (row.sadakaMISCPR || 0), 0),
//     medicalExpenses: rows.reduce(
//       (sum, row) => sum + (row.medicalExpenses || 0),
//       0
//     ),
//     motorVehicleRepair: rows.reduce(
//       (sum, row) => sum + (row.motorVehicleRepair || 0),
//       0
//     ),
//     stationariesPrinting: rows.reduce(
//       (sum, row) => sum + (row.stationariesPrinting || 0),
//       0
//     ),
//     generatorEXP: rows.reduce((sum, row) => sum + (row.generatorEXP || 0), 0),
//     misc: rows.reduce((sum, row) => sum + (row.misc || 0), 0),
//   };

//   const allRows = [...rows, totals];
//   console.log("All rows:", allRows);

//   const theme = createTheme({
//     components: {
//       MuiDataGrid: {
//         styleOverrides: {
//           root: {
//             backgroundColor: "#f0f0f0",
//             "& .MuiDataGrid-row": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiDataGrid-cell": { color: "#bdbabb" },
//               },
//             },
//             "& .MuiDataGrid-cell": { color: "#fff", fontSize: "16px" },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiDataGrid-columnHeaderTitle": {
//                 color: "#000",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   if (status === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <Box sx={{ color: "red", textAlign: "center", mt: 4 }}>
//         <Typography variant="h6">Error: {error || "Unknown error"}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ height: 600, width: "100%", overflowX: "auto" }}>
//         <Typography variant="h5" sx={{ mb: 2, color: "#000" }}>
//           Petty Cash Dashboard
//         </Typography>
//         <DataGrid
//           rows={allRows}
//           columns={columns}
//           pageSize={5}
//           rowsPerPageOptions={[5]}
//           disableSelectionOnClick
//           sx={{ minWidth: 800 }}
//         />
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default PettyCashDashboard;

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { fetchAllPettyCashTransactions } from "../../../redux/slices/pettyCashSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";

const PettyCashDashboard = () => {
  const dispatch = useDispatch();
  const {
    transactions = [],
    status = "idle",
    error,
  } = useSelector((state) => state.pettyCash || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("PettyCashDashboard - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching petty cash transactions...");
        dispatch(fetchAllPettyCashTransactions())
          .unwrap()
          .then()
          .catch((err) => console.error("Fetch failed:", err));
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching petty cash transactions...");
            dispatch(fetchAllPettyCashTransactions())
              .unwrap()
              .then()
              .catch((err) =>
                console.error("Fetch failed after auth check:", err)
              );
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  const expenseMapping = useMemo(
    () => ({
      Gasoline: "fuel",
      Transport: "transportExpense",
      Internet: "internet",
      DSTV: "dstv",
      Diesel: "dieselLubricant",
      Furniture: "furnitureFixturesFittings",
      Equipment: "equipmentBuildingMaterialRepair",
      Maintenance: "maintenanceRepair",
      Electricity: "electricNepa",
      Directors: "directorsHouseMDExpenses",
      Wages: "wagesLabourAllowance",
      Housekeeping: "housekeepingItemsLaundryEXP",
      Acquirium: "acquirium",
      Postage: "postageTelesRCard",
      Sadaka: "sadakaMISCPR",
      Medical: "medicalExpenses",
      Motor: "motorVehicleRepair",
      Stationaries: "stationariesPrinting",
      Generator: "generatorEXP",
      Unknown: "misc",
    }),
    []
  );

  const columns = useMemo(
    () => [
      { field: "date", headerName: "Date", width: 120 },
      { field: "details", headerName: "Details", width: 200 },
      { field: "voucherNo", headerName: "Voucher No", width: 120 },
      { field: "fuel", headerName: "Fuel", width: 120, type: "number" },
      {
        field: "transportExpense",
        headerName: "Transport",
        width: 150,
        type: "number",
      },
      { field: "internet", headerName: "Internet", width: 120, type: "number" },
      { field: "dstv", headerName: "DSTV", width: 120, type: "number" },
      {
        field: "dieselLubricant",
        headerName: "Diesel",
        width: 120,
        type: "number",
      },
      {
        field: "furnitureFixturesFittings",
        headerName: "Furniture",
        width: 150,
        type: "number",
      },
      {
        field: "equipmentBuildingMaterialRepair",
        headerName: "Equipment",
        width: 150,
        type: "number",
      },
      {
        field: "maintenanceRepair",
        headerName: "Maintenance",
        width: 150,
        type: "number",
      },
      {
        field: "electricNepa",
        headerName: "Electricity",
        width: 120,
        type: "number",
      },
      {
        field: "directorsHouseMDExpenses",
        headerName: "Directors",
        width: 150,
        type: "number",
      },
      {
        field: "wagesLabourAllowance",
        headerName: "Wages",
        width: 120,
        type: "number",
      },
      {
        field: "housekeepingItemsLaundryEXP",
        headerName: "Housekeeping",
        width: 150,
        type: "number",
      },
      {
        field: "acquirium",
        headerName: "Acquirium",
        width: 120,
        type: "number",
      },
      {
        field: "postageTelesRCard",
        headerName: "Postage",
        width: 120,
        type: "number",
      },
      {
        field: "sadakaMISCPR",
        headerName: "Sadaka MISC & PR",
        width: 150,
        type: "number",
      },
      {
        field: "medicalExpenses",
        headerName: "Medical",
        width: 120,
        type: "number",
      },
      {
        field: "motorVehicleRepair",
        headerName: "Motor",
        width: 120,
        type: "number",
      },
      {
        field: "stationariesPrinting",
        headerName: "Stationaries",
        width: 150,
        type: "number",
      },
      {
        field: "generatorEXP",
        headerName: "Generator",
        width: 120,
        type: "number",
      },
      {
        field: "misc",
        headerName: "Miscellaneous",
        width: 150,
        type: "number",
      },
      {
        field: "totalPayment",
        headerName: "Total Payment",
        width: 150,
        type: "number",
      },
    ],
    []
  );

  const rows = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.map((tx, index) => {
      const expenseBreakdowns =
        tx.expenseBreakdowns?.reduce((acc, breakdown) => {
          const categoryKey = expenseMapping[breakdown.category] || "misc";
          acc[categoryKey] = (acc[categoryKey] || 0) + (breakdown.amount || 0);
          return acc;
        }, {}) || {};

      const row = {
        id: tx._id || tx.id || index,
        date: tx.date ? new Date(tx.date).toLocaleDateString() : "N/A",
        details: tx.details || "N/A",
        voucherNo: tx.voucherNo || "N/A",
        totalPayment: tx.totalPayment || 0,
        fuel: expenseBreakdowns.fuel || 0,
        transportExpense: expenseBreakdowns.transportExpense || 0,
        internet: expenseBreakdowns.internet || 0,
        dstv: expenseBreakdowns.dstv || 0,
        dieselLubricant: expenseBreakdowns.dieselLubricant || 0,
        furnitureFixturesFittings:
          expenseBreakdowns.furnitureFixturesFittings || 0,
        equipmentBuildingMaterialRepair:
          expenseBreakdowns.equipmentBuildingMaterialRepair || 0,
        maintenanceRepair: expenseBreakdowns.maintenanceRepair || 0,
        electricNepa: expenseBreakdowns.electricNepa || 0,
        directorsHouseMDExpenses:
          expenseBreakdowns.directorsHouseMDExpenses || 0,
        wagesLabourAllowance: expenseBreakdowns.wagesLabourAllowance || 0,
        housekeepingItemsLaundryEXP:
          expenseBreakdowns.housekeepingItemsLaundryEXP || 0,
        acquirium: expenseBreakdowns.acquirium || 0,
        postageTelesRCard: expenseBreakdowns.postageTelesRCard || 0,
        sadakaMISCPR: expenseBreakdowns.sadakaMISCPR || 0,
        medicalExpenses: expenseBreakdowns.medicalExpenses || 0,
        motorVehicleRepair: expenseBreakdowns.motorVehicleRepair || 0,
        stationariesPrinting: expenseBreakdowns.stationariesPrinting || 0,
        generatorEXP: expenseBreakdowns.generatorEXP || 0,
        misc: expenseBreakdowns.misc || 0,
      };
      //console.log("Row:", row);
      return row;
    });
  }, [transactions, expenseMapping]);

  const totals = useMemo(
    () => ({
      id: "totals",
      date: "Totals",
      details: "",
      voucherNo: "",
      totalPayment: rows.reduce((sum, row) => sum + (row.totalPayment || 0), 0),
      fuel: rows.reduce((sum, row) => sum + (row.fuel || 0), 0),
      transportExpense: rows.reduce(
        (sum, row) => sum + (row.transportExpense || 0),
        0
      ),
      internet: rows.reduce((sum, row) => sum + (row.internet || 0), 0),
      dstv: rows.reduce((sum, row) => sum + (row.dstv || 0), 0),
      dieselLubricant: rows.reduce(
        (sum, row) => sum + (row.dieselLubricant || 0),
        0
      ),
      furnitureFixturesFittings: rows.reduce(
        (sum, row) => sum + (row.furnitureFixturesFittings || 0),
        0
      ),
      equipmentBuildingMaterialRepair: rows.reduce(
        (sum, row) => sum + (row.equipmentBuildingMaterialRepair || 0),
        0
      ),
      maintenanceRepair: rows.reduce(
        (sum, row) => sum + (row.maintenanceRepair || 0),
        0
      ),
      electricNepa: rows.reduce((sum, row) => sum + (row.electricNepa || 0), 0),
      directorsHouseMDExpenses: rows.reduce(
        (sum, row) => sum + (row.directorsHouseMDExpenses || 0),
        0
      ),
      wagesLabourAllowance: rows.reduce(
        (sum, row) => sum + (row.wagesLabourAllowance || 0),
        0
      ),
      housekeepingItemsLaundryEXP: rows.reduce(
        (sum, row) => sum + (row.housekeepingItemsLaundryEXP || 0),
        0
      ),
      acquirium: rows.reduce((sum, row) => sum + (row.acquirium || 0), 0),
      postageTelesRCard: rows.reduce(
        (sum, row) => sum + (row.postageTelesRCard || 0),
        0
      ),
      sadakaMISCPR: rows.reduce((sum, row) => sum + (row.sadakaMISCPR || 0), 0),
      medicalExpenses: rows.reduce(
        (sum, row) => sum + (row.medicalExpenses || 0),
        0
      ),
      motorVehicleRepair: rows.reduce(
        (sum, row) => sum + (row.motorVehicleRepair || 0),
        0
      ),
      stationariesPrinting: rows.reduce(
        (sum, row) => sum + (row.stationariesPrinting || 0),
        0
      ),
      generatorEXP: rows.reduce((sum, row) => sum + (row.generatorEXP || 0), 0),
      misc: rows.reduce((sum, row) => sum + (row.misc || 0), 0),
    }),
    [rows]
  );

  const allRows = useMemo(() => [...rows, totals], [rows, totals]);
  //console.log("All rows:", allRows);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "#f0f0f0",
            "& .MuiDataGrid-row": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiDataGrid-cell": { color: "#bdbabb" },
              },
            },
            "& .MuiDataGrid-cell": { color: "#fff", fontSize: "16px" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#000",
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#29221d",
              color: "#fcfcfc",
              "& .MuiTablePagination-root": { color: "#fcfcfc" },
              "& .MuiIconButton-root": { color: "#fcfcfc" },
            },
          },
        },
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view the petty cash dashboard.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        {status === "loading" && rows.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              width: "100%",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#fe6c00" }} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#302924",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              zIndex: 1300,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#fe1e00", mb: 2, fontWeight: "bold" }}
            >
              Error:{" "}
              {typeof error === "object" && error.message
                ? error.message
                : error || "Failed to load dashboard"}
              {error?.status && ` (Status: ${error.status})`}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{
                backgroundColor: "#fe6c00",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "4px",
                "&:hover": { backgroundColor: "#fec80a", color: "#000" },
              }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: "#000" }}>
              Petty Cash Dashboard
            </Typography>
            <Box sx={{ height: 600, minWidth: 800 }}>
              <DataGrid
                rows={allRows}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                disableSelectionOnClick
              />
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default PettyCashDashboard;
