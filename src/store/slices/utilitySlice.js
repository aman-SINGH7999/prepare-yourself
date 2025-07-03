import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedTag: null,
}

export const utilitySlice = createSlice({
  name: 'utility',
  initialState,
  reducers: {
    setSelectedTag: (state, action) => {
        state.selectedTag = action.payload
    },
    
  },
})

export const { setSelectedTag } = utilitySlice.actions
export default utilitySlice.reducer
