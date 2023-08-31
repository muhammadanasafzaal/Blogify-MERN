import React, { useState } from 'react'

const Profile = () => {

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

  return (
    <div className='container-fluid' id='profile'>
        <div className="row">
            <div className="col-12 px-0">
                <div className='cover relative'>
                    <img src={profile?.cover} alt="profile cover" className='img-fluid' />
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