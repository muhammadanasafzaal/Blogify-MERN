import React, { useState, useEffect } from 'react'

const FormatDate = ({ createdDate }) => {

    const [formattedDate, setFormattedDate] = useState('')

    const formatDate = () => {
        if(createdDate){
            const d = new Date(createdDate).toLocaleDateString('en-GB');
            setFormattedDate(d.replaceAll('/', '-'))
        }
    }

    useEffect(() => {
        formatDate()
    }, [])

    return (
    <>
        {formattedDate}
    </>
  )
}

export default FormatDate