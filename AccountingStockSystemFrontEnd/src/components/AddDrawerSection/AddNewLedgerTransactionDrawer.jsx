import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import {
  fetchLedgerTransactions,
  updateLedgerTransaction,
  createLedgerTransaction,
} from "../../redux/slices/ledgerTransactionSlice";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0px",
    bottom: "50px",
    boxSizing: "border-box",
  },
}));

const AddNewLedgerTransactionDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { loading, transactions } = useSelector(
    (state) => state.ledgerTransactions
  );

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    description: "",
    referenceType: "Debtor",
    referenceId: "",
    debitAccount: "",
    debitAmount: "",
    creditAccount: "",
    creditAmount: "",
    status: "Pending",
    comment: "", // Added comment field
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [debitBalance, setDebitBalance] = useState(null);
  const [creditBalance, setCreditBalance] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/accounts", {
          params: { status: "active" },
        });
        setAccounts(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load accounts");
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (open && transactions.length === 0) {
      dispatch(fetchLedgerTransactions());
    }
  }, [open, transactions.length, dispatch]);

  useEffect(() => {
    const fetchReferenceOptions = async () => {
      try {
        let url = "";
        switch (formData.referenceType) {
          case "AccountSale":
            url = "/api/account-sales";
            break;
          case "Debtor":
            url = "/api/debtors";
            break;
          case "PettyCash":
            url = "/api/petty-cashes";
            break;
          case "Other":
            setReferenceOptions([]);
            return;
          default:
            return;
        }
        const response = await axios.get(url);
        const data = response.data.data || [];
        if (formData.referenceType === "Debtor") {
          setReferenceOptions(
            data.map((debtor) => ({
              id: debtor._id,
              label: debtor.invoices[0]?.invoiceNumber || "No Invoice",
            }))
          );
        } else if (formData.referenceType === "PettyCash") {
          const transactions = data.flatMap((pc) =>
            pc.transactions.map((tx) => ({
              id: tx._id,
              label: tx.voucherNo,
            }))
          );
          setReferenceOptions(transactions);
        } else {
          setReferenceOptions(
            data.map((item) => ({
              id: item._id,
              label: item.invoiceNumber || "No Invoice",
            }))
          );
        }
      } catch (error) {
        toast.error(`Failed to load ${formData.referenceType} options`);
      }
    };
    if (open) fetchReferenceOptions();
  }, [formData.referenceType, open]);

  useEffect(() => {
    if (editMode && initialData) {
      const debitEntry = initialData.entries.find((e) => e.debit > 0) || {};
      const creditEntry = initialData.entries.find((e) => e.credit > 0) || {};
      setFormData({
        date: initialData.date
          ? new Date(initialData.date).toISOString().slice(0, 16)
          : "",
        description: initialData.description || "",
        referenceType: initialData.referenceType || "Debtor",
        referenceId: initialData.referenceId?._id || "",
        debitAccount: debitEntry.account?._id || debitEntry.account || "",
        debitAmount: debitEntry.debit ? debitEntry.debit.toString() : "",
        creditAccount: creditEntry.account?._id || creditEntry.account || "",
        creditAmount: creditEntry.credit ? creditEntry.credit.toString() : "",
        status: initialData.status || "Pending",
        comment: initialData.comment || "", // Populate comment in edit mode
      });
      setTouched({
        date: true,
        description: true,
        referenceType: true,
        referenceId: true,
        debitAccount: true,
        debitAmount: true,
        creditAccount: true,
        creditAmount: true,
        status: true,
        comment: true, // Added to touched
      });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const calculateBalance = useCallback(
    (accountId) => {
      if (!accountId || !transactions.length) return 0;
      const relevantEntries = transactions
        .filter((t) => t.status === "Posted")
        .flatMap((t) => t.entries)
        .filter((e) => e.account.toString() === accountId.toString());
      const debitTotal = relevantEntries.reduce(
        (sum, e) => sum + (e.debit || 0),
        0
      );
      const creditTotal = relevantEntries.reduce(
        (sum, e) => sum + (e.credit || 0),
        0
      );
      const account = accounts.find(
        (a) => a._id.toString() === accountId.toString()
      );
      if (!account) return 0;
      switch (account.type) {
        case "Asset":
        case "Expense":
          return debitTotal - creditTotal;
        case "Liability":
        case "Equity":
        case "Revenue":
          return creditTotal - debitTotal;
        default:
          return 0;
      }
    },
    [transactions, accounts]
  );

  useEffect(() => {
    setDebitBalance(
      formData.debitAccount ? calculateBalance(formData.debitAccount) : null
    );
  }, [formData.debitAccount, calculateBalance]);

  useEffect(() => {
    setCreditBalance(
      formData.creditAccount ? calculateBalance(formData.creditAccount) : null
    );
  }, [formData.creditAccount, calculateBalance]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "date":
        if (!value) error.date = "Date is required";
        break;
      case "description":
        if (!value) error.description = "Description is required";
        break;
      case "referenceType":
        if (!value) error.referenceType = "Reference type is required";
        break;
      case "referenceId":
        if (!value && formData.referenceType !== "Other") {
          error.referenceId = "Reference ID is required";
        }
        break;
      case "debitAccount":
        if (!value) error.debitAccount = "Debit account is required";
        break;
      case "debitAmount":
        if (!value) error.debitAmount = "Debit amount is required";
        else if (Number(value) <= 0)
          error.debitAmount = "Amount must be positive";
        break;
      case "creditAccount":
        if (!value) error.creditAccount = "Credit account is required";
        else if (value === formData.debitAccount) {
          error.creditAccount = "Credit account must differ from debit account";
        }
        break;
      case "creditAmount":
        if (!value) error.creditAmount = "Credit amount is required";
        else if (Number(value) <= 0)
          error.creditAmount = "Amount must be positive";
        else if (Number(value) !== Number(formData.debitAmount)) {
          error.creditAmount = "Credit amount must equal debit amount";
        }
        break;
      case "status":
        if (!value) error.status = "Status is required";
        break;
      case "comment":
        if (value && value.length > 100)
          error.comment = "Comment cannot exceed 100 characters";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: newValue }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (touched[field] || event.type === "blur") {
      const fieldErrors = validateField(field, newValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldErrors,
        ...(Object.keys(fieldErrors).length === 0 && { [field]: undefined }),
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 16),
      description: "",
      referenceType: "Debtor",
      referenceId: "",
      debitAccount: "",
      debitAmount: "",
      creditAccount: "",
      creditAmount: "",
      status: "Pending",
      comment: "", // Reset comment
    });
    setErrors({});
    setTouched({});
    setDebitBalance(null);
    setCreditBalance(null);
  };

  const validateForm = () => {
    const fieldsToValidate = [
      "date",
      "description",
      "referenceType",
      "referenceId",
      "debitAccount",
      "debitAmount",
      "creditAccount",
      "creditAmount",
      "status",
      "comment", // Added comment to validation
    ];
    const newErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(newErrors, fieldErrors);
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setTouched({
      date: true,
      description: true,
      referenceType: true,
      referenceId: true,
      debitAccount: true,
      debitAmount: true,
      creditAccount: true,
      creditAmount: true,
      status: true,
      comment: true, // Added to touched
    });
    const isValid = validateForm();
    if (!isValid) return;

    const transactionData = {
      date: formData.date,
      description: formData.description,
      referenceType: formData.referenceType,
      referenceId:
        formData.referenceType === "Other" ? null : formData.referenceId,
      entries: [
        {
          account: formData.debitAccount,
          debit: Number(formData.debitAmount),
          credit: 0,
        },
        {
          account: formData.creditAccount,
          debit: 0,
          credit: Number(formData.creditAmount),
        },
      ],
      status: formData.status,
      comment: formData.comment, // Added comment to transactionData
    };

    try {
      if (editMode) {
        await dispatch(
          updateLedgerTransaction({
            id: initialData._id,
            transactionData,
          })
        ).unwrap();
        toast.success("Transaction updated successfully!");
      } else {
        await dispatch(createLedgerTransaction(transactionData)).unwrap();
        toast.success("Transaction added successfully!");
      }
      onClose();
      onSaveSuccess && onSaveSuccess();
      resetForm();
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      toast.error(
        `Error ${editMode ? "updating" : "adding"} transaction: ${errorMessage}`
      );
    }
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
        <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h2>{editMode ? "Edit Transaction" : "Add New Transaction"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Date"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.date}
            onChange={handleChange("date")}
            onBlur={handleChange("date")}
            error={touched.date && !!errors.date}
            helperText={touched.date && errors.date}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleChange("description")}
            onBlur={handleChange("description")}
            error={touched.description && !!errors.description}
            helperText={touched.description && errors.description}
            required
          />

          <FormControl
            fullWidth
            margin="normal"
            error={touched.referenceType && !!errors.referenceType}
          >
            <InputLabel id="referenceType-label">Reference Type</InputLabel>
            <Select
              labelId="referenceType-label"
              value={formData.referenceType}
              onChange={handleChange("referenceType")}
              onBlur={handleChange("referenceType")}
              label="Reference Type"
              required
            >
              <MenuItem value="Debtor">Debtor</MenuItem>
              <MenuItem value="AccountSale">Account Sale</MenuItem>
              <MenuItem value="PettyCash">Petty Cash</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {touched.referenceType && errors.referenceType && (
              <FormHelperText>{errors.referenceType}</FormHelperText>
            )}
          </FormControl>

          {formData.referenceType !== "Other" && (
            <FormControl
              fullWidth
              margin="normal"
              error={touched.referenceId && !!errors.referenceId}
            >
              <InputLabel id="referenceId-label">Reference ID</InputLabel>
              <Select
                labelId="referenceId-label"
                value={formData.referenceId}
                onChange={handleChange("referenceId")}
                onBlur={handleChange("referenceId")}
                label="Reference ID"
                required
              >
                {referenceOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {touched.referenceId && errors.referenceId && (
                <FormHelperText>{errors.referenceId}</FormHelperText>
              )}
            </FormControl>
          )}

          <TextField
            label="Comment"
            fullWidth
            margin="normal"
            value={formData.comment}
            onChange={handleChange("comment")}
            onBlur={handleChange("comment")}
            error={touched.comment && !!errors.comment}
            helperText={
              touched.comment && errors.comment
                ? errors.comment
                : `${formData.comment.length}/100 characters`
            }
            multiline
            rows={3}
            inputProps={{ maxLength: 100 }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Debit</Typography>
            <FormControl
              fullWidth
              margin="normal"
              error={touched.debitAccount && !!errors.debitAccount}
            >
              <InputLabel id="debitAccount-label">Account</InputLabel>
              <Select
                labelId="debitAccount-label"
                value={formData.debitAccount}
                onChange={handleChange("debitAccount")}
                onBlur={handleChange("debitAccount")}
                label="Account"
                required
              >
                {accounts.map((account) => (
                  <MenuItem key={account._id} value={account._id}>
                    {`${account.name} - ${account.accountCode}`}
                  </MenuItem>
                ))}
              </Select>
              {touched.debitAccount && errors.debitAccount && (
                <FormHelperText>{errors.debitAccount}</FormHelperText>
              )}
            </FormControl>
            {debitBalance !== null && (
              <Typography variant="body2" color="textSecondary">
                Balance: ${debitBalance.toFixed(2)}
              </Typography>
            )}
            <TextField
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              value={formData.debitAmount}
              onChange={handleChange("debitAmount")}
              onBlur={handleChange("debitAmount")}
              error={touched.debitAmount && !!errors.debitAmount}
              helperText={touched.debitAmount && errors.debitAmount}
              required
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Credit</Typography>
            <FormControl
              fullWidth
              margin="normal"
              error={touched.creditAccount && !!errors.creditAccount}
            >
              <InputLabel id="creditAccount-label">Account</InputLabel>
              <Select
                labelId="creditAccount-label"
                value={formData.creditAccount}
                onChange={handleChange("creditAccount")}
                onBlur={handleChange("creditAccount")}
                label="Account"
                required
              >
                {accounts.map((account) => (
                  <MenuItem key={account._id} value={account._id}>
                    {`${account.name} - ${account.accountCode}`}
                  </MenuItem>
                ))}
              </Select>
              {touched.creditAccount && errors.creditAccount && (
                <FormHelperText>{errors.creditAccount}</FormHelperText>
              )}
            </FormControl>
            {creditBalance !== null && (
              <Typography variant="body2" color="textSecondary">
                Balance: ${creditBalance.toFixed(2)}
              </Typography>
            )}
            <TextField
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              value={formData.creditAmount}
              onChange={handleChange("creditAmount")}
              onBlur={handleChange("creditAmount")}
              error={touched.creditAmount && !!errors.creditAmount}
              helperText={touched.creditAmount && errors.creditAmount}
              required
            />
          </Box>

          <FormControl
            fullWidth
            margin="normal"
            error={touched.status && !!errors.status}
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status}
              onChange={handleChange("status")}
              onBlur={handleChange("status")}
              label="Status"
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Posted">Posted</MenuItem>
            </Select>
            {touched.status && errors.status && (
              <FormHelperText>{errors.status}</FormHelperText>
            )}
          </FormControl>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ width: "120px", borderRadius: "12px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewLedgerTransactionDrawer;
