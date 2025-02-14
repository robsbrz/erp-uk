import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Product } from '../../types';
import { dataService } from '../../services/dataService';
import DataTable from '../../components/common/DataTable';
import ProductForm from './ProductForm';

const columns = [
  { id: 'code', label: 'Code', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'category', label: 'Category', minWidth: 130 },
  {
    id: 'price',
    label: 'Price',
    minWidth: 100,
    align: 'right' as const,
    format: (value: number) => `£${value.toFixed(2)}`,
  },
  {
    id: 'stock',
    label: 'Stock',
    minWidth: 100,
    align: 'right' as const,
  },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await dataService.getProducts();
    setProducts(data);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpenForm(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = async (product: Product) => {
    // In a real application, you would call an API to delete the product
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      // Implement delete logic
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Product
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {openForm && (
        <ProductForm
          open={openForm}
          product={selectedProduct}
          onClose={() => setOpenForm(false)}
          onSave={() => {
            setOpenForm(false);
            loadProducts();
          }}
        />
      )}
    </Box>
  );
};

export default Products;
