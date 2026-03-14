import React from 'react'
import {useInterview} from "../hooks/useInterview"
const Interview = () => {
  const {loading,report,reports,genrateReport,getReportbyId,getAllReports} = useInterview();
  return (
    <div>
      <h1>Interview Page</h1>
    </div>
  )
}

export default Interview