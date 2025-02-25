import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth.jsx';
import { useSnackbar } from 'notistack';

export const useProductActions = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleError = (error) => {
    enqueueSnackbar(
      error.response?.data?.message || 'An error occurred',
      { variant: 'error' }
    );
  };

  const handleEdit = async (productId) => {
    window.location.href = `/admin/products/edit/${productId}`;
  };

  const handleDelete = async (productId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId, status) => {
    try {
      setLoading(true);
      await axios.put(
        `/api/products/${productId}`,
        { active: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar('Product status updated', { variant: 'success' });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.post('/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      await axios.put(`/api/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleEdit,
    handleDelete,
    handleStatusChange,
    createProduct,
    updateProduct
  };
};
