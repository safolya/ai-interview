import React from 'react'

import "../styles/home.scss"

const Home = () => {
  return (
    <main className='home'>
        <div className="interview_group">

      <div className='left'>
        <textarea name="jobDescription" id="jobDescription" placeholder='Enter Job Description'></textarea>
      </div>

      <div className='right'>
  
        <div className='input_group'>
          <p>Resume <small>(Use Resume and self Description together for better results)</small></p>
            <label className='file_label' htmlFor="resume">Upload Resume</label>
            <input hidden type="file" name="resume" id="resume" accept='.pdf' />
        </div>

        <div className='input_group'>
            <label htmlFor="selfDescription">Self Description</label>
            <textarea name="selfDescription" id="selfDescription" placeholder='Enter Self Description'></textarea>
        </div>

        <button className='button primary-button'>Generate Interview Report</button>

      </div>

        </div>
    </main>
  )
}

export default Home