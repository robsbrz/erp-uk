import React, { useState } from 'react';
import { Box, Grid, Paper,  } from '@mui/material';
import ProductGrid from './ProductGrid.tsx';
import CartPanel from './CartPanel';
import PaymentPanel from './PaymentPanel.tsx';
import { Sale, SaleItem } from '../../types';

const EPOSTerminal: React.FC = () => {
  const [currentSale, setCurrentSale] = useState<Partial<Sale>>({
    items: [],
    subtotal: 0,
    vatAmount: 0,
    total: 0,
    status: 'pending'
  });

  const handleAddItem = (item: SaleItem) => {
    setCurrentSale(prev => ({
      ...prev,
      items: [...(prev.items || []), item],
      subtotal: (prev.subtotal || 0) + item.total,
      vatAmount: (prev.vatAmount || 0) + item.vatAmount,
      total: (prev.total || 0) + item.total + item.vatAmount
    }));
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Panel - Products */}
        <Grid item xs={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <ProductGrid onProductSelect={handleAddItem} />
          </Paper>
        </Grid>

        {/* Right Panel - Cart & Payment */}
        <Grid item xs={4}>
          <Box sx={{ height: '100%' }}>
            <CartPanel 
              sale={currentSale} 
              onUpdateSale={setCurrentSale} 
            />
            <PaymentPanel 
              sale={currentSale}
              onPaymentComplete={() => setCurrentSale({
                items: [],
                subtotal: 0,
                vatAmount: 0,
                total: 0,
                status: 'pending'
              })}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EPOSTerminal;