// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Button, CircularProgress, Box } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFrontOfficeSales } from "../../redux/slices/frontOfficeSlice"; // Adjust the path as needed
// import AddNewFrontOfficeDrawer from "../AddDrawerSection/AddNewFrontOfficeDrawer";

// const FrontOffice = () => {
//   const dispatch = useDispatch();
//   const { sales, isLoading, error } = useSelector((state) => state.frontOffice);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     console.log("Fetching front office...");
//     dispatch(fetchFrontOfficeSales());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Services from state:", sales);
//     if (sales && Array.isArray(sales) && sales.length > 0) {
//       const formattedData = sales.map((sale) => [
//         new Date(sale.date).toLocaleString() || "N/A",
//         sale.assignedPersonnel || "N/A",
//         sale.amount !== undefined ? `₦${sale.amount.toFixed(2)}` : "N/A",
//         sale.notes || "N/A",
//         sale._id || "N/A",
//         sale.notes || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No front office sales data available or data is not in expected format"
//       );
//     }
//   }, [sales]);

//   const handleEditClick = (sale) => {
//     if (!sale || sale.length < 4) {
//       console.error("Invalid front office sales data:", sale);
//       return;
//     }
//     const salesData = {
//       _id: sale[4],
//       date: sale[0],
//       assignedPersonnel: sale[1],
//       amount: sale[2],
//       notes: sale[3],
//     };
//     setEditData(salesData);
//     setDrawerOpen(true);
//   };

//   const columns = [
//     {
//       name: "Date",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     { name: "Assigned Personnel", options: { filter: true, sort: true } },
//     { name: "Amount", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const sale = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(sale)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 // Add onClick for deleting - Note: Implement this functionality
//               ></i>
//             </>
//           );
//         },
//       },
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MUIDataTable: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": {
//               backgroundColor: "#f0f0f0",
//             },
//             "& .MuiTableRow-root": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiTableCell-root": {
//                   color: "#bdbabb",
//                 },
//               },
//             },
//             "& .MuiTableCell-root": {
//               color: "#fff",
//               fontSize: "18px",
//             },
//             "& .MuiTableRow-head": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiTableCell-root": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiToolbar-root": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiTypography-root": {
//                 fontSize: "18px",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#3f51b5",
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     rowsPerPage: 10,
//     customToolbar: () => (
//       <Button
//         variant="contained"
//         size="small"
//         onClick={() => {
//           setEditData(null);
//           setDrawerOpen(true);
//         }}
//         sx={{
//           backgroundColor: "#fe6c00",
//           color: "#fff",
//           "&:hover": {
//             backgroundColor: "#fec80a",
//             color: "#bdbabb",
//           },
//         }}
//       >
//         Add New Service
//       </Button>
//     ),
//   };

//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//           width: "100%",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {error ? (
//           <div>Error: {error.message || "An error occurred."}</div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Front Office Sales"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewFrontOfficeDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default FrontOffice;

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, CircularProgress, Box } from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchFrontOfficeSales } from "../../redux/slices/frontOfficeSlice"; // Adjust the path as needed
import { hasPermission } from "../../utils/authUtils";
import AddNewFrontOfficeDrawer from "../AddDrawerSection/AddNewFrontOfficeDrawer";

const FrontOffice = () => {
  const dispatch = useDispatch();
  const { sales, isLoading, error } = useSelector((state) => state.frontOffice);
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchFrontOfficeSales());
  }, [dispatch]);

  useEffect(() => {
    if (sales && Array.isArray(sales) && sales.length > 0) {
      const formattedData = sales.map((sale) => [
        // Keep date as a Date object here, format *only* in customBodyRender
        sale.date ? new Date(sale.date).toLocaleString() : "N/A",
        sale.assignedPersonnel || "N/A",
        sale.amount !== undefined ? `₦${sale.amount.toFixed(2)}` : "N/A",
        sale.notes || "N/A",
        sale._id || "N/A",
      ]);
      setData(formattedData);
    } else {
      setData([]);
    }
  }, [sales]);

  const handleEditClick = (sale) => {
    // Pass the *entire* sale object, not a reconstructed one
    if (!sale) {
      console.error("Invalid front office sales data:", sale);
      return;
    }
    setEditData(sale); // Pass the entire sale object
    setDrawerOpen(true);
  };

  const columns = [
    {
      name: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          // The value should be already formatted string.
          return value;
        },
      },
    },
    { name: "Assigned Personnel", options: { filter: true, sort: true } },
    { name: "Amount", options: { filter: true, sort: true } },
    { name: "Notes", options: { filter: false, sort: false } }, //Added note colum
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const sale = sales[tableMeta.rowIndex]; // Get from sales, more reliable
          if (!sale) return null;

          return (
            <>
              {hasPermission(user, "update:frontoffice") && (
                <i
                  className="bx bx-pencil"
                  style={{
                    color: "#fe6c00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleEditClick(sale)} // Pass the sale object
                ></i>
              )}
              {hasPermission(user, "delete:frontoffice") && (
                <i
                  className="bx bx-trash"
                  style={{ color: "#fe1e00", cursor: "pointer" }}
                  // Add onClick for deleting - Note: Implement this functionality
                ></i>
              )}
            </>
          );
        },
      },
    },
  ];

  const theme = createTheme({
    components: {
      MUIDataTable: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": {
              backgroundColor: "#f0f0f0",
            },
            "& .MuiTableRow-root": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiTableCell-root": {
                  color: "#bdbabb",
                },
              },
            },
            "& .MuiTableCell-root": {
              color: "#fff",
              fontSize: "18px",
            },
            "& .MuiTableRow-head": {
              backgroundColor: "#e0e0e0",
              "& .MuiTableCell-root": {
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
            "& .MuiToolbar-root": {
              backgroundColor: "#d0d0d0",
              "& .MuiTypography-root": {
                fontSize: "18px",
              },
              "& .MuiIconButton-root": {
                color: "#3f51b5",
              },
            },
          },
        },
      },
    },
  });

  const options = {
    filterType: "checkbox",
    rowsPerPage: 10,
    customToolbar: () =>
      hasPermission(user, "write:frontoffice") ? (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setEditData(null);
            setDrawerOpen(true);
          }}
          sx={{
            backgroundColor: "#fe6c00",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#fec80a",
              color: "#bdbabb",
            },
          }}
        >
          Add New Service
        </Button>
      ) : null,
  };

  const loadingData = [
    [
      <Box
        key="loading"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          width: "100%",
        }}
      >
        <CircularProgress sx={{ color: "#fe6c00" }} />
      </Box>,
    ],
  ];

  return (
    <ThemeProvider theme={theme}>
      <div>
        {error ? (
          <div>Error: {error.message || "An error occurred."}</div>
        ) : (
          <>
            <MUIDataTable
              title={"Front Office Sales"}
              data={isLoading ? loadingData : data}
              columns={columns}
              options={options}
            />
            <AddNewFrontOfficeDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
            />
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default FrontOffice;
