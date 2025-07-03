import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  accessKey: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
        state.token = action.payload ?? null
    },
    setAccessKey: (state, action) => {
        state.accessKey = action.payload ?? null
    },
    logout: (state)=>{
      state.token = null;
      state.accessKey = null
    }
  },
})

export const { setToken, setAccessKey, logout } = userSlice.actions
export default userSlice.reducer
