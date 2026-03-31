import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './features/cartSlice'
import productSlice from './features/productSlice'

const store = configureStore({
   reducer: {
      cart: cartSlice,
      products: productSlice,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
   }),
})

export default store;