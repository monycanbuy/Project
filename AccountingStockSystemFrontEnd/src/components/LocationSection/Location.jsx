// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Button, CircularProgress, Box } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLocations } from "../../redux/slices/locationSlice"; // Adjust the path as needed
// import { hasPermission } from "../../utils/authUtils";
// import AddNewLocationDrawer from "../AddDrawerSection/AddNewLocationDrawer";

// const Locations = () => {
//   const dispatch = useDispatch();
//   const { locations, isLoading, error } = useSelector(
//     (state) => state.locations
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     console.log("Fetching locations...");
//     dispatch(fetchLocations());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Locations from state:", locations);
//     if (locations && Array.isArray(locations) && locations.length > 0) {
//       const formattedData = locations.map((location) => [
//         location.name || "N/A",
//         location.type || "N/A",
//         location.capacity !== undefined ? location.capacity : "N/A",
//         new Date(location.createdAt).toLocaleString() || "N/A",
//         location._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No locations data available or data is not in expected format"
//       );
//     }
//   }, [locations]);

//   const handleEditClick = (location) => {
//     if (!location || location.length < 5) {
//       console.error("Invalid location data:", location);
//       return;
//     }
//     const locationData = {
//       _id: location[4],
//       name: location[0],
//       type: location[1],
//       capacity: location[2],
//     };
//     setEditData(locationData);
//     setDrawerOpen(true);
//   };

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Type", options: { filter: true, sort: true } },
//     { name: "Capacity", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const location = tableMeta.rowData;
//           return (
//             <>
//               {hasPermission(user, "update:locations") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(location)}
//                 ></i>
//               )}

//               {hasPermission(user, "delete:locations") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   // Add onClick for deleting - Note: Implement this functionality
//                 ></i>
//               )}
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
//     customToolbar: () =>
//       hasPermission(user, "write:locations") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => {
//             setEditData(null);
//             setDrawerOpen(true);
//           }}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": {
//               backgroundColor: "#fec80a",
//               color: "#bdbabb",
//             },
//           }}
//         >
//           Add New Location
//         </Button>
//       ) : null,
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
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
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
//               title={"Locations"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewLocationDrawer
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

// export default Locations;

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, CircularProgress, Box } from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../redux/slices/locationSlice"; // Adjust the path as needed
import { hasPermission } from "../../utils/authUtils";
import AddNewLocationDrawer from "../AddDrawerSection/AddNewLocationDrawer";

const Locations = () => {
  const dispatch = useDispatch();
  const { locations, isLoading, error } = useSelector(
    (state) => state.locations
  );
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    console.log("Fetching locations...");
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    console.log("Locations from state:", locations);
    if (locations && Array.isArray(locations) && locations.length > 0) {
      const formattedData = locations.map((location) => ({
        id: location._id || "N/A",
        name: location.name || "N/A",
        type: location.type || "N/A",
        capacity: location.capacity !== undefined ? location.capacity : "N/A",
        createdAt: new Date(location.createdAt).toLocaleString() || "N/A",
      }));
      console.log("Formatted Data:", formattedData);
      setData(formattedData);
    } else {
      console.log(
        "No locations data available or data is not in expected format"
      );
    }
  }, [locations]);

  const handleEditClick = (location) => {
    if (!location) {
      console.error("Invalid location data:", location);
      return;
    }
    setEditData(location);
    setDrawerOpen(true);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "capacity", headerName: "Capacity", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:locations") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params.row)}
            ></i>
          )}

          {hasPermission(user, "delete:locations") && (
            <i
              className="bx bx-trash"
              style={{ color: "#fe1e00", cursor: "pointer" }}
              // Add onClick for deleting - Note: Implement this functionality
            ></i>
          )}
        </>
      ),
    },
  ];

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": {
              backgroundColor: "#f0f0f0",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiDataGrid-cell": {
                  color: "#bdbabb",
                },
              },
            },
            "& .MuiDataGrid-cell": {
              color: "#fff",
              fontSize: "18px",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#d0d0d0",
              "& .MuiButton-root": {
                color: "#3f51b5",
              },
            },
          },
        },
      },
    },
  });

  const loadingData = [
    {
      id: "loading",
      name: (
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
          <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div>
        {error ? (
          <div>Error: {error.message || "An error occurred."}</div>
        ) : (
          <>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                  width: "100%",
                }}
              >
                <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
              </Box>
            ) : (
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  components={{
                    Toolbar: () =>
                      hasPermission(user, "write:locations") ? (
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
                          Add New Location
                        </Button>
                      ) : null,
                  }}
                />
              </Box>
            )}
            <AddNewLocationDrawer
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

export default Locations;
