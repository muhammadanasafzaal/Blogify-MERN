import React from 'react'

const Hero = () => {
  return (
    <div className='container-fluid'>
        <div className="row">
            <div className="col-12 text-center text-light px-0 hero-main position-relative">
              <div className='hero'></div>
              <div className='hero-content'>
                <h1>Latest News Updates and Tips</h1>
                <h3>Only at <span style={{fontFamily: "'Shadows Into Light Two', cursive"}}>Blogify</span></h3>
                <h5>Writen by professionals. It connects people.</h5>
              </div>
            </div>
        </div>    
    </div>
  )
}

export default Hero