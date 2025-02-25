import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import io from 'socket.io-client';
import axios from 'axios';

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: 'all',
    priceRange: [0, 1000],
    search: ''
  });
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    
    socket.on('products-updated', () => {
      fetchProducts();
    });

    fetchProducts();
    fetchCategories();

    return () => socket.disconnect();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch products', { variant: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      setCategories([{ id: 'all', name: 'All' }, ...response.data]);
    } catch (error) {
      enqueueSnackbar('Failed to fetch categories', { variant: 'error' });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.categoryId === 'all' || product.categoryId === filters.categoryId;
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.categoryId}
                label="Category"
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">${filters.priceRange[0]}</Typography>
              <Typography variant="body2">${filters.priceRange[1]}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${Number(product.price).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Products;
