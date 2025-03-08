// const mongoose = require("mongoose");
// const Inventory = require("../models/inventoryModel");
// const cron = require("node-cron");
// const {
//   checkInventoryAlerts: checkInventoryAlertsFunc,
//   saveAlerts,
//   generatePurchaseOrder: generatePurchaseOrderFunc,
// } = require("../controllers/inventoryController");
// const { sendEmail } = require("../middlewares/sendMail");
// const { sendPushNotification } = require("../services/notificationService");

// // Define the function as an async function for checking inventory
// async function checkAndProcessInventory() {
//   try {
//     const inventories = await Inventory.find().populate("stockKeeper");

//     for (const inventory of inventories) {
//       const alerts = await checkInventoryAlertsFunc(inventory);

//       if (alerts.length > 0) {
//         // Generate purchase order for low stock alerts
//         for (const alert of alerts) {
//           if (alert.type === "lowStock") {
//             await generatePurchaseOrderFunc(inventory); // This is correct
//           }
//         }

//         // Send email to the stock keeper who created this inventory
//         if (inventory.stockKeeper && inventory.stockKeeper.email) {
//           for (const alert of alerts) {
//             await sendEmail(
//               inventory.stockKeeper.email,
//               `Alert: ${alert.type}`,
//               alert.message
//             );
//           }
//         } else {
//           console.log(
//             "No email available for stock keeper of inventory:",
//             inventory.name
//           );
//         }

//         // Send push notifications (if you have this implemented)
//         if (inventory.stockKeeper && inventory.stockKeeper._id) {
//           const deviceTokens = await getDeviceTokensForUser(
//             inventory.stockKeeper._id
//           ); // This function should be implemented
//           if (deviceTokens && deviceTokens.length > 0) {
//             for (const token of deviceTokens) {
//               await sendPushNotification(
//                 token,
//                 "Inventory Alert",
//                 alerts[0].message
//               ); // Assuming one message for simplicity
//             }
//           }
//         }

//         await saveAlerts(alerts);
//       }
//     }
//   } catch (error) {
//     console.error("Error in inventory check:", error);
//   }
// }

// // Helper function to get device tokens (you need to implement this based on your token management system)
// async function getDeviceTokensForUser(userId) {
//   // This is a placeholder. Implement based on how you store or retrieve device tokens
//   // Example:
//   // const user = await User.findById(userId);
//   // return user.deviceTokens || [];
//   return []; // Return an empty array if not implemented yet
// }

// // Function to start the cron job
// function startCronJob() {
//   cron.schedule("* * * * * ", checkAndProcessInventory); // For testing, change for production
//   console.log(
//     "Cron job for inventory check has been scheduled to run every minute."
//   );
// }

// // Export the function to start the cron job
// module.exports = { startCronJob };

// const mongoose = require("mongoose");
// const Inventory = require("../models/inventoryModel");
// const cron = require("node-cron");
// const {
//   checkInventoryAlerts: checkInventoryAlertsFunc,
//   saveAlerts,
//   generatePurchaseOrder: generatePurchaseOrderFunc,
// } = require("../controllers/inventoryController");
// const { sendEmail } = require("../middlewares/sendMail"); // Ensure correct import
// const { sendPushNotification } = require("../services/notificationService");

// // Define the function as an async function for checking inventory
// async function checkAndProcessInventory() {
//   try {
//     const inventories = await Inventory.find().populate("stockKeeper");

//     for (const inventory of inventories) {
//       const alerts = await checkInventoryAlertsFunc(inventory);

//       if (alerts.length > 0) {
//         // Generate purchase order for low stock alerts
//         for (const alert of alerts) {
//           if (alert.type === "lowStock") {
//             await generatePurchaseOrderFunc(inventory); // This is correct
//           }
//         }

//         // Send email to the stock keeper who created this inventory
//         if (inventory.stockKeeper && inventory.stockKeeper.email) {
//           for (const alert of alerts) {
//             await sendEmail(
//               inventory.stockKeeper.email,
//               `Alert: ${alert.type}`,
//               alert.message
//             );
//           }
//         } else {
//           console.log(
//             "No email available for stock keeper of inventory:",
//             inventory.name
//           );
//         }

//         // Send push notifications (if you have this implemented)
//         if (inventory.stockKeeper && inventory.stockKeeper._id) {
//           const deviceTokens = await getDeviceTokensForUser(
//             inventory.stockKeeper._id
//           ); // This function should be implemented
//           if (deviceTokens && deviceTokens.length > 0) {
//             for (const token of deviceTokens) {
//               await sendPushNotification(
//                 token,
//                 "Inventory Alert",
//                 alerts[0].message
//               ); // Assuming one message for simplicity
//             }
//           }
//         }

//         await saveAlerts(alerts);
//       }
//     }
//   } catch (error) {
//     console.error("Error in inventory check:", error);
//   }
// }

// // Helper function to get device tokens (you need to implement this based on your token management system)
// async function getDeviceTokensForUser(userId) {
//   // This is a placeholder. Implement based on how you store or retrieve device tokens
//   // Example:
//   // const user = await User.findById(userId);
//   // return user.deviceTokens || [];
//   return []; // Return an empty array if not implemented yet
// }

// // Function to start the cron job
// function startCronJob() {
//   cron.schedule("* * * * *", checkAndProcessInventory); // For testing, change for production
//   console.log(
//     "Cron job for inventory check has been scheduled to run every 1 hour."
//   );
// }

// // Export the function to start the cron job
// module.exports = { startCronJob };

// const mongoose = require("mongoose");
// const Inventory = require("../models/inventoryModel");
// const cron = require("node-cron");
// const {
//   checkInventoryAlerts: checkInventoryAlertsFunc,
//   saveAlerts,
//   generatePurchaseOrder: generatePurchaseOrderFunc,
// } = require("../controllers/inventoryController");
// const { sendEmail } = require("../middlewares/sendMail");
// const { sendPushNotification } = require("../services/notificationService");

// async function checkAndProcessInventory() {
//   try {
//     console.log("Starting inventory check...");
//     const inventories = await Inventory.find().populate("stockKeeper");
//     console.log(`Found ${inventories.length} inventory items`);

//     for (const inventory of inventories) {
//       const alerts = await checkInventoryAlertsFunc(inventory);
//       console.log(`Alerts for ${inventory.name}:`, alerts);

//       if (alerts.length > 0) {
//         for (const alert of alerts) {
//           if (alert.type === "lowStock") {
//             console.log(`Generating PO for ${inventory.name}`);
//             await generatePurchaseOrderFunc(inventory);
//             console.log(`PO generated for ${inventory.name}`);
//           }
//         }

//         if (inventory.stockKeeper && inventory.stockKeeper.email) {
//           console.log(
//             `Preparing to send email to: ${inventory.stockKeeper.email}`
//           );
//           for (const alert of alerts) {
//             await sendEmail(
//               inventory.stockKeeper.email,
//               `Alert: ${alert.type}`,
//               alert.message
//             );
//           }
//         } else {
//           console.log(
//             "No email available for stock keeper of inventory:",
//             inventory.name
//           );
//         }

//         if (inventory.stockKeeper && inventory.stockKeeper._id) {
//           const deviceTokens = await getDeviceTokensForUser(
//             inventory.stockKeeper._id
//           );
//           if (deviceTokens && deviceTokens.length > 0) {
//             for (const token of deviceTokens) {
//               await sendPushNotification(
//                 token,
//                 "Inventory Alert",
//                 alerts[0].message
//               );
//             }
//           }
//         }

//         await saveAlerts(alerts);
//       }
//     }
//     console.log("Inventory check completed");
//   } catch (error) {
//     console.error("Error in inventory check:", error);
//   }
// }

// async function getDeviceTokensForUser(userId) {
//   return []; // Placeholder
// }

// function startCronJob() {
//   // cron.schedule("0 * * * *", checkAndProcessInventory); // Runs hourly
//   cron.schedule("0 * * * *", checkAndProcessInventory); // Runs every minute for testing
//   console.log(
//     "Cron job for inventory check has been scheduled to run every minute."
//   );
// }

// module.exports = { startCronJob, checkAndProcessInventory }; // Export for manual testing

const mongoose = require("mongoose");
const Inventory = require("../models/inventoryModel");
const cron = require("node-cron");
const {
  checkInventoryAlerts: checkInventoryAlertsFunc,
  saveAlerts,
  generatePurchaseOrder: generatePurchaseOrderFunc,
} = require("../controllers/inventoryController");
const { sendEmail } = require("../middlewares/sendMail");
const { sendPushNotification } = require("../services/notificationService");

async function checkAndProcessInventory() {
  try {
    console.log("Starting inventory check...");
    const inventories = await Inventory.find().populate("stockKeeper");
    console.log(`Found ${inventories.length} inventory items`);

    for (const inventory of inventories) {
      const alerts = await checkInventoryAlertsFunc(inventory);
      console.log(`Alerts for ${inventory.name}:`, alerts);

      if (alerts.length > 0) {
        for (const alert of alerts) {
          if (alert.type === "lowStock") {
            console.log(`Generating PO for ${inventory.name}`);
            await generatePurchaseOrderFunc(inventory);
            console.log(`PO generated for ${inventory.name}`);
          }
        }

        if (inventory.stockKeeper && inventory.stockKeeper.email) {
          console.log(`Stock Keeper Email: ${inventory.stockKeeper.email}`);
          for (const alert of alerts) {
            console.log(
              `Sending email for ${inventory.name} to: ${inventory.stockKeeper.email}`
            );
            await sendEmail(
              inventory.stockKeeper.email,
              `Alert: ${alert.type}`,
              alert.message
            );
          }
        } else {
          console.log(
            "No email available for stock keeper of inventory:",
            inventory.name
          );
        }

        if (inventory.stockKeeper && inventory.stockKeeper._id) {
          const deviceTokens = await getDeviceTokensForUser(
            inventory.stockKeeper._id
          );
          if (deviceTokens && deviceTokens.length > 0) {
            for (const token of deviceTokens) {
              await sendPushNotification(
                token,
                "Inventory Alert",
                alerts[0].message
              );
            }
          }
        }

        await saveAlerts(alerts);
      }
    }
    console.log("Inventory check completed");
  } catch (error) {
    console.error("Error in inventory check:", error);
  }
}

async function getDeviceTokensForUser(userId) {
  return [];
}

function startCronJob() {
  cron.schedule("0 * * * *", checkAndProcessInventory); // Runs hourly
  console.log(
    "Cron job for inventory check has been scheduled to run every hour."
  );
}

module.exports = { startCronJob, checkAndProcessInventory };
