const mongoose = require("mongoose"); // Make sure this is at the top of your file
const User = require("../models/userModel"); // Ensure correct path to your model
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const {
  signupSchema,
  signinSchema,
  acceptCodeSchema,
  changePasswordSchema,
  acceptFPCodeSchema,
  updateProfileSchema,
  updateImageSchema,
  updateUserSchema,
  forgotPasswordSchema,
} = require("../middlewares/validator");
const { sendEmail } = require("../middlewares/sendMail");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const { doHash, doHashValidation, hmacProcess } = require("../utils/hashing");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_CHANGED_NOTIFICATION_TEMPLATE,
  FORGOT_PASSWORD_EMAIL_TEMPLATE,
  FORGOT_PASSWORD_HTML_TEMPLATE,
} = require("../mailtrap/emailTemplates");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.signup = async (req, res) => {
  const { email, password, phoneNumber, fullName, roles = ["user"] } = req.body;

  try {
    const { error } = signupSchema.validate(
      { email, password, phoneNumber, fullName, roles },
      { abortEarly: false }
    );
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists!" });
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res
        .status(409)
        .json({ success: false, message: "Phone Number already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Validate role _ids
    const roleIdsPromises = roles.map(async (roleId) => {
      const role = await Role.findById(roleId);
      if (!role) {
        throw new Error(`Role with ID '${roleId}' does not exist`);
      }
      return role._id;
    });

    let roleIds;
    try {
      roleIds = await Promise.all(roleIdsPromises);
    } catch (roleError) {
      return res.status(400).json({
        success: false,
        message: roleError.message,
      });
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      phoneNumber,
      fullName,
      roles: roleIds,
    });

    const result = await newUser.save();
    const userWithRoles = await User.findById(result._id).populate(
      "roles",
      "name permissions"
    );
    userWithRoles.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully",
      result: userWithRoles,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
      details: error.errors || error.stack,
    });
  }
};

// Helper function to send verification code (extracted from sendVerificationCode)
const sendCodeToUser = async (user) => {
  const codeExpirationLimit = 15 * 60 * 1000; // 15 minutes

  if (
    user.verificationCodeValidation &&
    Date.now() - user.verificationCodeValidation < codeExpirationLimit
  ) {
    console.log("Existing code still valid for:", user.email);
    return {
      success: true,
      message: "Existing verification code is still valid.",
      codeSent: false,
    };
  }

  const codeValue = Math.floor(100000 + Math.random() * 900000);
  console.log("Generating new code for:", user.email, "Code:", codeValue);

  const plainText = `Your verification code is: ${codeValue}. This code expires in 15 minutes.`;
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    codeValue
  ).replace("{fullName}", user.fullName || "User");

  try {
    const info = await sendEmail(
      user.email,
      "Verification Code",
      plainText, // Plain text fallback
      htmlContent // HTML version
    );
    console.log("Email sent successfully:", info);

    const hashedCodeValue = crypto
      .createHmac("sha256", process.env.HMAC_VERIFICATION_CODE_SECRET)
      .update(codeValue.toString())
      .digest("hex");

    user.verificationCode = hashedCodeValue;
    user.verificationCodeValidation = Date.now();
    await user.save();
    console.log("User updated with new code:", user.email);
    return {
      success: true,
      message: "Verification code sent!",
      codeSent: true,
    };
  } catch (emailError) {
    console.error("Failed to send verification code:", emailError);
    return {
      success: false,
      message: "Failed to send verification code due to email service error.",
    };
  }
};

// exports.signin = async (req, res) => {
//   const { emailOrPhone, password } = req.body;

//   try {
//     const { error } = signinSchema.validate({ emailOrPhone, password });
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }

//     const existingUser = await User.findOne({
//       $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
//     })
//       .select(
//         "+password +loginAttempts +isLocked +status +verified +verificationCode +verificationCodeValidation"
//       )
//       .populate("roles", "name permissions");

//     if (!existingUser) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User does not exist!" });
//     }

