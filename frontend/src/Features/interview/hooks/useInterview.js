import {generateInterviewReport,getAllInterviewReports,getInterviewReport} from "../Services/interview.api"
import { useContext,useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview=()=>{
    const {loading,setLoading,report,setReport,reports,setReports}=useContext(InterviewContext);
    const { interviewId } = useParams()

    const genrateReport=async({resume,jobDescription,selfDescription})=>{
        setLoading(true);
        let response=null;
        try {
             response=await generateInterviewReport({resume,jobDescription,selfDescription});
             console.log(response);
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }

        return response.interviewReport;
    }

    const getReportbyId=async(interviewId)=>{
        setLoading(true);
        let response=null;
        try {
            response=await getInterviewReport(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
        return response.interviewReport;
    }

    const getAllReports=async()=>{
        setLoading(true);
        let response=null;
        try {
            response=await getAllInterviewReports();
            console.log(response.interviewReports);
            setReports(response.interviewReports);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
        return response.interviewReports;
    }

      useEffect(() => {
        if (interviewId) {
            getReportbyId(interviewId)
        } else {
            getAllReports()
        }
    }, [ interviewId ])


    return {loading,report,reports,genrateReport,getReportbyId,getAllReports};
}