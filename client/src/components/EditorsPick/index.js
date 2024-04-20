import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import GetCategoryName from '../../components/CategoryName'
import FormatDate from '../../components/FormatDate'
import { isLoading } from '../../store/generalSlice'
import axiosInstance from '../../util/axios'

const EditorsPick = () => {
  const api = process.env.REACT_APP_API_KEY

  const [slides, setSlides] = useState([])
  const [slideCount, setSlideCount] = useState(0)
  const [headers, setHeaders] = useState({
    "Authorization": localStorage.getItem('access-token')
  })

  const dispatch = useDispatch()

  const getBlogsForSlides = async () => {
    // const res = await axios.get('/data/blogs.json')
    dispatch(isLoading(true))
    console.log('blog for editor pick')
    const res = await axiosInstance.get(`${api}blogs/`)
    if(res && res.data.data){
      console.log('resp editor pick blog',res.data.data)
      setSlides([])
      setSlides([...res.data.data])
      isLoading(false)
    }
    else{
      dispatch(isLoading(false))
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
                {
                  slides[slideCount]?.categories.map((item, index) => {
                    return (
                          <span className='category-badge mr-1' key={index}>
                            <GetCategoryName catId={item} />
                          </span>
                        )
                    })
                }
                <h4>{slides[slideCount]?.title}</h4>
                <div>
                  <div>
                    <img src={slides[slideCount]?.author.avatar ? api+slides[slideCount]?.author.avatar : api+"uploads/user.jpg"} alt={slides[slideCount]?.title} className='author-img img-fluid'/>
                  </div>
                  <div>
                    <h6>{slides[slideCount]?.author.username}</h6>
                    <small>
                      <FormatDate createdDate={slides[slideCount]?.createdAt} />
                    </small>
                  </div>
                </div>
              </div>
              <div className='indicators bg-light py-4'>
                <button className='btn btn-dark' onClick={()=>rotateSlide('-')}><i className='fa fa-chevron-left mr-1'></i></button>
                <button className='btn btn-dark ml-1' onClick={()=>rotateSlide('+')}><i className='fa fa-chevron-right ml-1'></i></button>
              </div>
            </div>
            <div className='col-md-8 col-12 offset-md-4 order-xs-1 cover px-md-2 px-0'>
              <img src={api+slides[slideCount]?.cover} alt="" className='img-fluid'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorsPick