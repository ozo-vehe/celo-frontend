import Product from '@/components/Product';
import { useContractCall } from '@/hooks/contracts/useContractRead';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { iProduct } from './ShoppingCartContext';

type MarketPlaceProviderProps = {
  children: React.ReactNode;
}

type MarketPlaceContextType = {
  getProducts: () => React.ReactNode[];
  error: string;
  success: string;
  loading: string;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  setLoading: (loading: string) => void;
  clear: () => void;
  handleSearch: (query: string) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedItemCategory: string | undefined;
};

export const MarketPlaceContext = createContext({} as MarketPlaceContextType);

export function useMarketPlace() {
  return useContext(MarketPlaceContext);
}

export default function MarketPlaceProvider({
  children,
}: MarketPlaceProviderProps) {
  // Use the useContractCall hook to read how many products are in the marketplace contract
  const { data } = useContractCall('getProductsLength', [], true);
  // Convert the data to a number
  const productLength = data ? Number(data.toString()) : 0;
  // Define the states to store the error, success and loading messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
 const [selectedItemCategory, setSelectedItemCategory] = useState<string | undefined>();
 
 function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>): void {
   setSelectedItemCategory(e.target.value);
 }



  // Define a function to clear the error, success and loading states
  const clear = () => {
    setError('');
    setSuccess('');
    setLoading('');
  };

  // prop function that get from product filter component to set search query
  const handleSearch = (query: string) => {
    // Implement the logic to filter products based on the search query
    setSearchQuery(query);
  };

  // Define a function to return the products
  const getProducts = useCallback(() => {
    // If there are no products, return null
    if (!productLength) return [];
    const juakaliProducts = [];
    // Loop through the products, return the Product component and push it to the products array
    for (let i = 0; i < productLength; i++) {
      juakaliProducts.push(
        <Product
          key={i}
          id={i}
          setSuccess={setSuccess}
          setError={setError}
          setLoading={setLoading}
          loading={loading}
          clear={clear}
		  searchQuery={searchQuery}
		  selectedItemCategory={selectedItemCategory}

        />
      );
    }
    return juakaliProducts;
  }, [loading, productLength, searchQuery, selectedItemCategory]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <MarketPlaceContext.Provider
      value={{
        getProducts,
        error,
        success,
        loading,  
		setError,
		setSuccess,
		setLoading,   
        clear,
		handleSearch,
		handleCategoryChange,
		selectedItemCategory,
      }}
    >
      {children}
    </MarketPlaceContext.Provider>
  );
}
