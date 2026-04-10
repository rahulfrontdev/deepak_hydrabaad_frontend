import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as productsApi from '../../api/productsApi'

export const loadProducts = createAsyncThunk(
  'products/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.fetchProducts()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message)
    }
  }
)

export const loadProductById = createAsyncThunk(
  'products/loadById',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.fetchProductById(productId)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message)
    }
  }
)

export const loadProductsByCategory = createAsyncThunk(
  'products/loadByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.fetchProductsByCategory(categoryId)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? err.message)
    }
  }
)

const initialState = {
  list: [],
  current: null,
  status: 'idle',
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.current = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = Array.isArray(action.payload) ? action.payload : action.payload?.data ?? []
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })
      .addCase(loadProductById.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.current = action.payload
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })
      .addCase(loadProductsByCategory.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = Array.isArray(action.payload) ? action.payload : action.payload?.data ?? []
      })
      .addCase(loadProductsByCategory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })
  },
})

export const { clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer
