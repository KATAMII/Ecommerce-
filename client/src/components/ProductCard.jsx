import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Switch,
  IconButton,
  Stack,
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useProductActions } from '../hooks/useProductActions';

const ProductCard = ({ product, isAdmin }) => {
  const { handleEdit, handleDelete, handleStatusChange, loading } = useProductActions();

  const getStockProgress = (current, max) => {
    return (current / max) * 100;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {loading && <LinearProgress />}
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl}
        alt={product.name}
        sx={{ objectFit: 'contain' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          {isAdmin && (
            <Stack direction="row" spacing={1}>
              <IconButton 
                size="small" 
                onClick={() => handleEdit(product.id)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleDelete(product.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>

        <Typography color="text.secondary" gutterBottom>
          ID: {product.id}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">Stock: {product.stock}/1000</Typography>
            {isAdmin && (
              <Switch
                checked={product.active}
                onChange={(e) => handleStatusChange(product.id, e.target.checked)}
                color="primary"
              />
            )}
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={getStockProgress(product.stock, 1000)}
            sx={{ mt: 1 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
