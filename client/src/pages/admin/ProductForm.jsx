import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { useProductActions } from '../../hooks/useProductActions';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { createProduct, updateProduct, loading } = useProductActions();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString()
      });
      setImagePreview(product.imageUrl);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = id
      ? await updateProduct(id, formData)
      : await createProduct(formData);

    if (success) {
      navigate('/admin/products');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Product' : 'Create New Product'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              fullWidth
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
              />

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                  <MenuItem value="Footwear">Footwear</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              fullWidth
            />

            <Box>
              <Button
                variant="contained"
                component="label"
                sx={{ mb: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Product preview"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    mt: 2
                  }}
                />
              )}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="button"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {id ? 'Update' : 'Create'} Product
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ProductForm;
