import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  ButtonBase,
  styled 
} from '@mui/material';
import { SaleItem } from '../../types';
import { UK_VAT_RATES } from '../../types';

const ProductButton = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface Product {
  id: string;
  name: string;
  price: number;
  vatRateId: string;
}

// Mock products - will be replaced with API data
const mockProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 9.99, vatRateId: 'std' },
  { id: '2', name: 'Product 2', price: 19.99, vatRateId: 'std' },
  // Add more mock products
];

interface ProductGridProps {
  onProductSelect: (item: SaleItem) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductSelect }) => {
  const handleProductClick = (product: Product) => {
    const vatRate = UK_VAT_RATES.find(rate => rate.id === product.vatRateId)!;
    const vatAmount = (product.price * vatRate.rate) / 100;

    const saleItem: SaleItem = {
      id: `item_${Date.now()}`,
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
      vatRate: vatRate.rate,
      vatAmount: vatAmount,
      total: product.price
    };

    onProductSelect(saleItem);
  };

  return (
    <Grid container spacing={2}>
      {mockProducts.map((product) => (
        <Grid item xs={3} key={product.id}>
          <Card>
            <ProductButton onClick={() => handleProductClick(product)}>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="primary">
                  £{product.price.toFixed(2)}
                </Typography>
              </CardContent>
            </ProductButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
