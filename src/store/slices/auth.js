import { createSlice } from '@reduxjs/toolkit'
import {useSelector} from "react-redux";

const initialState = {
  hash: 0,
  email: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuth = action.payload.isAuth
      state.hash = action.payload.hash
      state.email = action.payload.email
    }
  },
})

// Action clients are generated for each case reducer function
export const { setAuth } = authSlice.actions

export default authSlice.reducer

export function useAuth() {
  const auth = useSelector(state => state.auth)
  return {...auth}
}