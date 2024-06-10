import axios from 'axios';

export const compile_and_submit=async (myCookie, myCode, ques, pid) =>{

    const compile_url = `https://practiceapiorigin.geeksforgeeks.org/api/latest/problems/${ques}/submit/compile/`;

    const headers = {
        Cookie: myCookie
    }
    const data = {
        source: "https://www.geeksforgeeks.org",
        request_type: "solutionCheck",
        userCode: "",
        language: "cpp",
        code: myCode
    }
    const res = await axios.post(compile_url, data, {
        headers: headers
    });

    const s_id = res.data.results.submission_id;
    console.log(s_id);
    const submit_url=`https://practiceapiorigin.geeksforgeeks.org/api/latest/problems/submission/submit/result/`;
    const submit_data={
        sub_id: s_id,
        sub_type: "submit",
        pid: pid
    }

    const submit_res=await axios.post(submit_url, submit_data, {headers: headers});
}
