import {generateInterviewReport,getAllInterviewReports,getInterviewReport} from "../Services/interview.api"
import { useContext } from "react";
import { InterviewContext } from "../interview.context";


export const useInterview=()=>{
    const {loading,setLoading,report,setReport,reports,setReports}=useContext(InterviewContext);

    const genrateReport=async({resume,jobDescription,selfDescription})=>{
        setLoading(true);
        try {
            const reponse=await generateInterviewReport({resume,jobDescription,selfDescription});
            setReport(reponse.interviewReport);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const getReportbyId=async(interviewId)=>{
        setLoading(true);
        try {
            const response=await getInterviewReport(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const getAllReports=async()=>{
        setLoading(true);
        try {
            const response=await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    return {loading,report,reports,genrateReport,getReportbyId,getAllReports};
}