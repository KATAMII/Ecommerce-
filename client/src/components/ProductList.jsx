import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth.jsx';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';
import { Box, Grid, Container } from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All Collection',
    priceRange: '$50 - $100',
    status: 'All Status'
  });
  const { socket } = useSocket();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on('filtered-products', (filteredProducts) => {
        setProducts(filteredProducts);
      });

      return () => {
        socket.off('filtered-products');
      };
    }
  }, [socket]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    socket?.emit('filter-products', newFilters);
  };

  return (
    <Container maxWidth="xl">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard 
                product={product}
                isAdmin={isAdmin}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductList;
