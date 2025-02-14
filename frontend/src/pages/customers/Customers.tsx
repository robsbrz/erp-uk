import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Customer } from '../../types';
import { dataService } from '../../services/dataService';
import DataTable from '../../components/common/DataTable';
import CustomerForm from './CustomerForm';

const columns = [
  { id: 'code', label: 'Code', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'phone', label: 'Phone', minWidth: 130 },
  {
    id: 'address',
    label: 'City',
    minWidth: 130,
    format: (value: any) => value.city,
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await dataService.getCustomers();
    setCustomers(data);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setOpenForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenForm(true);
  };

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm('Are you sure you want to delete this customer?');
    if (confirmed) {
      // Implement delete logic
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Customer
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {openForm && (
        <CustomerForm
          open={openForm}
          customer={selectedCustomer}
          onClose={() => setOpenForm(false)}
          onSave={() => {
            setOpenForm(false);
            loadCustomers();
          }}
        />
      )}
    </Box>
  );
};

export default Customers;
