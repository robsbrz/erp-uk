import { useState, useEffect } from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Invoice, Customer } from '../../types';
import { dataService } from '../../services/dataService';
import DataTable from '../../components/common/DataTable';
import InvoiceForm from './InvoiceForm';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'sent':
      return 'info';
    case 'draft':
      return 'default';
    case 'overdue':
      return 'error';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const columns = [
    { id: 'number', label: 'Number', minWidth: 100 },
    {
      id: 'customerId',
      label: 'Customer',
      minWidth: 170,
      format: (value: string) => customers.find(c => c.id === value)?.name || value,
    },
    {
      id: 'total',
      label: 'Total',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => `£${value.toFixed(2)}`,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value: string) => (
        <Chip
          label={value.toUpperCase()}
          color={getStatusColor(value) as any}
          size="small"
        />
      ),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      minWidth: 130,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [invoicesData, customersData] = await Promise.all([
      dataService.getInvoices(),
      dataService.getCustomers(),
    ]);
    setInvoices(invoicesData);
    setCustomers(customersData);
  };

  const handleAdd = () => {
    setSelectedInvoice(null);
    setOpenForm(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenForm(true);
  };

  const handleDelete = async (invoice: Invoice) => {
    const confirmed = window.confirm('Are you sure you want to delete this invoice?');
    if (confirmed) {
      // Implement delete logic
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Invoices</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Create Invoice
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {openForm && (
        <InvoiceForm
          open={openForm}
          invoice={selectedInvoice}
          customers={customers}
          onClose={() => setOpenForm(false)}
          onSave={() => {
            setOpenForm(false);
            loadData();
          }}
        />
      )}
    </Box>
  );
};

export default Invoices;
