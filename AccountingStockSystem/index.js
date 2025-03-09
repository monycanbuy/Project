const express = require("express");
const swaggerUi = require("swagger-ui-express");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { startCronJob } = require("./middlewares/cronJobs");

require("./models/inventoryModel");
require("./models/unifiedSalesModel");
require("./models/dishesModel");
require("./models/productModel");
require("./models/categoryModel");
require("./models/frontOfficeModel");
require("./models/hallModel");
require("./models/hallTypesModel");
require("./models/kabasaModel");
require("./models/laundryModel");
require("./models/laundryServiceModel");
require("./models/orderItemModel");
require("./models/PaymentMethodModel");
require("./models/roleModel");
require("./models/saleItemModel");
require("./models/salesModel");
require("./models/seminarsModel");
require("./models/supplierModel");
require("./models/userModel");
require("./models/purchaseOrderModel");
require("./models/inventoryAdjustmentModel");
require("./models/locationModel");
require("./models/alertModel");
require("./models/auditLogModel");
require("./models/inventoryAdjustmentModel");
require("./models/purchaseOrderModel");
require("./models/stockMovementModel");
require("./models/salesTransactionModel");
require("./models/permissionModel");

const unifiedSleaRouter = require("./routers/unifiedSaleRouter");
const dishRouter = require("./routers/dishesRouter");
const productRouter = require("./routers/productRouter"); // Import the product router file
const authRouter = require("./routers/authRouter");
const roleRouter = require("./routers/roleRouter");
const categoryRouter = require("./routers/categoryRouter");
const paymentMethodRouter = require("./routers/paymentMethodRouter");
const salesRouter = require("./routers/salesRouter");
const hallRouter = require("./routers/hallRouter");
const laundryRouter = require("./routers/laundryRouter");
const laundryServiceRouter = require("./routers/laundryServiceRoutes");
const orderItemsRouter = require("./routers/orderItemRouter");
const seminarsRouter = require("./routers/seminarRouter");
const kabasaRouter = require("./routers/kabasaRouter");
const frontOfficeRouter = require("./routers/frontOfficeRouter");
const hallTypesRouter = require("./routers/hallTypesRouter");
const supplierRouter = require("./routers/supplierRouter");
const anotherUnifiedSalesRouter = require("./routers/anotherUnifiedSaleRoutes");
const aggregateSalesRouter = require("./routers/aggregateSalesRouter");
const locationRouter = require("./routers/locationRouter");
const inventoryRouter = require("./routers/inventoryRouter");
const alertsRouter = require("./routers/alertsRouter");
const auditLogRouter = require("./routers/auditLogRouter");
const inventoryAdjustmentRouter = require("./routers/inventoryAdjustmentRouter");
const purchaseOrderRouter = require("./routers/purchaseOrderRouter");
const stockMovementRouter = require("./routers/stockMovementRouter");
const salesTransactionRouter = require("./routers/salesTransactionRouter");
const permissionRouter = require("./routers/permissionRouter");
const swaggerDocs = require("./utils/swaggerConfig"); // Import the Swagger configuration

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const allowedOrigins = [
//   `http://localhost:${process.env.PORT || 8000}`, // Backend
//   `http://localhost:${process.env.FRONT_END_PORT || 5173}`, // Frontend
// ];
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://accounting-stock-system-front-end.onrender.com", // Replace with your Vercel URL
        "https://accounting-stock-system-backend.onrender.com", // Replace with your Render URL
      ]
    : [
        `http://localhost:${process.env.PORT || 8000}`,
        `http://localhost:${process.env.FRONT_END_PORT || 5173}`,
      ];

// Middleware to verify JWT token in request headers
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded; // Attach decoded user data to request object
    next();
  });
};

// Apply middleware globally or to protected routes

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Unauthorized: No token provided" });
//   }
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: Invalid token" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true, // Allow cookies and headers
//   })
// );
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = ["http://localhost:8000", "http://localhost:5173"];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     exposedHeaders: ["Set-Cookie"], // Expose Set-Cookie to frontend
//   })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

io.use((socket, next) => {
  const origin = socket.handshake.headers.origin;
  if (allowedOrigins.includes(origin)) {
    next();
  } else {
    next(new Error("CORS not allowed"));
  }
});

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    startCronJob();
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Auth routes
app.use("/api/auth", authRouter);

// Role routes
app.use("/api/roles", roleRouter);

// Category routes
app.use("/api/categories", categoryRouter);

// Payment method routes
app.use("/api/payment-methods", paymentMethodRouter);

// Dishes routes
app.use("/api/dishes", dishRouter);

// Payment method routes
app.use("/api/sales", salesRouter);

// Hall routes
app.use("/api/hall-transactions", hallRouter);

// UnifiedSales routes
app.use("/api/unified-sales", unifiedSleaRouter);

// Laundry routes
app.use("/api/laundry", laundryRouter);

//LaundryService
app.use("/api/laundry-services", laundryServiceRouter);

//Order Item
app.use("/api/order-items", orderItemsRouter);

//Seminar
app.use("/api/seminars", seminarsRouter);

//Kabasa
app.use("/api/kabasa", kabasaRouter);

//Front Office
app.use("/api/front-office-sales", frontOfficeRouter);

//Hall Types
app.use("/api/hall-types", hallTypesRouter);

//Suppliers
app.use("/api/suppliers", supplierRouter);

// Product routes
app.use("/api/products", productRouter); // Use the product router

// Another Unified routes
app.use("/api/anotherunifiedsales", anotherUnifiedSalesRouter);

// Aggregate Sales routes
app.use("/api/aggregate-sales", aggregateSalesRouter);

// Location routes
app.use("/api/locations", locationRouter);

// Inventory routes
app.use("/api/inventories", inventoryRouter);

// Alerts routes
app.use("/api/alerts", alertsRouter);

// AuditlOG routes
app.use("/api/auditlogs", auditLogRouter);

// Inventory Adjustment routes
app.use("/api/inventoryadjustments", inventoryAdjustmentRouter);

// Purchase Order routes
app.use("/api/purchaseorders", purchaseOrderRouter);

// Stock Movement routes
app.use("/api/stockmovements", stockMovementRouter);

// Sales Transaction routes
app.use("/api/trackinventories", salesTransactionRouter);

// Sales Transaction routes
app.use("/api/permissions", permissionRouter);

// Stock Transfer routes

// Example protected route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Message from the server" });
});

// Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Configure Socket.IO CORS and error handling
io.use((socket, next) => {
  let origin = socket.handshake.headers.origin;
  if (allowedOrigins.includes(origin)) {
    next();
  } else {
    next(new Error("CORS not allowed"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Example: Subscribe to inventory updates
  socket.on("subscribeToInventory", (userId) => {
    try {
      socket.join(userId);
      console.log(`User ${userId} subscribed to inventory updates`);
    } catch (error) {
      console.error("Error subscribing to inventory:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Handle errors in socket communication
  socket.on("error", (error) => {
    console.error("Socket.IO Error:", error);
  });
});

// Start the server
// app.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
// });
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  // Use server instead of app
  console.log(`Server running on http://localhost:${PORT}`);
});
