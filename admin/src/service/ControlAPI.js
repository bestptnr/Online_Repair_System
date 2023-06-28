import axios from "axios";



export async function TechAuth(data) {
    const { email, pwd } = data
    const login = await axios.post(`http://localhost:3000/tech/login`, {
        email,
        password: pwd
    }).then((result) => {
        console.log(result)
        return result.data
    })
    return login
}

export async function getAllRequest() {
    const token = await localStorage.getItem('token')
    const data = await axios.get(`http://localhost:3000/api/user/getAllRequest`, {
        headers: {
            "auth-token": token
        }
    }).then((result) => {
        return result
    })
    return data.data
}
export async function getrequest() {
    const token = await localStorage.getItem('token')
    const data = await axios.get(`http://localhost:3000/tech/all`, {
        headers: {
            "auth-token": token
        }
    }).then((result) => {
        return result
    })
    return data.data
}
export async function getrequestpage(page) {

    const token = await localStorage.getItem('token')
    const data = await axios.get(`http://localhost:3000/tech/request?page=${page}`, {
        headers: {
            "auth-token": token
        }
    }).then((result) => {
        return result
    })
    return data
}
export async function getrequestprocess(page) {
  
    const token = await localStorage.getItem('token')
    const data = await axios.get(`http://localhost:3000/tech/request/${page.id}?page=${page.page}`, {
        headers: {
            "auth-token": token
        }
    }).then((result) => {
        return result
    })
    return data
}
export async function acceptRequest(accecpt) {
    const token = await localStorage.getItem('token')
    const { id, request } = accecpt

    const data = await axios.put(`http://localhost:3000/tech/accept`, {
        techID: id,
        reqID: request
    }, {
        headers: {
            "auth-token": token
        }
    }).then((result) => {
        return result
    })
    return data

}

export async function successRequest(success) {
    const token = await localStorage.getItem('token')
    const { id, request } = success

    const data = await axios.get(`http://localhost:3000/tech/request/success/${success.id}?page=${success.page}`, {
        headers: {
            "auth-token": token
        }
    }).then((result) => {
        return result
    })
    return data

}

export async function savesuccess(success) {
    const token = await localStorage.getItem('token')
    const { id, request } = success
    const data = await axios.put(`http://localhost:3000/tech/success`, {
        reqID: id,
        techreport: request
    }, {
        headers: {
            "auth-token": token
        }
    }).then((result) => {
        return result
    })
    return data

}