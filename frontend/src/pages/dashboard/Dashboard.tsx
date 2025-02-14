import { Grid } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Revenue"
          value="£12,500"
          icon={<AttachMoneyIcon />}
          color="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Invoices"
          value="48"
          icon={<ReceiptIcon />}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Customers"
          value="156"
          icon={<PeopleIcon />}
          color="#ed6c02"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Products"
          value="89"
          icon={<InventoryIcon />}
          color="#9c27b0"
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
