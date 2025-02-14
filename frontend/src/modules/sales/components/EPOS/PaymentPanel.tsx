import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AttachMoney as CashIcon,
  ContactlessRounded as ContactlessIcon,
  AccountBalance as BankIcon,
  CardGiftcard as VoucherIcon,
  CallSplit as SplitIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { Sale, Payment, PaymentMethod, PaymentStatus } from '../../types';
import { ukPaymentService } from '../../services/payment/UKPaymentService';
import { receiptPrinterService } from '../../services/printer/ReceiptPrinterService';
import { splitPaymentService } from '../../services/payment/SplitPaymentService';

interface PaymentPanelProps {
  sale: Partial<Sale>;
  onPaymentComplete: () => void;
}

interface PaymentOption {
  method: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface SplitPaymentItem {
  method: PaymentMethod;
  amount: number;
}

const paymentOptions: PaymentOption[] = [
  { method: 'card', label: 'Card', icon: <CardIcon />, color: '#1976d2' },
  { method: 'contactless', label: 'Contactless', icon: <ContactlessIcon />, color: '#2e7d32' },
  { method: 'cash', label: 'Cash', icon: <CashIcon />, color: '#ed6c02' },
  { method: 'bank_transfer', label: 'Bank', icon: <BankIcon />, color: '#9c27b0' },
  { method: 'voucher', label: 'Voucher', icon: <VoucherIcon />, color: '#d32f2f' },
  { method: 'split', label: 'Split', icon: <SplitIcon />, color: '#0288d1' }
];

const PaymentPanel: React.FC<PaymentPanelProps> = ({ sale, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [change, setChange] = useState<number>(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPaymentItem[]>([]);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPaymentAmount(sale.total?.toFixed(2) || '0');
    setPaymentDialogOpen(true);
    setError(null);
    if (method === 'split') {
      setSplitPayments([{ method: 'card', amount: (sale.total || 0) / 2 }]);
    } else {
      setSplitPayments([]);
    }
  };

  const handlePaymentSubmit = async () => {
    setProcessing(true);
    setError(null);

    try {
      if (!selectedMethod) {
        throw new Error('No payment method selected');
      }

      let payments: Payment[];

      if (selectedMethod === 'split') {
        const splitTotal = splitPayments.reduce((sum, payment) => sum + payment.amount, 0);
        if (Math.abs(splitTotal - (sale.total || 0)) > 0.01) {
          throw new Error('Split payment total does not match sale total');
        }

        payments = await splitPaymentService.processSplitPayment(sale as Sale, splitPayments);
      } else {
        const amountPaid = parseFloat(paymentAmount);
        if (amountPaid < (sale.total || 0)) {
          throw new Error('Insufficient payment amount');
        }

        let payment: Payment;
        if (selectedMethod === 'card' || selectedMethod === 'contactless') {
          payment = await ukPaymentService.processCardPayment(amountPaid);
        } else {
          payment = {
            id: `${selectedMethod}_${Date.now()}`,
            method: selectedMethod,
            amount: amountPaid,
            status: 'approved' as PaymentStatus,
            processedAt: new Date(),
            reference: `${selectedMethod.toUpperCase()}-${Date.now()}`
          };
        }

        payments = [payment];

        if (selectedMethod === 'cash') {
          setChange(amountPaid - (sale.total || 0));
        }
      }

      await receiptPrinterService.printReceipt({
        ...sale as Sale,
        payments
      });

      setPaymentDialogOpen(false);
      onPaymentComplete();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleSplitPaymentChange = (index: number, field: 'method' | 'amount', value: PaymentMethod | number) => {
    const newSplitPayments = [...splitPayments];
    newSplitPayments[index] = { ...newSplitPayments[index], [field]: value };
    setSplitPayments(newSplitPayments);
  };

  const addSplitPayment = () => {
    setSplitPayments([...splitPayments, { method: 'cash', amount: 0 }]);
  };

  const removeSplitPayment = (index: number) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };

  return (
    <>
      <Paper sx={{ p: 2, height: '40%' }}>
        <Typography variant="h6" gutterBottom>
          Payment
        </Typography>
        <Grid container spacing={2}>
          {paymentOptions.map((option) => (
            <Grid item xs={4} key={option.method}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  height: 80,
                  flexDirection: 'column',
                  borderColor: option.color,
                  color: option.color,
                  '&:hover': {
                    borderColor: option.color,
                    backgroundColor: `${option.color}10`
                  }
                }}
                onClick={() => handlePaymentSelect(option.method)}
                disabled={!sale.total || sale.total === 0}
              >
                {option.icon}
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {option.label}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => !processing && setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Process Payment - {selectedMethod?.toUpperCase() || ''}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Total Amount: £{sale.total?.toFixed(2)}
            </Typography>
            
            {selectedMethod === 'split' ? (
              <>
                <List>
                  {splitPayments.map((splitPayment, index) => (
                    <ListItem key={index}>
                      <ListItemText>
                        <TextField
                          select
                          value={splitPayment.method}
                          onChange={(e) => handleSplitPaymentChange(index, 'method', e.target.value as PaymentMethod)}
                          fullWidth
                        >
                          {paymentOptions.filter(option => option.method !== 'split').map((option) => (
                            <option key={option.method} value={option.method}>
                              {option.label}
                            </option>
                          ))}
                        </TextField>
                      </ListItemText>
                      <ListItemText>
                        <TextField
                          type="number"
                          value={splitPayment.amount}
                          onChange={(e) => handleSplitPaymentChange(index, 'amount', parseFloat(e.target.value))}
                          InputProps={{
                            startAdornment: '£',
                          }}
                        />
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => removeSplitPayment(index)}>
                          <RemoveIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button startIcon={<AddIcon />} onClick={addSplitPayment}>
                  Add Payment Method
                </Button>
              </>
            ) : selectedMethod === 'cash' ? (
              <TextField
                label="Amount Received"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: '£',
                }}
                sx={{ mt: 2 }}
              />
            ) : (
              <Box sx={{ mt: 2 }}>
                <Chip 
                  icon={<ContactlessIcon />} 
                  label="Contactless Available"
                  color="primary"
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Please follow instructions on the card terminal
                </Typography>
              </Box>
            )}

            {change > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Change to give: £{change.toFixed(2)}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPaymentDialogOpen(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePaymentSubmit}
            variant="contained"
            disabled={processing || (selectedMethod !== 'split' && !paymentAmount)}
          >
            {processing ? (
              <CircularProgress size={24} />
            ) : (
              `Process ${selectedMethod === 'split' ? 'Split Payment' : `£${paymentAmount}`}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentPanel;
