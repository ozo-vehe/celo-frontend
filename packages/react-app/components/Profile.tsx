// This component is used to display all the products in the marketplace

// Importing the dependencies
import { useState } from "react";
// Import the useContractCall hook to read how many products are in the marketplace via the contract
import { useContractCall } from "@/hooks/contracts/useContractRead";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the Product and Alert components
import Product from "@/components/Product";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import LoadingAlert from "@/components/alerts/LoadingAlert";
import SuccessAlert from "@/components/alerts/SuccessAlert";
import { useUserBoughtProducts } from "@/hooks/contracts/useOwner";

// Define the Profile component
const Profile = () => {
  // Use the useContractCall hook to read how many products are in the marketplace contract
  const { data } = useContractCall("getProductsLength", [], true);
  // Convert the data to a number
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();

  const productLength = data ? Number(data.toString()) : 0;
  // Define the states to store the error, success and loading messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");
  // Define a function to clear the error, success and loading states
  const clear = () => {
    setError("");
    setSuccess("");
    setLoading("");
  };

  // Define a function to return the products
  const getUploadedProducts = () => {
    // If there are no products, return null
    if (!productLength) {
      return (
        <>
          <p>No product</p>
        </>
      )
    };
    const products = [];
    // Loop through the products, return the Product component and push it to the products array
    for (let i = 0; i < productLength; i++) {
      const { data }:any = useContractCall("readProduct", [i], true);
      if(data[0] === address) {
        products.push(
          <Product
            key={i}
            id={i}
            setSuccess={setSuccess}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
            clear={clear}
            profile={true}
          />
        );
      }
    }
    if(products.length < 1) {
      return (
        <>
          <p>No product</p>
        </>
      )
    } else return products;
  };

  // Define a function to return the products
  const getPurchasedProducts = () => {
    const products = [];
    // Loop through the products, return the Product component and push it to the products array
    for (let i = 0; i < productLength; i++) {
      const { data }:any = useUserBoughtProducts([address, i], true);
      if(data && data.owner !== "0x0000000000000000000000000000000000000000") {
        products.push(
          <Product
            key={i}
            id={i}
            setSuccess={setSuccess}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
            clear={clear}
            profile={true}
          />
        );
      }
    }
    if(products.length < 1) {
      return (
        <>
          <p>No purchased product</p>
        </>
      )
    } else return products;
  };

  // Return the JSX for the component
  return (
    <div>
      {/* If there is an alert, display it */}
      {error && <ErrorAlert message={error} clear={clear} />}
      {success && <SuccessAlert message={success} />}
      {loading && <LoadingAlert message={loading} />}
      {/* Display the products */}
      <h1 className="ml-8 mt-16 text-3xl font-bold">Profile</h1>
      <div className="mx-auto max-w-2xl py-8 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl mb-4 font-bold">Uploaded Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Loop through the products and return the Product component */}
          {getUploadedProducts()}
        </div>
      </div>

      <div className="mx-auto max-w-2xl py-8 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl mb-4 font-bold">Purchased Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Loop through the products and return the Product component */}
          {getPurchasedProducts()}
        </div>
      </div>
    </div>
  );
};

export default Profile;