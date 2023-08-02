/* eslint-disable @next/next/no-img-element */
// This component displays and enables the purchase of a product

// Importing the dependencies
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
// Import ethers to format the price of the product correctly
import { ethers } from "ethers";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom identicon template to display the owner of the product
import { identiconTemplate } from "@/helpers";
// Import our custom hooks to interact with the smart contract
import { useContractApprove } from "@/hooks/contracts/useApprove";
import { useContractCall } from "@/hooks/contracts/useContractRead";
import { useContractSend } from "@/hooks/contracts/useContractWrite";
import { useBuyAll } from "@/hooks/contracts/useBuyAllProducts";
import { useNumOfBoughtProducts } from "@/hooks/contracts/useNumOfProducts";

// Define the interface for the product, an interface is a type that describes the properties of an object
interface Product {
  name: string;
  price: number;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
  supply: number;
  numberOfProduct: number;
}

// Define the Product component which takes in the id of the product and some functions to display notifications
const Product = ({profile, id, setError, setLoading, clear, uploaded }: any) => {
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();
  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: rawProduct }: any = useContractCall("readProduct", [id], true);
  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: numOfProduct }: any = useNumOfBoughtProducts([address, id], true);
  // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract
  const { writeAsync: purchase } = useContractSend("buyProduct", [Number(id)]);

  // Use the useBuyAll hook to purchase the product with the id passed in, via the marketplace contract
  const { writeAsync: purchaseAll } = useBuyAll([Number(id)]);
  
  const [product, setProduct] = useState<Product | null>(null);
  // Use the useContractApprove hook to approve the spending of the product's price, for the ERC20 cUSD contract
  const { writeAsync: approve } = useContractApprove(
    product?.price?.toString() || "0"
  );

  // Use the useContractApprove hook to approve the spending of the product's price for all supply available, for the ERC20 cUSD contract
  const { writeAsync: approveAll } = useContractApprove(
    product && (product.price * product.supply).toString() || "0"
  )
  


  // Use the useConnectModal hook to trigger the wallet connect modal
  const { openConnectModal } = useConnectModal();
  // Format the product data that we read from the smart contract
  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    setProduct({
      owner: rawProduct[0],
      name: rawProduct[1],
      image: rawProduct[2],
      description: rawProduct[3],
      location: rawProduct[4],
      price: Number(rawProduct[5]),
      sold: rawProduct[6].toString(),
      supply: Number(rawProduct[7]),
      numberOfProduct: Number(numOfProduct),
    });
  }, [rawProduct, numOfProduct]);

  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatProduct();
  }, [getFormatProduct]);

  // Define the handlePurchase function which handles the purchase interaction with the smart contract
  const handlePurchase = async () => {
    if (!approve || !purchase) {
      throw "Failed to purchase this product";
    }
    // Approve the spending of the product's price, for the ERC20 cUSD contract
    const approveTx = await approve();
    // Wait for the transaction to be mined, (1) is the number of confirmations we want to wait for
    await approveTx.wait();
    setLoading("Purchasing...");
    // Once the transaction is mined, purchase the product via our marketplace contract buyProduct function
    const res = await purchase();
    // Wait for the transaction to be mined
    await res.wait();
  };


    // Define the handlePurchaseAll() function which handles the purchase
    //  of all the supply of a  product interaction with the smart contract
    const handlePurchaseAll = async () => {
      if (!approveAll || !purchaseAll) {
        throw "Failed to purchase this product";
      }
      
      // Approve the spending of the product's price, for the ERC20 cUSD contract
      const approveTx = await approveAll();
      // Wait for the transaction to be mined, (1) is the number of confirmations we want to wait for
      await approveTx.wait();
      setLoading("Purchasing...");
      // Once the transaction is mined, purchase the product via our marketplace contract buyProduct function
      const res = await purchaseAll();
      // Wait for the transaction to be mined
      await res.wait();
    };

  // Define the purchaseProduct function that is called when the user clicks the purchase button
  const purchaseProduct = async () => {
    if(product && product.supply < 1) {
      setError("Product out of stock")
    } else {
      if(product && product.owner === address) {
        setError("You can't buy your own product");
      } else {
        setLoading("Approving ...");
        clear();

        try {
          if (!address && openConnectModal) {
            openConnectModal();
            return;
          }
          // If the user is connected, call the handlePurchase function and display a notification
          await toast.promise(handlePurchase(), {
            pending: "Purchasing product...",
            success: "Product purchased successfully",
            error: "Failed to purchase product",
          });
          // If there is an error, display the error message
        } catch (e: any) {
          console.log({ e });
          setError(e?.reason || e?.message || "Something went wrong. Try again.");
          // Once the purchase is complete, clear the loading state
        } finally {
          setLoading(null);
        }
      }
    }
  };

    // Define the purchaseProduct function that is called when the user clicks the purchase button
  const purchaseAllProduct = async () => {
    if(product && product.supply < 1) {
      setError("Product out of stock")
    } else {
      if(product && product.owner === address) {
        setError("You can't buy your own product");
      } else {
        setLoading("Approving ...");
        clear();

        try {
          // If the user is not connected, trigger the wallet connect modal
          if (!address && openConnectModal) {
            openConnectModal();
            return;
          }
          // If the user is connected, call the handlePurchaseAll() function and display a notification
          await toast.promise(handlePurchaseAll(), {
            pending: "Purchasing product...",
            success: "Product purchased successfully",
            error: "Failed to purchase product",
          });
          // If there is an error, display the error message
        } catch (e: any) {
          console.log({ e });
          setError(e?.reason || e?.message || "Something went wrong. Try again.");
          // Once the purchase is complete, clear the loading state
        } finally {
          setLoading(null);
        }
      }
    }
  };

  // If the product cannot be loaded, return null
  if (!product) return null;

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const productPriceFromWei = ethers.utils.formatEther(
    product.price.toString()
  );

  // Format the price of all the suply of a  product from wei to cUSD otherwise the price will be way too high
  const allProductPriceFromWei = ethers.utils.formatEther(
    (product.price * product.supply).toString()
  );

  // Return the JSX for the product component
  return (
    <div className={"shadow-lg relative rounded-b-lg"}>
      <p className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 ">
          {/* Show the number of products sold or purchased */}
          {profile && !uploaded ? (
            <span
              className={
                "absolute z-10 right-0 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
              }
            >
               {product.numberOfProduct} purchased
            </span>
          ):(
            <span
              className={
                "absolute z-10 right-0 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
              }
            >
              {product.sold} sold
            </span>
          )}
          {/* Show the product image */}
          <img
            src={product.image}
            alt={"image"}
            className="w-full h-80 rounded-t-md  object-cover object-center group-hover:opacity-75"
          />
          {/* Show the address of the product owner as an identicon and link to the address on the Celo Explorer */}
          <Link
            href={`https://explorer.celo.org/alfajores/address/${product.owner}`}
            className={"absolute -mt-7 ml-6 h-16 w-16 rounded-full"}
          >
            {identiconTemplate(product.owner)}
          </Link>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">{product.name}</p>
            <div className={"h-28 overflow-y-hidden scrollbar-hide"}>
              {/* Show the product description */}
              <h3 className="mt-4 text-sm text-gray-700">
                {product.description}
              </h3>
            </div>
          </div>

          <div>
            <div className={"flex items-center justify-between flex-row"}>
              {/* Show the product location */}
              <h3 className="pt-1 flex items-center text-sm text-gray-700">
                <img src={"/location.svg"} alt="Location" className={"w-6"} />
                {product.location}
              </h3>
              <p className="text-md">Supply left: {product.supply}</p>
            </div>

            {/* Buy button that calls the purchaseProduct function on click */}
            {profile ? (
              <></>
            ):(
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={purchaseProduct}
                  className="mt-4 h-14 w-45% border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
                >
                  {/* Show the product price in cUSD */}
                  Buy for {productPriceFromWei} cUSD
                </button>

                <button
                  onClick={purchaseAllProduct}
                  className="mt-4 h-14 w-45% border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
                >
                  {/* Show the product price in cUSD */}
                  Buy all for {allProductPriceFromWei} cUSD
                </button>
              </div>
            )}
          </div>
        </div>
      </p>
    </div>
  );
};

export default Product;