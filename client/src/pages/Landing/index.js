import React from 'react'
import EditorsPick from '../../components/EditorsPick'
import LatestArticles from '../../components/LatestArticles'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Landing = () => {
  return (
    <div className='container-fluid'>
        <div className="row">
            <div className="col-12 p-0">
                <section className='py-5'>
                  <LatestArticles/>
                </section>
                <section className='py-5 bg-gray'>
                  <EditorsPick/>
                </section>
            </div>
        </div>
    </div>
  )
}

export default Landing