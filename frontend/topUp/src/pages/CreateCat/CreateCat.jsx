import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './CreateCat.scss'

const CreateCat = () => {
    const accessToken = Cookies.get('accessToken')
    const [user, setUser] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try{
            const response = await axios.post(`http://54.221.98.143:8000/api/auth/test-token/${accessToken}`)
                setUser(response.data)
            } catch (error){
            console.error(error);
            }
        }
        fetchData();
    }, [])

    const schema = yup.object().shape({
        cat_name: yup.string().required('Category required'),
        description: yup.string().required('Description is required'),
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
        formData.append('cat_name', data.cat_name);
        formData.append('description', data.description);
        formData.append('image_url', data.image_url[0]);
        try {
        await axios.post('http://54.221.98.143:8000/api/category/create', formData, {
            params: {
              token: accessToken
            }
          });
        window.location.href = `/`
        // Handle the response as needed
        } catch (error) {
        console.error(error.response?.data || error);
        // Handle the error
        }
    }
  return (
    <div className='cat'>
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Add New Category</h1>
                <div className="credentials">
                    <span>
                        <input {...register('cat_name')} type="text" placeholder='Enter category name '/>
                    </span>
                    {errors.cat_name && (
                        <span className="error-message">{errors.cat_name.message}</span>
                    )}
                    <span>
                        <input {...register('description')} type="text" placeholder='Enter about this category'/>
                    </span>
                    {errors.description && (
                        <span className="error-message">{errors.description.message}</span>
                    )}
                    <h4>Upload Profile:</h4>
                    <input {...register('image_url')} type="file"/>
                    {errors.image_url && (
                        <span className="error-message">{errors.image_url.message}</span>
                    )}
                </div>
                <button type="submit">Add Category</button>
            </form>
        </div>
    </div>
  )
}

export default CreateCat
