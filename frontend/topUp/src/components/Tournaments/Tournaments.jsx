import React, {useEffect, useState} from 'react'
import './Tournaments.scss'
import Cookies from 'js-cookie'
import axios from 'axios'

const Tournaments = ({item}) => {
  const accessToken = Cookies.get('accessToken')
  const [user, setUser] = useState([]);

  const handleDelete = async(tourId)  => {
      try{
        const response = await axios.delete(`http://localhost:8000/api/tournament/delete/${tourId}`, {
          params: {
            token: accessToken
          }
        });
        window.location.href = `/tournament`
      }catch (error) {
        console.error(error.response.data);
      }
  }

  useEffect(()=>{
    const fetchData = async() => {
      try{
        const resUser = await axios.post(`http://localhost:8000/api/auth/test-token/${accessToken}`)
        setUser(resUser.data)
      } catch (error){
        console.error(error.response?.data || error);
      }
    }
    fetchData()
  }, []);
  return (
    <div className='tour'>
      <div className="banner">
        <img src={`/${item.image_url}`}/>
      </div>
      <div className="detail">
        <h1>Name: {item.name}</h1>
        <h3>Price: Rs. {item.price}</h3>
        <span>
          {item.description}
        </span>
      </div>
      {user.role==='admin' && (
        <div className="btns">
          <button onClick={() => handleDelete(item._id)}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default Tournaments;
