import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Invoice, Customer, Product } from '../../types';
import { dataService } from '../../services/dataService';

interface InvoiceFormProps {
  open: boolean;
  invoice: Invoice | null;
  customers: Customer[];
  onClose: () => void;
  onSave: () => void;
}

const InvoiceForm = ({ open, invoice, customers, onClose, onSave }: InvoiceFormProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    number: '',
    customerId: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
    status: 'draft',
    dueDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadProducts();
    if (invoice) {
      setFormData({
        number: invoice.number,
        customerId: invoice.customerId,
        items: invoice.items,
        status: invoice.status,
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
      });
    }
  }, [invoice]);

  const loadProducts = async () => {
    const productsData = await dataService.getProducts();
    setProducts(productsData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' ? parseInt(value) : value,
    };
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
    const vat = subtotal * 0.20; // 20% VAT
    const total = subtotal + vat;
    return { subtotal, vat, total };
  };

  const handleSubmit = async () => {
    const { subtotal, vat, total } = calculateTotals();
    const invoiceData = {
      ...formData,
      subtotal,
      vat,
      total,
    };

    if (invoice) {
      // Update existing invoice
      // Implement update logic
    } else {
      // Create new invoice
      await dataService.addInvoice(invoiceData);
    }

    onSave();
  };

  const { subtotal, vat, total } = calculateTotals();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{invoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="number"
              label="Invoice Number"
              value={formData.number}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="customerId"
              label="Customer"
              select
              value={formData.customerId}
              onChange={handleChange}
              fullWidth
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Items</Typography>
            {formData.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  select
                  label="Product"
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  sx={{ flexGrow: 1 }}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - £{product.price}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  sx={{ width: 100 }}
                />
                <IconButton
                  color="error"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addItem}
              sx={{ mt: 1 }}
            >
              Add Item
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="status"
              label="Status"
              select
              value={formData.status}
              onChange={handleChange}
              fullWidth
            >
              {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle1">Subtotal: £{subtotal.toFixed(2)}</Typography>
              <Typography variant="subtitle1">VAT (20%): £{vat.toFixed(2)}</Typography>
              <Typography variant="h6">Total: £{total.toFixed(2)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {invoice ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceForm;
