import { useReducer, createContext, ReactNode } from 'react';

export interface iProduct {
  product_title: string;
  image_url: string;
  category: string;
  location: string;
  price: number;
  sold: number;
  owner: string;
  index: number;
}

interface CartItem extends iProduct {
  quantity: number;
}

interface AppState {
  cart: { [productTitle: string]: CartItem };
}

interface AddToCartAction {
  type: 'ADD_TO_CART';
  payload: iProduct;
}

interface RemoveFromCartAction {
  type: 'REMOVE_FROM_CART';
  payload: iProduct;
}

type CartAction = AddToCartAction | RemoveFromCartAction;

const initialState: AppState = {
  cart: {},
};

interface ShoppingCartContextType {
  state: AppState;
  dispatch: (action: CartAction) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  state: initialState,
  dispatch: () => {},
});

function cartReducer(state: AppState, action: CartAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const item = state.cart[action.payload.product_title];
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.product_title]: item
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : {
                ...action.payload,
                quantity: 1,
              },
        },
      };
    case 'REMOVE_FROM_CART':
      const newCart = { ...state.cart };
      delete newCart[action.payload.product_title];
      return {
        ...state,
        cart: newCart,
      };
    default:
      return state;
  }
}

interface ShoppingCartProviderProps {
  children: ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <ShoppingCartContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export { ShoppingCartContext, ShoppingCartProvider };
