import product from '@/sanityecommerce/schemas/product';
import React,{createContext,useContext,useState,useEffect} from 'react';
import { toast } from 'react-hot-toast';
const Context = createContext()

export const StateContext=({children})=>{
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [quantity, setquantity] = useState(1)
  
  let foundProduct
  let index
  const onAdd=(product,quantity)=>{
    const checkProductInCart = cartItems.find(item => item._id === product._id)
    setTotalPrice(prevState=>prevState + product.price * quantity)
    setTotalQuantities(prevState=>prevState + quantity)
    if(checkProductInCart){
      const updatedCartItems = cartItems.map(item => {
        if(item._id === product._id)return {...item,quantity:item.quantity +quantity}
      })
      setCartItems(updatedCartItems)
    }else{
      product.quantity= quantity
      setCartItems([...cartItems,{...product}])
    }
    toast.success(`${quantity} ${product.name} added to the cart `)
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const tempCart = cartItems.filter((item) => item._id !== product._id);
    setTotalPrice(totalPrice - foundProduct.price * foundProduct.quantity);
    setTotalQuantities(totalQuantities - foundProduct.quantity);
    setCartItems(tempCart);
  };
  const toggleCartItemQuantity = (id,value)=>{
    foundProduct=cartItems.find(item=>item._id === id);
    index =cartItems.findIndex(product=> product._id ===id)
    const newCartItems=cartItems.filter(item=> item._id !== id);
    if(value ==='inc'){
      setCartItems([...newCartItems,{...foundProduct,quantity:foundProduct.quantity+1}])
      setTotalPrice(prevState=>prevState + foundProduct.price)
      setTotalQuantities(prevState=>prevState + 1)
    }else if(value ==='dec'){
      if(foundProduct.quantity > 1){
        setCartItems([...newCartItems,{...foundProduct,quantity:foundProduct.quantity-1}])
        setTotalPrice(prevState=>prevState - foundProduct.price)
        setTotalQuantities(prevState=>prevState - 1)
      }
    }
  }
  const incQty=()=>{
    setquantity(prevState=>prevState +1)
  }
  const decQty=()=>{
    setquantity(prevState=>{
      if(prevState-1 <1) return 1;
      return prevState - 1
    })
  }
  return(
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        quantity,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext =()=> useContext(Context)