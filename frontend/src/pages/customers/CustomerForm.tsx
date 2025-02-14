import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { Customer } from '../../types';
import { dataService } from '../../services/dataService';

interface CustomerFormProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSave: () => void;
}

const CustomerForm = ({ open, customer, onClose, onSave }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    vatNumber: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        code: customer.code,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        street: customer.address.street,
        city: customer.address.city,
        postcode: customer.address.postcode,
        country: customer.address.country,
        vatNumber: customer.vatNumber || '',
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const customerData = {
      ...formData,
      address: {
        street: formData.street,
        city: formData.city,
        postcode: formData.postcode,
        country: formData.country,
      },
    };

    if (customer) {
      // Update existing customer
      // Implement update logic
    } else {
      // Add new customer
      await dataService.addCustomer(customerData);
    }

    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="code"
              label="Code"
              value={formData.code}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="street"
              label="Street Address"
              value={formData.street}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="postcode"
              label="Postcode"
              value={formData.postcode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="vatNumber"
              label="VAT Number"
              value={formData.vatNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {customer ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm;
