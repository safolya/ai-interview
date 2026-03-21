import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

/**
 * @desc Service functions for handling interview report generation and retrieval by making API calls to the backend
 */

export async function generateInterviewReport({resume,jobDescription,selfDescription}){
    try {
        const formData=new FormData();
        formData.append("resume",resume);
        formData.append("jobDescription",jobDescription);
        formData.append("selfDescription",selfDescription);
        const response=await api.post("/api/interview/",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })
        return response.data;

    } catch (error) {
        console.log(error);
    }
}    

/**
 * @desc Service function for fetching the interview report for a specific interview ID by making an API call to the backend
 * @param {string} interviewId - The ID of the interview report to fetch
 * @returns {object} - The interview report data returned from the backend
 */

export const getInterviewReport=async(interviewId)=>{
    try {
        const response=await api.get(`api/interview/report/${interviewId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/**
 * @desc Service function for fetching all interview reports by making an API call to the backend
 * @returns {array} - An array of all interview reports returned from the backend
 */

export const getAllInterviewReports=async()=>{
    try {
        const response=await api.get("api/interview/");
        return response.data;
    } catch (error) {
        console.log(error);
    }       
}

/**
 * @desc Service function for generating a resume PDF based on the resume content, self description and job description by making an API call to the backend
 * @param {string} interviewReportId - The ID of the interview report for which to generate the resume PDF
 * @param {object} data - An object containing the resume content, self description and job description
 * @returns {object} - The generated resume PDF data returned from the backend
 */

export const generateResumePdf=async(interviewReportId)=>{
    try {
        const response=await api.post(`api/interview/resume/pdf/${interviewReportId}`,null,{
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}