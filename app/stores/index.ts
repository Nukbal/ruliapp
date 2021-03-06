import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-community/async-storage';

import userReducer from './user';
import themeReducer from './theme';
import postReducer from './post';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  post: postReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
const reducer = persistReducer(
  { key: 'root', storage, blacklist: ['post'] },
  rootReducer,
);

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
    thunk: false,
  }),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
