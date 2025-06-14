import React from 'react'
import img1 from "../../assets/images/update-pg1.jpg"
import img2 from "../../assets/images/update-pg2.jpg"
import "./Update.css"

const Update = () => {
  return (
    <div>
        <div className="img-cont">
            <img src={img1} alt="img-1" />
            <img src={img2} alt="img-1" />
        </div>
    </div>
  )
}

export default Update
