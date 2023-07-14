import React, { useState,useContext } from 'react'
import { client,urlFor } from '@/lib/client'
import { AiOutlineMinus,AiOutlinePlus,AiOutlineStar,AiFillStar } from 'react-icons/ai'
import { Products } from '@/components'
import { useStateContext } from '@/context/StateContext'

const ProductDetails = ({product,products}) => {
  const {image,name,details,price} = product
  const [index, setIndex] = useState(0)
  const {incQty,decQty,quantity,onAdd,setShowCart}= useStateContext()
  const handleBuyNow =()=>{
    onAdd(product,quantity)
    setShowCart(true)
  }
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img src={urlFor(image && image[index])} alt="" className='product-detail-image' />
          </div>
          <div className="small-images-container">
            {image?.map((item,i)=>(
              <img 
                key={i}
                src={urlFor(item)} 
                alt="samll-images" 
                onMouseEnter={()=>setIndex(i)}
                className={i===index ?'small-image selected-image':'small-image' }
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className='reviews'>
            <div>
              <AiFillStar/>
              <AiFillStar/>
              <AiFillStar/>
              <AiFillStar/>
              <AiOutlineStar/>
            </div>
            <p>(20)</p>
          </div>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className='quantity'>
            <h3>Quantity:</h3>
            <p className='quantity-desc'>
              <span className='minus' onClick={decQty}><AiOutlineMinus/></span>
              <span className='num' >{quantity}</span>
              <span className='plus' onClick={incQty}><AiOutlinePlus/></span>
            </p>
          </div>
          <div className="buttons">
            <button type='button' className='add-to-cart' onClick={()=>onAdd(product,quantity)}>Add to Cart</button>
            <button type='button' className='buy-now' onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
      <div className='maylike-products-wrapper'>
          <h2>You May also Like</h2>
          <div className='marquee'>
            <div className="maylike-products-container track">
              {products.map(item=>(
                <Products key={item._id} product={item} />
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}
export const getStaticPaths=async()=>{
  const query =`*[_type == 'product' ]{
    slug{
      current
    }
  }`
  const products =await client.fetch(query)
  const paths = products.map(product => ({
    params:{
      slug:product.slug.current
    }
  }))
  return {
    paths,
    fallback:'blocking'
  }
}
export const getStaticProps = async ({params:{slug}})=>{
  const query = `*[_type=="product" && slug.current=='${slug}'][0]`
  const product = await client.fetch(query)
  const productsQuery = '*[_type=="product"]'
  const products = await client.fetch(productsQuery)

  return {
    props:{product,products}
  }

}

export default ProductDetails