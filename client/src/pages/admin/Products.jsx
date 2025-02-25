import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  CardActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const Products = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null
  });

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchCategories();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      showSnackbar('Error fetching products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      showSnackbar('Error fetching categories', 'error');
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId,
        image: null
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        image: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      image: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataObj.append(key, formData[key]);
        }
      });

      if (selectedProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${selectedProduct.id}`,
          formDataObj,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSnackbar('Product updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/products',
          formDataObj,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSnackbar('Product created successfully');
      }
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSnackbar('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      <TextField
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: '100%', mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading && !openDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${Number(product.price).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <IconButton onClick={() => handleOpenDialog(product)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="file"
                name="image"
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                inputProps={{
                  accept: 'image/*'
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
