import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../util/axios'
import { useDispatch } from 'react-redux'
import { isLoading } from '../../store/generalSlice'

const Profile = () => {

    const api = process.env.REACT_APP_API_KEY

    const { userId } = useParams();
    const dispatch = useDispatch()

    const [profile, setProfile] = useState(
        {
            id:1,
            username:"Alex String",
            followers: [],
            following: [],
            designation: "Writer",
            avatar: `${api}uploads/user.jpg`,
            cover: `${api}uploads/cover.jpg`,
            blog_count: 1
        }
    )
    const [cover, setCover] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)
    const [coverEdit, setCoverEdit] = useState(false)

    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [avatarEdit, setAvatarEdit] = useState(false)

    const [tempUsername, setTempUsername] = useState(null)
    const [usernameEdit, setUsernameEdit] = useState(false)

    const [tempDesignation, setTempDesignation] = useState(null)
    const [designationEdit, setDesignationEdit] = useState(false)

    const [isExternalUser, setIsExternalUser] = useState(true)

    const [headers, setHeaders] = useState({
        "Authorization": localStorage.getItem('access_token')
    })

    const handleCoverUpload = (e) => {
        setCoverEdit(true)
        setCoverPreview(URL.createObjectURL(e.target.files[0]))
        setCover(e.target.files[0])
    }


    const handleAvatarUpload = (e) => {
        setAvatarEdit(true)
        setAvatarPreview(URL.createObjectURL(e.target.files[0]))
        setAvatar(e.target.files[0])
    }

    const getUserProfile = async () => {
        const myUserId = JSON.parse(localStorage.getItem('user'))?.id
        let res = null
        if(userId){
            if(userId == myUserId){
                setIsExternalUser(false)
                res = await axiosInstance.get(`${api}user/profile/${myUserId}`)
            }
            else{
                setIsExternalUser(true)
                res = await axiosInstance.get(`${api}user/profile/${userId}`)
            }
        }
        else{
            setIsExternalUser(false)
            res = await axiosInstance.get(`${api}user/profile/${myUserId}`)
        }
        dispatch(isLoading(true))
        if(res && res.data.status_code==200){
            setProfile({
                avatar: res.data.data.avatar ? api+res.data.data.avatar : profile.avatar,
                cover: res.data.data.cover ? api+res.data.data.cover : profile.cover,
                designation: res.data.data.designation,
                email: res.data.data.email,
                username: res.data.data.username,
                id: res.data.data._id,
                followers: res.data.data.followers,
                following: res.data.data.following,
                blog_count: res.data.data.blog_count,
            })
            dispatch(isLoading(false))
        }
        else dispatch(isLoading(false))
    }

    const updateUserProfile = async (key, value) => {
        const userId = JSON.parse(localStorage.getItem('user'))?.id
        const data = {}
        data[key] = value
        if(key == 'avatar' || key == 'cover'){
            let formData = new FormData()
            formData.append(key, (key == 'cover') ? cover : avatar)
            // let header = {
            //   "Content-Type": "multipart/form-data",
            //   ...headers
            // }
            dispatch(isLoading(true))
            const res = await axiosInstance.put(`${api}user/profile/update/${userId}`, formData)
            
            if(res && res.data.status_code==200) {
                dispatch(isLoading(false))
                return true            
            }
            else{
                dispatch(isLoading(false))
                return false
            }
        }
        else{
            dispatch(isLoading(true))
            const res = await axiosInstance.put(`${api}user/profile/update/${userId}`,data)
            
            if(res && res.data.status_code==200){
                if(key == 'username') setTempUsername(null)
                else if(key == 'designation') setTempDesignation(null)
            
                dispatch(isLoading(false))
                return true            
            }
            else{
                dispatch(isLoading(false))
                return false
            }
        }

    }

    const handleUsernameEdit = (e) => {
        setUsernameEdit(true)
        setTempUsername(e.target.value)
    }

    const handleDesignationEdit = (e) => {
        setDesignationEdit(true)
        setTempDesignation(e.target.value)
    }

    const confirmData = (field, confirm) => {
        if(!field){
            return
        }
        if(field == 'username'){
            setUsernameEdit(false)
        }
        else if(field == 'designation'){
            setDesignationEdit(false)
        }
        else if(field == 'avatar'){
            setAvatarEdit(false)
        }
        else{
            setCoverEdit(false)            
        }

        if(confirm){
            const data = {}
            data[field] = field == 'username' ? tempUsername : field == 'designation' ? tempDesignation : field == 'avatar' ? avatar : cover
            if(data && data[field]){                
                if(updateUserProfile(field, data[field])){
                    setProfile({...profile, ...data})
                }
                else{
                    if(field == 'avatar' || field == 'cover'){
                        setAvatarPreview(typeof profile[field] != 'string' ? URL.createObjectURL(profile[field]) : profile[field])
                    }  
                }
            }
        }
        else{
            if(field == 'avatar') setAvatarPreview(typeof profile[field] != 'string' ? URL.createObjectURL(profile[field]) : profile[field])
            else setCoverPreview(typeof profile[field] != 'string' ? URL.createObjectURL(profile[field]) : profile[field])
        }
    }
    

    useEffect(() => {
        getUserProfile()
    }, [])
    

  return (
    <div className='container-fluid' id='profile'>
        <div className="row">
            <div className="col-12 px-0">
                <div className='main relative'>
                    <img src={coverPreview ? coverPreview : profile?.cover } alt="profile cover" className='img-fluid' />
                    {
                        !isExternalUser && coverEdit ?
                    <>
                        <div className='edit-cover' onClick={()=>confirmData('cover', true)}>
                            <i className='fa fa-check cp'></i> 
                        </div>
                        <div className='edit-cover' style={{ top:'15%', transform:'translateY(-15%)' }} onClick={()=>confirmData('cover',false)}>
                            <i className='fa fa-close cp'></i> 
                        </div>
                    </>
                    : !isExternalUser && !coverEdit ?
                    <div className='edit-cover' >
                        <label htmlFor="cover" className='mb-1 ml-2'>
                            <i className='fa fa-pencil cp'></i>
                        </label>
                        <input className='form-control p-0 invisible' type="file" name="cover" id="cover" onChange={handleCoverUpload}
                            accept="image/x-png,image/jpeg,image/jpg"
                        />
                    </div>
                    :""
                    }
                    
                    <div className='avatar'>
                        <div className='relative'>
                            <img src={avatarPreview ? avatarPreview : profile?.avatar} alt={profile?.username} className='img-fluid' />
                            {
                                !isExternalUser && avatarEdit ?
                                <>
                                    <div className='edit-avatar' onClick={()=>confirmData('avatar',true)}>
                                        <i className='fa fa-check cp'></i> 
                                    </div>
                                    <div className='edit-avatar' style={{ top:'-25%', transform:'translateY(25%)' }} onClick={()=>confirmData('avatar',false)}>
                                        <i className='fa fa-close cp'></i> 
                                    </div>
                                </>
                                : !isExternalUser && !avatarEdit ?
                                <div className='edit-avatar' >
                                    <label htmlFor="avatar" className='mb-1 ml-2'>
                                        <i className='fa fa-pencil cp'></i>
                                    </label>
                                    <input className='form-control p-0 invisible' type="file" name="avatar" id="avatar" onChange={handleAvatarUpload}
                                        accept="image/x-png,image/jpeg,image/jpg"
                                    />
                                </div>
                                : ""
                            }
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-around align-items-center'>
                    <div className='py-2 text-center'>
                        <h3>{profile?.followers.length}</h3>
                        <small>Followers</small>
                    </div>
                    <div className='py-2 text-center'>
                        <h3>{profile?.following.length}</h3>
                        <small>Following</small>
                    </div>
                </div>
            </div>
            <div className={usernameEdit ? `col-2 offset-md-5 text-center mb-2 d-flex align-items-center` : `col-12 text-center mb-2`}>
                {
                    !isExternalUser && usernameEdit ?  
                    <>
                        <input type="text" className="form-control" name="username" id="username" onChange={handleUsernameEdit} />
                        <span className="cp" onClick={()=>confirmData('username',true)}>
                            <i className='fa fa-check d-inline-block ml-2 mb-2'></i>
                        </span> 
                    </>
                    : !isExternalUser && !usernameEdit ?
                    <>
                        <h4 className='d-inline-block'>{profile?.username}</h4>
                        <span className="cp" onClick={()=>setUsernameEdit(true)}>
                            <i className='fa fa-pencil d-inline-block ml-2 mb-2'></i>
                        </span>
                    </>
                    :
                    <>
                    <h4 className='d-inline-block'>{profile?.username}</h4>
                    </>
                }
            </div>
            <div className={designationEdit ? `col-2 offset-md-5 text-center mb-4 d-flex align-items-center` : `col-12 text-center mb-4`}>
                {
                    !isExternalUser && designationEdit ?
                    <>
                        <input type="text" className="form-control" name="designation" id="designation" onChange={handleDesignationEdit} />
                        <span className="cp" onClick={()=>confirmData('designation',true)}>
                            <i className='fa fa-check d-inline-block ml-2 mb-2' ></i>
                        </span>
                    </>
                    : !isExternalUser && !designationEdit ?
                  <>
                    <small className='d-inline-block'>{profile?.designation ? profile?.designation : 'Add your designation'}</small>
                    <span className="cp" onClick={()=>setDesignationEdit(true)}>
                        <i className='fa fa-pencil d-inline-block ml-2 mb-2'></i>
                    </span>
                  </>  
                  :
                  <>
                  <small className='d-inline-block'>{profile?.designation ? profile?.designation : 'Designation not available'}</small>
                  </>
                }
            </div>
        </div>
    </div>
  )
}

export default Profile