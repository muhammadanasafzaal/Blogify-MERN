import React, { useEffect, useState } from 'react'

const Footer = () => {
    const [date, setDate] = useState(null)

    const getDate = () => {
        const date = new Date()
        setDate(date.getFullYear())
    }

    useEffect(() => {
        getDate()
    }, [])
    

    return (
        <footer class="footer">
            <div className='container py-5'>
                <div className="row">
                    <div className="col-md-4 col-12">
                        <a className='navbar-brand' style={{ fontSize: '2.5rem' }}>Blogify</a>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum nihil, consequuntur voluptatum ad commodi nulla veritatis totam ratione quis non temporibus, id distinctio? Cumque at est aspernatur, dignissimos doloremque in?</p>
                    </div>
                    {/* <div className="col-4">
                    <ul>
                        <li>Categories</li>
                        <li>Happenings</li>
                        <li>About Blogify</li>
                    </ul>
                </div> */}
                </div>
                <div className="row mt-3">
                    <div className="col-12 text-center">
                        <small>Copyright {date}. Blogify All Rights Reserved.</small>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer