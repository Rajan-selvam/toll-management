import { configureStore } from '@reduxjs/toolkit';
import tollGateReducer from '../features/tollGate/tollGateSlice';

export const store = configureStore({
  reducer: {
    tollGate: tollGateReducer,
  },
});