//     if (existingUser.status !== "active") {
//       return res.status(403).json({
//         success: false,
//         message: `Account is ${
//           existingUser.status === "inactive"
//             ? "inactive"
//             : "suspended or deleted"
//         }`,
//       });
//     }

//     if (existingUser.isLocked) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Account locked" });
//     }

//     const isPasswordValid = await bcrypt.compare(
//       password,
//       existingUser.password
//     );
//     if (!isPasswordValid) {
//       existingUser.loginAttempts += 1;
//       if (existingUser.loginAttempts >= 4) {
//         existingUser.isLocked = true;
//         await existingUser.save();
//         return res
//           .status(403)
//           .json({ success: false, message: "Account locked" });
//       }
//       await existingUser.save();
//       return res.status(401).json({
//         success: false,
//         message: `Invalid credentials! ${
//           4 - existingUser.loginAttempts
//         } attempt(s) left`,
//       });
//     }

//     // Update lastLogin and loginHistory on successful login
//     existingUser.loginAttempts = 0;
//     existingUser.lastLogin = new Date(); // Set to current time
//     existingUser.loginHistory.push({
//       timestamp: new Date(),
//       ip: req.ip || "Unknown", // Get IP from request
//       device: req.headers["user-agent"] || "Unknown", // Get device from User-Agent header
//     });
//     await existingUser.save();

//     if (!existingUser.verified) {
//       const codeResult = await sendCodeToUser(existingUser);
//       if (!codeResult.success) {
//         return res.status(500).json({
//           success: false,
//           message: codeResult.message,
//           redirectTo: "/verification-page",
//           email: existingUser.email,
//         });
//       }
//       return res.status(202).json({
//         success: true,
//         message: codeResult.message,
//         action: "redirect",
//         redirectTo: "/verification-page",
//         email: existingUser.email,
//         codeSent: codeResult.codeSent,
//       });
//     }

//     const userRoles = existingUser.roles.map((role) => ({
//       name: role.name,
//       permissions: role.permissions || [],
//     }));

//     const accessToken = jwt.sign(
//       {
//         userId: existingUser._id,
//         email: existingUser.email,
//         fullName: existingUser.fullName,
//         verified: existingUser.verified,
//         status: existingUser.status,
//         roles: userRoles,
//       },
//       process.env.TOKEN_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.cookie("Authorization", "Bearer " + accessToken, {
//       expires: new Date(Date.now() + 15 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Lax",
//       path: "/",
//     });

