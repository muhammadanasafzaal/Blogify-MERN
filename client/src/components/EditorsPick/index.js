import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const EditorsPick = () => {

  const [slides, setSlides] = useState([])
  const [slideCount, setSlideCount] = useState(0)

  const getBlogsForSlides = async () => {
    const res = await axios.get('/data/blogs.json')
    if(res && res.data){
      setSlides([])
      setSlides([...res.data])
    }
  }

  const rotateSlide = (mode) => {
    if(slides.length){
      if(mode == '+'){
        if(slideCount<slides.length-1){
          setSlideCount(slideCount+1)
        }
        else{
          setSlideCount(0)
        }
      }
      else{
        if(slideCount>0){
          setSlideCount(slideCount-1)
        }
        else{
          setSlideCount(slides.length-1)
        }
      }
    }
  }

  useEffect(() => {
    getBlogsForSlides()
  }, [])
  

  return (
    <div className='container'>
      <div className='row'>
        <div className="col-12 mb-2">
          <h2>Editor's Pick</h2>
          <p>Discover the most outstanding articles in all topics of life.</p>
        </div>
        <div className="col-12">
          <div className='row slide'>
            <div className='details border bg-light col-12 order-xs-2 p-4'>
              <div>
                <span className='category-badge'>{slides[slideCount]?.category}</span>
                <h4>{slides[slideCount]?.title}</h4>
                <div>
                  <div>
                    <img src={slides[slideCount]?.author_img} alt={slides[slideCount]?.title} className='author-img img-fluid'/>
                  </div>
                  <div>
                    <h5>{slides[slideCount]?.author}</h5>
                    <small>{slides[slideCount]?.date}</small>
                  </div>
                </div>
              </div>
              <div className='indicators bg-light py-4'>
                <button className='btn btn-dark' onClick={()=>rotateSlide('-')}><i className='fa fa-chevron-left'></i></button>
                <button className='btn btn-dark ml-1' onClick={()=>rotateSlide('+')}><i className='fa fa-chevron-right'></i></button>
              </div>
            </div>
            <div className='col-md-8 col-12 offset-md-4 order-xs-1 cover px-md-2 px-0'>
              <img src={slides[slideCount]?.cover} alt="" className='img-fluid'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorsPick