import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Farm {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

interface FarmState {
  farms: Farm[];
  currentFarm: Farm | null;
}

const initialState: FarmState = {
  farms: [],
  currentFarm: null,
};

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    setFarms: (state, action: PayloadAction<Farm[]>) => {
      state.farms = action.payload;
      if (action.payload.length > 0 && !state.currentFarm) {
        state.currentFarm = action.payload[0]; // Default to first farm
      }
    },
    setCurrentFarm: (state, action: PayloadAction<Farm>) => {
      state.currentFarm = action.payload;
    },
    clearFarms: (state) => {
      state.farms = [];
      state.currentFarm = null;
    },
  },
});

export const { setFarms, setCurrentFarm, clearFarms } = farmSlice.actions;
export default farmSlice.reducer;