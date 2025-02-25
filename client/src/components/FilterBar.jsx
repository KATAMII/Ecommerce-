import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../hooks/useAuth.jsx';

const FilterBar = ({ filters, onFilterChange }) => {
  const { isAdmin } = useAuth();

  const handleChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value
    });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          flex={1}
          width="100%"
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={handleChange('category')}
            >
              <MenuItem value="All Collection">All Collection</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
              <MenuItem value="Footwear">Footwear</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Price Range</InputLabel>
            <Select
              value={filters.priceRange}
              label="Price Range"
              onChange={handleChange('priceRange')}
            >
              <MenuItem value="$50 - $100">$50 - $100</MenuItem>
              <MenuItem value="$100 - $200">$100 - $200</MenuItem>
              <MenuItem value="$200+">$200+</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={handleChange('status')}
            >
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder="Search..."
            variant="outlined"
            fullWidth
            onChange={handleChange('search')}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton color="primary" aria-label="filter">
            <FilterListIcon />
          </IconButton>
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => window.location.href = '/admin/products/new'}
            >
              Add new product
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default FilterBar;
