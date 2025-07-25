import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import OrderDisplay from "../OrderDisplay/OrderDisplay";
import { calculateTotal, calculateTaxesAndFees } from "../../utils/calculations";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart";
import "./App.css";


function App() {

  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", dorm_number: ""});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  const generateReceiptLines = (order) => {
    if (!order || !order.orderItems) return [];
    const lines = ["Thank you for your purchase!"]

    order.orderItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      lines.push(`${product.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`);
    })
    const total = parseFloat(order.totalPrice);
    lines.push(`Total: $${total.toFixed(2)}`);

    return lines;
  }

    const fetchOrders = async () => {
      try {
        const {data} = await axios.get("http://localhost:3000/orders");
        setOrders(data);
      } catch (err) {
        console.log("Error fetching orders: ", err);
      }
    }

  const handleOnCheckout = async () => {
    try {
      //Construct order items
      let finalOrder = [];
      let total = 0;
      for (const [productId, quantity] of Object.entries(cart)) {
        let product = products.find((p) => p.id == Number(productId));
        finalOrder.push({
          productId: Number(productId),
          quantity: quantity, 
          price: product.price,
        })
        total += (product.price * quantity);
      }

      total = calculateTotal(total);

      //Create order
      const {data} = await axios.post("http://localhost:3000/orders", {
        customerId: Number(userInfo.dorm_number),
        totalPrice: total,
        status: "Completed",
        orderItems: finalOrder
      });

      //Modify order object for receipt generation
      const newOrder = {
        ...data,
        purchase: {
          receipt: {
            lines: generateReceiptLines(data)
          }
        }
      };
      await fetchOrders();
      setOrder(newOrder);
      setUserInfo({ name: "", dorm_number: "" });
      setCart({});
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
          const {data} = await axios.get("http://localhost:3000/products");
          setProducts(data);
    } catch (err) {
      console.log("Error fetching products: ", err);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [])


  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
            
          <Routes>
            <Route
              path="/"
              element={
              <>
                <SubNavbar
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  searchInputValue={searchInputValue}
                  handleOnSearchInputChange={handleOnSearchInputChange}
                />
                <Home
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              </>
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <OrderDisplay
                  orders={orders}
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
            
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
 