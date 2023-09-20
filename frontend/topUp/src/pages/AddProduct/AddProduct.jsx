import React, {useState, useEffect} from 'react'
import './AddProduct.scss'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const AddProduct = () => {
    const accessToken = Cookies.get('accessToken')
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
    const [user, setUser] = useState([]);
    const[productId, setProductId] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try{
            const response = await axios.post(`http://localhost:8000/api/auth/test-token/${accessToken}`)
                setUser(response.data)
            } catch (error){
            console.error(error);
            }
        }
        fetchData();
    }, [])

    const schema = yup.object().shape({
        product_name: yup.string().required('Product name is required'),
        cat_name: yup.string().required('Category required'),
        description: yup.string().required('Description is required'),
        price: yup.string().required('Price is required'),
        image_url: yup.mixed().required('Profile image is required'),
      });
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });
      
    const onSubmit = async (data)=> {
        const formData = new FormData();
        formData.append('product_name', data.product_name);
        formData.append('cat_name', data.cat_name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('image_url', data.image_url[0]);
        try {
        const response = await axios.post('http://localhost:8000/api/product/create', formData);
        setProductId(response.data._id)
        window.location.href = `/productdetail/${productId}`
        // Handle the response as needed
        } catch (error) {
        console.error(error.response?.data || error);
        // Handle the error
        }
    }
    {!isLoggedIn && (
        window.location.href = '/login'
    )}
    {!user.role ==='admin' && (
        window.location.href = '/login'
    )}
  return (
    <div className='addproduct'>
        <div className="container">
            {user.role==='admin' && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Add New Product</h1>
                    <div className="credentials">
                        <span>
                            <input {...register('product_name')} type="text" placeholder='Enter new product name'/>
                        </span>
                        {errors.product_name && (
                            <span className="error-message">{errors.product_name.message}</span>
                        )}
                        <span>
                            <input {...register('cat_name')} type="text" placeholder='Enter product category '/>
                        </span>
                        {errors.cat_name && (
                            <span className="error-message">{errors.cat_name.message}</span>
                        )}
                        <span>
                            <input {...register('description')} type="text" placeholder='Enter about this product'/>
                        </span>
                        {errors.description && (
                            <span className="error-message">{errors.description.message}</span>
                        )}
                        <span>
                            <input {...register('price')} type="text" placeholder='Enter product price'/>
                        </span>
                        {errors.price && (
                            <span className="error-message">{errors.price.message}</span>
                        )}
                        <h4>Upload Profile:</h4>
                        <input {...register('image_url')} type="file"/>
                        {errors.image_url && (
                            <span className="error-message">{errors.image_url.message}</span>
                        )}
                    </div>
                    <button type="submit">Add Product</button>
                </form>
            )}
        </div>
    </div>
  )
}

export default AddProduct