//     return res.json({
//       success: true,
//       email: existingUser.email,
//       fullName: existingUser.fullName,
//       verified: existingUser.verified,
//       status: existingUser.status,
//       roles: userRoles,
//     });
//   } catch (error) {
//     console.error("Signin error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       details: error.message,
//     });
//   }
// };
exports.signin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const { error } = signinSchema.validate({ emailOrPhone, password });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    })
      .select(
        "+password +loginAttempts +isLocked +status +verified +verificationCode +verificationCodeValidation"
      )
      .populate("roles", "name permissions");

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist!" });
    }

    if (existingUser.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Account is ${
          existingUser.status === "inactive"
            ? "inactive"
            : "suspended or deleted"
        }`,
      });
    }

    if (existingUser.isLocked) {
      return res
        .status(403)
        .json({ success: false, message: "Account locked" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      existingUser.loginAttempts += 1;
      if (existingUser.loginAttempts >= 4) {
        existingUser.isLocked = true;
        await existingUser.save();
        return res
          .status(403)
          .json({ success: false, message: "Account locked" });
      }
      await existingUser.save();
      return res.status(401).json({
        success: false,
        message: `Invalid credentials! ${
          4 - existingUser.loginAttempts
        } attempt(s) left`,
      });
    }

    existingUser.loginAttempts = 0;
    existingUser.lastLogin = new Date();
    existingUser.loginHistory.push({
      timestamp: new Date(),
      ip: req.ip || "Unknown",
      device: req.headers["user-agent"] || "Unknown",
    });
    await existingUser.save();

    if (!existingUser.verified) {
      const codeResult = await sendCodeToUser(existingUser);
      if (!codeResult.success) {
        return res.status(500).json({
          success: false,
          message: codeResult.message,
          redirectTo: "/verification-page",
          email: existingUser.email,
        });
      }
      return res.status(202).json({
        success: true,
        message: codeResult.message,
        action: "redirect",
        redirectTo: "/verification-page",
        email: existingUser.email,
        codeSent: codeResult.codeSent,
      });
    }

    const userRoles = existingUser.roles.map((role) => ({
      name: role.name,
      permissions: role.permissions || [],
    }));

    const accessToken = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        fullName: existingUser.fullName,
        verified: existingUser.verified,
        status: existingUser.status,
        roles: userRoles,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Optional: Keep the cookie if you want dual support (header + cookie)
    res.cookie("Authorization", "Bearer " + accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    // Return token in response body
    return res.json({
      success: true,
      token: accessToken, // Add this
      email: existingUser.email,
      fullName: existingUser.fullName,
      verified: existingUser.verified,
      status: existingUser.status,
      roles: userRoles,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

exports.signout = async (req, res) => {
  try {
    res
      .clearCookie("Authorization") // Clear the cookie
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required!",
    });
  }

  try {
    console.log("Checking user for email:", email);
    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }

    if (existingUser.verified) {
      return res.status(400).json({
        success: false,
        message: "You are already verified!",
      });
    }

    const result = await sendCodeToUser(existingUser);
    return res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in sendVerificationCode:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

exports.verifyVerificationCode = async (req, res) => {
  const { email, providedCode } = req.body;

  try {
    // Validate input
    const { error } = acceptCodeSchema.validate({ email, providedCode });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Find user
    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    }

    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "You are already verified!" });
    }

    // Verify code existence and expiration
    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res
        .status(400)
        .json({ success: false, message: "No verification code found!" });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 15 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code has expired!" });
    }

    // Verify code
    const hashedCodeValue = hmacProcess(
      providedCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    if (hashedCodeValue !== existingUser.verificationCode) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code!" });
    }

    // Update user status
    existingUser.verified = true;
    existingUser.verificationCode = undefined;
    existingUser.verificationCodeValidation = undefined;
    await existingUser.save();

    // --- SEND WELCOME EMAIL ---
    try {
      // Prepare HTML content
      let htmlContent = WELCOME_EMAIL_HTML_TEMPLATE.replace(
        "{userName}",
        existingUser.firstName || "User"
      );

      // Send HTML-only email
      await sendEmail(
        existingUser.email,
        "Welcome to My Awesome App!",
        undefined, // No plain text
        htmlContent // HTML only
      );
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }
    // --- END SEND WELCOME EMAIL ---

    return res.status(200).json({
      success: true,
      message: "Your account has been verified!",
    });
  } catch (error) {
    console.error("Error in verifyVerificationCode:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.changePassword = async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  const { userId, verified } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    const { error } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    if (!verified) {
      return res
        .status(401)
        .json({ success: false, message: "You are not a verified user!" });
    }

    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist!" });
    }

    const isPasswordValid = await doHashValidation(
      oldPassword,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// exports.sendForgotPasswordCode = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       // Security: Don't reveal if the email is not in the system
//       return res.status(200).json({
//         success: true,
//         message:
//           "If that email address is in our system, we have sent you a code to reset your password.",
//       });
//     }

//     const codeValue = Math.floor(Math.random() * 1000000)
//       .toString()
//       .padStart(6, "0"); // Ensure 6 digits
//     let info = await transport.sendMail({
//       from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
//       to: existingUser.email,
//       subject: "Forgot Password Code",
//       html: `<h1>Your Forgot Password Code: ${codeValue}</h1>`,
//     });

//     if (info.accepted.includes(existingUser.email)) {
//       // Use includes for multiple accepted emails if needed
//       const hashedCodeValue = hmacProcess(
//         codeValue,
//         process.env.HMAC_VERIFICATION_CODE_SECRET
//       );
//       existingUser.forgotPasswordCode = hashedCodeValue;
//       existingUser.forgotPasswordCodeValidation = Date.now();
//       await existingUser.save();
//       return res.status(200).json({
//         success: true,
//         message: "Password reset code has been sent to your email.",
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       message: "Failed to send the password reset code. Please try again.",
//     });
//   } catch (error) {
//     console.error("Error in sendForgotPasswordCode:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while sending the password reset code.",
//     });
//   }
// };
// exports.sendForgotPasswordCode = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Validate the email
//     const { error } = forgotPasswordSchema.validate({ email });
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }
//     const existingUser = await User.findOne({ email });

//     if (!existingUser) {
//       // Security Best Practice:  Don't reveal whether the email exists.
//       return res.status(200).json({
//         // NOTE: 200 OK, even if not found!
//         success: true,
//         message:
//           "If that email address is in our system, we have sent you a code to reset your password.",
//       });
//     }

//     // Generate a random 6-digit code
//     const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

//     const hashedCode = hmacProcess(
//       codeValue,
//       process.env.HMAC_VERIFICATION_CODE_SECRET
//     );

//     // Set/update forgotPasswordCode and forgotPasswordCodeValidation
//     existingUser.forgotPasswordCode = hashedCode;
//     existingUser.forgotPasswordCodeValidation = Date.now(); // Set validation time
//     await existingUser.save();

//     // Prepare email content using the template:
//     let emailContent = FORGOT_PASSWORD_EMAIL_TEMPLATE.replace(
//       "{userName}",
//       existingUser.firstName || "User"
//     ) // Use first name, fallback to "User"
//       .replace("{resetCode}", codeValue) // Use the *plain text* code
//       .replace("{contactURL}", "http://localhost:5173/login") // Replace with YOUR contact URL
//       .replace(/\[Your App Name]/g, "Sokoto Guest Inn"); // Replace with YOUR app name.  /g is for global replacement.

//     // Send the email
//     await transport.sendEmail(
//       existingUser.email,
//       "Password Reset Request",
//       emailContent
//     );

//     res.status(200).json({
//       success: true,
//       message: "Password reset code has been sent to your email.", // Consistent message
//     });
//   } catch (error) {
//     console.error("Error in sendForgotPasswordCode:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to send forgot password code", // Use a generic message
//     });
//   }
// };

// exports.sendForgotPasswordCode = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Validate the email
//     const { error } = forgotPasswordSchema.validate({ email });
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }
//     const existingUser = await User.findOne({ email });

//     if (!existingUser) {
//       return res.status(200).json({
//         success: true,
//         message:
//           "If that email address is in our system, we have sent you a code to reset your password.",
//       });
//     }

//     // Generate a random 6-digit code
//     const codeValue = Math.floor(100000 + Math.random() * 900000).toString();
//     const hashedCode = hmacProcess(
//       codeValue,
//       process.env.HMAC_VERIFICATION_CODE_SECRET
//     );

//     // Update user with forgot password code and timestamp
//     existingUser.forgotPasswordCode = hashedCode;
//     existingUser.forgotPasswordCodeValidation = Date.now();
//     await existingUser.save();

//     // Prepare HTML email content
//     const htmlContent = FORGOT_PASSWORD_HTML_TEMPLATE.replace(
//       "{userName}",
//       existingUser.fullName || "User"
//     )
//       .replace("{resetCode}", codeValue)
//       .replace("{contactURL}", "http://localhost:5173/login");

//     // Plain text fallback
//     const textContent = `Hello ${
//       existingUser.fullName || "User"
//     },\n\nWe received a request to reset your password. Use the code below to proceed:\n\n${codeValue}\n\nThis code expires in 15 minutes. If you didn’t request this, ignore this email or contact us at http://localhost:5173/login.\n\n© 2025 Sokoto Guest Inn`;

//     // Send the email using the sendEmail utility
//     await sendEmail(
//       existingUser.email,
//       "Password Reset Request - Sokoto Guest Inn",
//       textContent,
//       htmlContent
//     );

//     res.status(200).json({
//       success: true,
//       message: "Password reset code has been sent to your email.",
//     });
//   } catch (error) {
//     console.error("Error in sendForgotPasswordCode:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to send forgot password code",
//     });
//   }
// };
exports.sendForgotPasswordCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate the email
    const { error } = forgotPasswordSchema.validate({ email });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(200).json({
        success: true,
        message:
          "If that email address is in our system, we have sent you a link to reset your password.",
      });
    }

    // Generate a unique token
    const token = uuidv4(); // e.g., "550e8400-e29b-41d4-a716-446655440000"
    const hashedToken = hmacProcess(
      token,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    // Update user with token and timestamp
    existingUser.forgotPasswordCode = hashedToken; // Reuse this field
    existingUser.forgotPasswordCodeValidation = Date.now();
    await existingUser.save();

    // Construct the reset URL
    const resetUrl = `http://localhost:5173/reset-password?token=${encodeURIComponent(
      token
    )}`;

    // Prepare HTML email content
    const htmlContent = FORGOT_PASSWORD_HTML_TEMPLATE.replace(
      "{userName}",
      existingUser.fullName || "User"
    )
      .replace("{resetUrl}", resetUrl)
      .replace("{contactURL}", "http://localhost:5173/login");

    // Plain text fallback
    const textContent = `Hello ${
      existingUser.fullName || "User"
    },\n\nWe received a request to reset your password. Click the link below to proceed:\n\n${resetUrl}\n\nThis link expires in 15 minutes. If you didn’t request this, ignore this email or contact us at http://localhost:5173/login.\n\n© 2025 Sokoto Guest Inn`;

    // Send the email
    await sendEmail(
      existingUser.email,
      "Password Reset Request - Sokoto Guest Inn",
      textContent,
      htmlContent
    );

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in sendForgotPasswordCode:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send reset link",
    });
  }
};

