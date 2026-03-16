import {generateInterviewReport,getAllInterviewReports,getInterviewReport} from "../Services/interview.api"
import { useContext } from "react";
import { InterviewContext } from "../interview.context";


export const useInterview=()=>{
    const {loading,setLoading,report,setReport,reports,setReports}=useContext(InterviewContext);

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
            setReports(response.interviewReports);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
        return response.interviewReports;
    }

    return {loading,report,reports,genrateReport,getReportbyId,getAllReports};
}