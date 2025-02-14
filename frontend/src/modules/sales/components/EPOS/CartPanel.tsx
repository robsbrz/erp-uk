import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Sale, SaleItem } from '../../types';

interface CartPanelProps {
  sale: Partial<Sale>;
  onUpdateSale: (sale: Partial<Sale>) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ sale, onUpdateSale }) => {
  const handleRemoveItem = (itemToRemove: SaleItem) => {
    const newItems = sale.items?.filter(item => item.id !== itemToRemove.id) || [];
    const newSubtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const newVatAmount = newItems.reduce((sum, item) => sum + item.vatAmount, 0);

    onUpdateSale({
      ...sale,
      items: newItems,
      subtotal: newSubtotal,
      vatAmount: newVatAmount,
      total: newSubtotal + newVatAmount
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2, height: 'calc(60% - 8px)', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Current Sale
      </Typography>
      <List>
        {sale.items?.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={`Product ${item.productId}`}
              secondary={`£${item.unitPrice.toFixed(2)} x ${item.quantity}`}
            />
            <ListItemSecondaryAction>
              <Typography variant="body2" sx={{ mr: 2 }}>
                £{item.total.toFixed(2)}
              </Typography>
              <IconButton edge="end" onClick={() => handleRemoveItem(item)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2 }}>
        <Typography variant="subtitle1">
          Subtotal: £{sale.subtotal?.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1">
          VAT: £{sale.vatAmount?.toFixed(2)}
        </Typography>
        <Typography variant="h6">
          Total: £{sale.total?.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CartPanel;