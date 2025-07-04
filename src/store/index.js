import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage by default
import userReducer from './slices/userSlice'
import utilityReducer from './slices/utilitySlice'
import themeReducer from './slices/themeSlice'

const rootReducer = combineReducers({
  user: userReducer,
  utility: utilityReducer,
  theme: themeReducer, 
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'theme', 'utility'] // yahi persist hoga
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
})

export const persistor = persistStore(store)
