import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import adminReducer from './slices/adminSlice';


const persistConfig = {
  key: 'admin',
  storage, 
};




const store = configureStore({
  reducer: {
    admin: persistReducer(persistConfig,adminReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export const persistor = persistStore(store);
export default store;