/* eslint-disable react-hooks/exhaustive-deps */
import { generateInterviewReport, getAllInterviewReports, getInterviewReport, generateResumePdf } from "../Services/interview.api"
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const { loading, setLoading, report, setReport, reports, setReports } = useContext(InterviewContext);
    const { interviewId } = useParams()

    const genrateReport = async ({ resume, jobDescription, selfDescription }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ resume, jobDescription, selfDescription });
            console.log(response);
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        return response.interviewReport;
    }

    const getReportbyId = async (interviewId) => {
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReport(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        return response.interviewReport;
    }

    const getAllReports = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            console.log(response.interviewReports);
            setReports(response.interviewReports);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        return response.interviewReports;
    }


    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        let response = null;
        try {
            const blob = await generateResumePdf(interviewReportId);
            const url=window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        return response;
    }

    useEffect(() => {
        if (interviewId) {
            getReportbyId(interviewId)
        } else {
            getAllReports()
        }
    }, [interviewId])


    return { loading, report, reports, genrateReport, getReportbyId, getAllReports, getResumePdf };
}