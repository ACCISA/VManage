import { configureStore } from '@reduxjs/toolkit'
import machinesSlice from './machinesSlice'

export default configureStore({
    reducer: {
        machines: machinesSlice
    }
})