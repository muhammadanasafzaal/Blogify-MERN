import React, { useState, useEffect } from 'react'

const Profile = () => {

    const api = process.env.REACT_APP_API_KEY
    const [profile, setProfile] = useState(
        {
            id:1,
            name:"Alex String",
            followers: [],
            following: [],
            designation: "Writer",
            avatar: "/images/author/1.png",
            cover: "/images/covers/blog1.jpg",
            blog_count: 1
        }
    )
    const [cover, setCover] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)
    const [coverEdit, setCoverEdit] = useState(false)

    const handleCoverUpload = (e) => {
        // setProfile({
        //     ...profile,
        //     cover:e.target.files[0],
        // })
        setCoverEdit(true)
        setCoverPreview(URL.createObjectURL(e.target.files[0]))
        setCover(e.target.files[0])
        console.log(e.target.files[0])
    }

    const confirmCover = (confirm) => {
        setCoverEdit(false)
        if(confirm){
            setProfile({...profile,cover:cover})
            console.log(profile.cover)
        }
        else{
            setCoverPreview(null)
        }
    }

    useEffect(() => {
        
    }, [])
    

  return (
    <div className='container-fluid' id='profile'>
        <div className="row">
            <div className="col-12 px-0">
                <div className='cover relative'>
                    <img src={coverPreview ? coverPreview : profile?.cover} alt="profile cover" className='img-fluid' />
                    {
                        coverEdit ?
                    <>
                        <div className='edit-cover' onClick={()=>confirmCover(true)}>
                            <i className='fa fa-check cp'></i> 
                        </div>
                        <div className='edit-cover' style={{ top:'15%', transformY:'translate(-15%)' }} onClick={()=>confirmCover(false)}>
                            <i className='fa fa-close cp'></i> 
                        </div>
                    </>
                    :
                    <div className='edit-cover' >
                        <label htmlFor="cover" className='mb-1 ml-2'>
                            <i className='fa fa-edit cp'></i>
                        </label>
                        <input className='form-control p-0 invisible' type="file" name="cover" id="cover" onChange={handleCoverUpload}
                            accept="image/x-png,image/jpeg,image/jpg"
                        />
                    </div>
                    }
                    
                    <div className='avatar'>
                        <img src={profile?.avatar} alt={profile?.name} className='img-fluid' />
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
            <div className="col-12 text-center py-3 pb-4">
                <h4>{profile?.name}</h4>
                <small className='d-block'>{profile?.designation}</small>
            </div>
        </div>
    </div>
  )
}

export default Profile