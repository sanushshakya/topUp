import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import './UpdateProduct.scss'
import { useParams, Link } from 'react-router-dom';

const UpdateProduct = () => {
    
    const {productId} = useParams();
    const accessToken = Cookies.get('accessToken')
    const [user, setUser] = useState([]);
    const [products, setProduct] = useState([]);

    const handleUpdate = async(e) => {
        e.preventDefault(); 
        const formData = new FormData();
        formData.append('product_name',e.target.product_name.value);
        formData.append('cat_name',e.target.cat_name.value);
        formData.append('description', e.target.description.value);
        formData.append('price', e.target.price.value);
        // Check if a file is selected before appending it to the FormData
        const imageFile = e.target.elements.image_url.files[0];
        if (imageFile) {
            formData.append('image_url', imageFile);
        }
        formData.append('status', e.target.status.value);
        try{
            await axios.put(`http://localhost:8000/api/product/update/${productId}`, formData, {
              params: {
                token: accessToken
              }
            });
            window.location.href = `/productdetail/${productId}`
        }catch (error) {
          console.error(error.response.data);
        }
    }
    

    useEffect(() => {
        const fetchData = async () => {
          try{
            const resProduct = await axios.get(`http://localhost:8000/api/product/read_by_id/${productId}`)
                setProduct(resProduct.data)
            const response = await axios.post(`http://localhost:8000/api/auth/test-token/${accessToken}`)
                setUser(response.data)
          } catch (error){
            console.error(error);
          }
        }
      fetchData();
    }, [])
    {!isLoggedIn && (
      window.location.href = '/login'
    )}
    
  return (
    <div className='update'>
        <div className="container">
            <form onSubmit={handleUpdate} encType="multipart/form-data">
                <h1>Update Product: {products.product_name}</h1>
                <span>
                  <input name = "product_name" type="text" placeholder={products.product_name}/>
                </span>
                <span>
                  <input name = "cat_name" type="text" placeholder={products.cat_name}/>
                </span>
                <span>
                  <input name = "description" type="text" placeholder={products.description}/>
                </span>
                <span>
                  <input name = "price" type="text" placeholder={products.price}/>
                </span>
                <span>
                  <input name = "status" type="text" placeholder={products.status}/>
                </span>
                <h3>Update Image:</h3>
                <span>
                    <input name="image_url" type="file"/>
                </span>
                <button type='submit'>Update</button>
            </form>
        </div>
    </div>
  )
}

export default UpdateProduct
