import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import './Profile.scss'

const Profile = () => {
    const accessToken = Cookies.get('accessToken')
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState(false)
    const [settings, setSettings] = useState(true)
    const [pass, setPass] = useState(false)
    const [ban, setBan] = useState(false)
    const [banners, setBanner] = useState([])
    const [addBan, setAddBan] = useState(false)
    

    const handleLogout = () => {
        Cookies.set("accessToken", null, { path: "/", expires: new Date(0) });
        Cookies.set("refreshToken", null, { path: "/", expires: new Date(0) });
        setIsLoggedIn(false);
        window.location.href = '/'
    };

    const handleSettings = () => {
        setAddBan(false);
        setSettings(true);
        setPass(false);
        setBanner(false);
    }

    const handleProfile = () => {
        setProfile(true);
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', e.target.username.value);
        formData.append('phone', e.target.phone.value);
        try {
          const response = await axios.put(`http://54.221.98.143:8000/api/user/update/${user._id}`, formData)
          setUser(response.data);
          setProfile(false);
        } catch (error) {
            console.error(error.response?.data || error);
        }
      };

    const handlePassword = () => {
        setSettings(false);
        setPass(true);
        setBanner(false);
        setAddBan(false);
    }

    const handlePassUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', e.target.password.value);
        try {
          const response = await axios.put(`http://54.221.98.143:8000/api/user/update/${user._id}`, formData)
          setPass(false);
          setSettings(true);
          setBanner(false);
        } catch (error) {
            console.error(error.response?.data || error);
        }
    };

    const handleBan = () => {
        setBan(true);
        setSettings(false);
        setPass(false);
        setAddBan(false);
    }
    const handleBanUpdate = () => {
        setBan(false);
        setAddBan(true);
    }

    const handleBanAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image_url', e.target.elements.image_url.files[0]);
        try {
            await axios.put(`http://54.221.98.143:8000/api/banner/create`, formData)
        } catch (error) {
            console.error(error.response?.data || error);
        }
        setAddBan(false);
        setBan(true);
    };

    const handleBanDel = async(id) => {
        await axios.delete(`http://54.221.98.143:8000/api/banner/delete/${id}`)
    }

    useEffect(()=>{
        const fetchData = async() => {
            try{
                const response = await axios.post(`http://54.221.98.143:8000/api/auth/test-token/${accessToken}`)
                setUser(response.data)
                const resBanner = await axios.get(`http://54.221.98.143:8000/api/banner/read`)
                setBanner(resBanner.data)
            } catch (error){
                console.error(error.response?.data || error);
            }
        }
        fetchData()
    }, [])

    {!isLoggedIn && (
        window.location.href = '/login'
    )}

  return (
    <div className='profile'>
        <div className="container">
            <h1>Account Settings</h1>
            <div className="detail">
                <div className="left">
                    <button onClick={handleSettings}>Profile Settings</button>
                    <button onClick={handlePassword}>Password</button>
                    {user.role==='admin' && (
                        <button onClick={handleBan}>Banners</button>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </div>
                {settings && (
                <div className="right">
                    <div className="top">
                        <div className="left">
                            <img src='/vite.svg' />
                        </div>
                        <div className="right">
                            <button onClick={handleProfile}>Update</button>
                        </div>
                    </div>
                    {!profile && (
                        <div className="bottom">
                            <span>
                                <label>Username</label>
                                <h3>{user.username}</h3>
                            </span>
                            <span>
                                <label>Email</label>
                                <h3>{user.email}</h3>
                            </span>
                            <span>
                                <label>Phone</label>
                                <h3>{user.phone}</h3>
                            </span>
                        </div>
                    )}
                    {profile && (
                        <div className="bottom">
                            <form onSubmit={handleProfileUpdate} encType="multipart/form-data">
                                <h1>Update Profile:</h1>
                                <span>
                                    <input name = "username" type="text" placeholder={user.username}/>
                                </span>
                                <span>
                                    <input name = "email" type="text" value={user.email}/>
                                </span>
                                <span>
                                    <input name = "phone" type="text" placeholder={user.phone}/>
                                </span>
                                <button type='submit'>Update</button>
                            </form>
                        </div>
                    )}
                </div>
                )}
                {pass && (
                    <div className="right pass">
                        <form onSubmit={handlePassUpdate}>
                            <input name="password" type="password" placeholder='Enter new password'/>
                            <button type='submit'>Change Password</button>
                        </form>
                    </div>
                )}
                {ban && (
                    <div className="right banner">
                        <div className="top">
                            <h1>Banners</h1>
                            <button onClick={handleBanUpdate}>Add New Banners</button>
                        </div>
                        {banners && banners.length > 0 ? (
                            banners.map((ban, index) => (
                                <div className="bans" key={index}>
                                    <span>
                                        <h3>{ban.image_url}</h3>
                                        <button onClick={() => handleBanDel(ban._id)}>delete</button>
                                    </span>
                                </div>
                            ))
                            ) : (
                            <p>No banners to display.</p>
                        )}
                    </div>
                )}
                {addBan && (
                    <div className="right addBan">
                        <form onSubmit={handleBanAdd}>
                            <input name='image_url' type="file"/>
                            <button type='submit'>Add Banner</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Profile
