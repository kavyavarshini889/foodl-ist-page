import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const errMsg = (e) =>
  e.response?.data?.errors?.map((x) => x.msg).join(', ') ||
  e.response?.data?.message ||
  e.message;

export const fetchHotels = createAsyncThunk('hotels/fetch', async (params, { rejectWithValue }) => {
  try { return (await api.get('/hotels', { params })).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const fetchHotel = createAsyncThunk('hotels/fetchOne', async (id, { rejectWithValue }) => {
  try { return (await api.get(`/hotels/${id}`)).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const createHotel = createAsyncThunk('hotels/create', async (formData, { rejectWithValue }) => {
  try { return (await api.post('/hotels', formData)).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const updateHotel = createAsyncThunk('hotels/update', async ({ id, formData }, { rejectWithValue }) => {
  try { return (await api.put(`/hotels/${id}`, formData)).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/hotels/${id}`); return id; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

const slice = createSlice({
  name: 'hotels',
  initialState: { items: [], total: 0, current: null, loading: false, error: null, deleteSuccess: false },
  reducers: {
    clearDeleteSuccess: (s) => { s.deleteSuccess = false; },
    clearCurrent: (s) => { s.current = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchHotels.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchHotels.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.hotels; s.total = a.payload.total; })
     .addCase(fetchHotels.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(fetchHotel.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchHotel.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
     .addCase(fetchHotel.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(deleteHotel.fulfilled, (s, a) => {
       s.items = s.items.filter((h) => h.id !== a.payload);
       s.total -= 1;
       s.deleteSuccess = true;
     });
  },
});

export const { clearDeleteSuccess, clearCurrent } = slice.actions;
export default slice.reducer;