// exports.verifyForgotPasswordCode = async (req, res) => {
//   const { email, providedCode, newPassword } = req.body;
//   try {
//     const { error } = acceptFPCodeSchema.validate({
//       email,
//       providedCode,
//       newPassword,
//     });
//     if (error) {
//       return res
//         .status(401)
//         .json({ success: false, message: error.details[0].message });
//     }

//     const codeValue = providedCode.toString();
//     const existingUser = await User.findOne({ email }).select(
//       "+forgotPasswordCode +forgotPasswordCodeValidation"
//     );

//     if (!existingUser) {
//       // Security: Don't reveal if the email is not in the system
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid email or code." });
//     }

//     // Log user data for debugging
//     console.log("User data:", {
//       email: existingUser.email,
//       forgotPasswordCode: existingUser.forgotPasswordCode
//         ? "[HASHED]"
//         : "Not set",
//       forgotPasswordCodeValidation:
//         existingUser.forgotPasswordCodeValidation || "Not set",
//     });

//     // Check if both fields are set
//     if (
//       existingUser.forgotPasswordCode === undefined ||
//       existingUser.forgotPasswordCodeValidation === undefined
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No reset code found!" });
//     }

//     // Check code expiration
//     if (
//       Date.now() - existingUser.forgotPasswordCodeValidation >
//       5 * 60 * 1000
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Reset code has expired!" });
//     }

//     // Verify the provided code
//     const hashedCodeValue = hmacProcess(
//       codeValue,
//       process.env.HMAC_VERIFICATION_CODE_SECRET
//     );

//     if (hashedCodeValue === existingUser.forgotPasswordCode) {
//       // Hash new password
//       const hashedPassword = await doHash(newPassword, 12);
//       existingUser.password = hashedPassword;

//       // Clear reset code and validation time after successful reset
//       existingUser.forgotPasswordCode = undefined;
//       existingUser.forgotPasswordCodeValidation = undefined;
//       await existingUser.save();

//       // --- SEND PASSWORD CHANGED NOTIFICATION EMAIL ---
//       try {
//         let emailContent = PASSWORD_CHANGED_NOTIFICATION_TEMPLATE.replace(
//           "{userName}",
//           existingUser.fullName || "User"
//         ); //  default
//         emailContent = emailContent.replace(
//           "{contactURL}",
//           "http://localhost:5173/login"
//         ); //  your contact URL
//         emailContent = emailContent.replace(
//           /\[Your App Name]/g,
//           "My Awesome App"
//         );

//         await sendEmail(
//           existingUser.email,
//           "Your Password Has Been Changed", //  subject line
//           emailContent
//         );
//       } catch (emailError) {
//         console.error(
//           "Error sending password changed notification email:",
//           emailError
//         );
//         //  add a flag to the user document to indicate failure.
//       }
//       // --- END SEND EMAIL ---

//       return res
//         .status(200)
//         .json({ success: true, message: "Password updated successfully!" });
//     }
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid reset code!" });
//   } catch (error) {
//     console.error("Error in verifyForgotPasswordCode:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// };
exports.verifyForgotPasswordCode = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Validate input (update your acceptFPCodeSchema to { token, newPassword })
    const { error } = acceptFPCodeSchema.validate({ token, newPassword });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // Find user by token
    const hashedToken = hmacProcess(
      token,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    const existingUser = await User.findOne({
      forgotPasswordCode: hashedToken,
    }).select("+forgotPasswordCode +forgotPasswordCodeValidation");

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // Check if fields are set
    if (
      existingUser.forgotPasswordCode === undefined ||
      existingUser.forgotPasswordCodeValidation === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "No reset token found!" });
    }

    // Check expiration (15 minutes)
    if (
      Date.now() - existingUser.forgotPasswordCodeValidation >
      15 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Reset token has expired!" });
    }

    // Hash new password
    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;

    // Invalidate the token after use
    existingUser.forgotPasswordCode = undefined;
    existingUser.forgotPasswordCodeValidation = undefined;
    await existingUser.save();

    // Send password changed notification
    try {
      let emailContent = PASSWORD_CHANGED_NOTIFICATION_TEMPLATE.replace(
        "{userName}",
        existingUser.fullName || "User"
      )
        .replace("{contactURL}", "http://localhost:5173/login")
        .replace(/\[Your App Name]/g, "Sokoto Guest Inn");

      await sendEmail(
        existingUser.email,
        "Your Password Has Been Changed",
        emailContent
      );
    } catch (emailError) {
      console.error(
        "Error sending password changed notification email:",
        emailError
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error in verifyForgotPasswordCode:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.updateProfileInfo = async (req, res) => {
  const { userId } = req.user;
  const updateData = req.body;

  try {
    const { error } = updateProfileSchema.validate(updateData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating profile." });
  }
};

// exports.updateProfileImage = async (req, res) => {
//   console.log("User from middleware:", req.user); // Log to check if user data is set
//   const { userId } = req.user || {};
//   const file = req.file;

//   try {
//     if (!file) {
//       console.log("No file was uploaded.");
//       return res.status(400).json({
//         success: false,
//         message: "No file was uploaded.",
//       });
//     }

//     console.log("File details:", file);
//     console.log("User ID:", userId);

//     if (!userId) {
//       console.log("User ID is undefined, cannot proceed with update.");
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found or update failed." });
//     }

//     // Use allowUnknown to ignore properties not in schema
//     const { error } = updateImageSchema.validate(
//       { profileImage: file },
//       { allowUnknown: true }
//     );
//     if (error) {
//       console.log("Validation error:", error.details);
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((detail) => detail.message).join(", "),
//       });
//     }

//     // Here you might handle image storage, like uploading to S3 and returning a URL
//     const imageUrl = `/uploads/${file.filename}`; // Placeholder for where the image would be stored
//     console.log("Image URL to be saved:", imageUrl);

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profileImage: imageUrl },
//       { new: true, runValidators: true }
//     );
//     if (!updatedUser) {
//       console.log("User not updated:", userId);
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found or update failed." });
//     }

//     console.log("User updated successfully:", updatedUser);
//     res.json({ success: true, user: updatedUser });
//   } catch (error) {
//     console.error("Error updating profile image:", error);
//     console.error("Error stack:", error.stack);
//     res
//       .status(500)
//       .json({ success: false, message: "Error updating profile image." });
//   }
// };

exports.updateProfileImage = async (req, res) => {
  try {
    // Check for authenticated user
    if (!req.user?.userId) {
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user found" });
    }

    // Check if file is provided by multer
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    // Upload to Cloudinary
    let photoUrl;
    try {
      photoUrl = await cloudinary.uploader.upload(file.path, {
        folder: "profile_images", // Store in a specific Cloudinary folder
        width: 500, // Optional: resize image
        height: 500,
        crop: "limit",
        quality: "auto", // Optimize quality
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res.status(500).json({
        success: false,
        message: "Error uploading image to Cloudinary",
        error: cloudinaryError.message,
      });
    }

    // Update user with Cloudinary URL
    const userId = req.user.userId;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: photoUrl.secure_url }, // Use secure_url from Cloudinary
      { new: true } // Return updated document
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Respond with updated user data
    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "fullName email phoneNumber roles createdAt isActive status verified"
    )
      .populate({
        path: "roles",
        select: "name _id",
      })
      .lean();

    res.status(200).json({
      success: true,
      data: users,
      message: "Users and roles fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// exports.fetchUserDetails = async (req, res) => {
//   try {
//     console.log("req.user:", req.user); // Debug middleware output
//     const userId = req.user?.id || req.user?.userId; // Handle both possibilities
//     if (!userId) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: No user ID found" });
//     }

//     const user = await User.findById(userId)
//       .select(
//         "fullName email phoneNumber roles createdAt profileImage lastLogin loginHistory verified status workMetrics"
//       )
//       .populate({
//         path: "roles",
//         select: "name -_id",
//       });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching user details",
//       details: error.message,
//     });
//   }
// };
exports.fetchUserDetails = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.redirect(302, "/login"); // Direct redirect
    }

    const user = await User.findById(userId)
      .select(
        "fullName email phoneNumber roles createdAt profileImage lastLogin loginHistory verified status workMetrics"
      )
      .populate({
        path: "roles",
        select: "name -_id",
      });

    if (!user) {
      return res.redirect(302, "/login");
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      details: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, phoneNumber, status, roles } = req.body;

    // Validate request body
    console.log("Request Body Before Validation:", req.body);
    console.log(
      "req.body.roles type check:",
      req.body.roles.map((r) => typeof r)
    );
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      console.log("Validation error details:", error.details);
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Fetch existing user record
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User record not found" });
    }

    // Resolve roles if provided
    let roleIds = user.roles; // Default to existing roles
    if (roles) {
      roleIds = await Promise.all(
        roles.map(async (roleId) => {
          const role = await Role.findById(roleId);
          if (!role) {
            throw new Error(`Role with ID '${roleId}' does not exist`);
          }
          return role._id;
        })
      );
    }

    // Update user record
    const updateData = {
      fullName: fullName || user.fullName,
      email: email || user.email,
      phoneNumber: phoneNumber || user.phoneNumber,
      status: status || user.status,
      roles: roleIds,
    };

    console.log("Update Data:", updateData);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("roles", "name permissions");

    if (!updatedUser) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update user" });
    }

    return res.status(200).json({
      success: true,
      message: "User record updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user record:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating user record: " + error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Error deleting user." });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: "Refresh token is required" });
  }

  try {
    // Find the user with the refresh token
    const existingUser = await User.findOne({ refreshToken });
    if (!existingUser) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Verify the refresh token (optional step, depends on how you're storing it)
    // You can also check the expiry if you prefer
    const newAccessToken = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "15m" } // Short-lived new access token
    );

    res.json({
      success: true,
      accessToken: newAccessToken,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getCurrentlyLoggedInUsers = async (req, res) => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    console.log("Fifteen minutes ago:", fifteenMinutesAgo);

    const currentlyLoggedInUsers = await User.countDocuments({
      lastLogin: { $gte: fifteenMinutesAgo },
      status: "active",
      isLocked: false,
    });

    console.log("Currently logged-in users count:", currentlyLoggedInUsers);

    res.status(200).json({
      success: true,
      data: { currentlyLoggedInUsers },
      message: "Total number of currently logged-in users fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching currently logged-in users:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getLoggedInToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); // Use UTC to avoid local time zone issues
    console.log("Start of day (UTC):", startOfDay);

    const loggedInToday = await User.countDocuments({
      lastLogin: { $gte: startOfDay },
      status: "active",
      isLocked: false,
    });

    console.log("Users logged in today count:", loggedInToday);

    res.status(200).json({
      success: true,
      data: { loggedInToday },
      message: "Total number of users logged in today fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching users logged in today:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getLoggedInToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); // Use UTC to avoid local time zone issues
    console.log("Start of day (UTC):", startOfDay);

    const loggedInToday = await User.countDocuments({
      lastLogin: { $gte: startOfDay },
      status: "active",
      isLocked: false,
    });

    console.log("Users logged in today count:", loggedInToday);

    res.status(200).json({
      success: true,
      data: { loggedInToday },
      message: "Total number of users logged in today fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching users logged in today:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getStaffTaskAchievements = async (req, res) => {
  try {
    // Step 1: Find the "staff" role's ObjectId
    const staffRole = await Role.findOne({ name: "staff" });
    if (!staffRole) {
      return res.status(404).json({
        success: false,
        message: "No 'staff' role found in the database",
      });
    }

    // Step 2: Query users with the "staff" role ObjectId
    // Since roles is an array of ObjectIds, use $in with the staffRole._id
    const staffAchievements = await User.find({
      roles: { $in: [staffRole._id] },
    })
      .select("fullName workMetrics.tasksCompleted")
      .populate("roles", "name") // Optional: for verification
      .sort({ "workMetrics.tasksCompleted": -1 })
      .limit(10)
      .lean();

    // Step 3: Handle no results gracefully
    if (!staffAchievements.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No staff found with task achievements",
      });
    }

    // Step 4: Map results to desired format
    const filteredStaff = staffAchievements.map((user) => ({
      fullName: user.fullName || "Unknown",
      tasksCompleted: user.workMetrics?.tasksCompleted || 0,
    }));

    res.status(200).json({
      success: true,
      data: filteredStaff,
      message: "Staff task achievements fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching staff task achievements:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getTotalUsers = async (req, res) => {
  try {
    // Use aggregation to count total, active, and inactive users based on status
    const userStats = await User.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }], // Total users (all statuses)
          activeUsers: [
            { $match: { status: "active" } }, // Filter active users
            { $count: "count" },
          ],
          inactiveUsers: [
            { $match: { status: { $in: ["suspended", "deleted"] } } }, // Filter inactive (suspended or deleted)
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          totalUsers: { $arrayElemAt: ["$totalUsers.count", 0] },
          activeUsers: { $arrayElemAt: ["$activeUsers.count", 0] },
          inactiveUsers: { $arrayElemAt: ["$inactiveUsers.count", 0] },
        },
      },
    ]);

    // Handle case where no users exist
    const stats = userStats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
    };

    // Ensure counts are numbers (default to 0 if undefined)
    const totalUsers = stats.totalUsers || 0;
    const activeUsers = stats.activeUsers || 0;
    const inactiveUsers = stats.inactiveUsers || 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },
      message: "User statistics fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

// Helper function to send verification code
const sendVerificationCodeHelper = async (email) => {
  try {
    // Simulate a request body for `sendVerificationCode`
    const req = { body: { email } };
    const res = {
      status: (code) => ({
        json: (response) => ({ ...response, statusCode: code }),
      }),
    };

    // Call the existing method
    const response = await exports.sendVerificationCode(req, res);

    return response;
  } catch (error) {
    console.error("Error in sending verification code:", error);
    return { success: false, message: "Failed to send verification code." };
  }
};
