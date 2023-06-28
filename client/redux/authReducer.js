import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const registerUser = createAsyncThunk("auth/registerUser", async (data) => {
    const { fullName, email, password, username, userTypeID, tel } = data
    console.log(data)
    const mydata = await axios.post("http://localhost:3000/auth/register", {
        fullname: fullName,
        email: email,
        tel: tel,
        password: password,
        username: username,
        userTypeID: userTypeID

    })
        .then((response) => {
            return response.data

        })
        .catch((err) => {
            return {
                data: { success: false }
            }
        })

    return mydata

});


export const loginUser = createAsyncThunk("api/users/loginUser", async (data) => {
    const { email, password } = data
    const mydata = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});

export const getUser = createAsyncThunk("api/users/getuser", async (data) => {
    const token = await AsyncStorage.getItem('token')
    console.log(data)
    const mydata = await axios.post("http://localhost:3000/api/user/getuser", {
        userID: data
    }, {
        headers: {
            "auth-token": token
        }
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});

export const getAllRequest = createAsyncThunk("api/users/getAllRequest", async (data) => {
    const token = await AsyncStorage.getItem('token')
    const mydata = await axios.get("http://localhost:3000/api/user/getAllRequest", {
        headers: {
            "auth-token": token
        }
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});

export const getUserRequest = createAsyncThunk("api/users/getUserRequest", async (data) => {
    const token = await AsyncStorage.getItem('token')
    console.log(data)
    const mydata = await axios.get(`http://localhost:3000/api/user/getUserRequest/${data}`, {
        headers: {
            "auth-token": token
        }
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});
export const getUserRequestProcess = createAsyncThunk("api/users/getUserRequestProcess", async (data) => {
    const token = await AsyncStorage.getItem('token')

    const mydata = await axios.get(`http://localhost:3000/api/user/getUserRequestProcess/${data}`, {
        headers: {
            "auth-token": token
        }
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});
export const getUserRequestSuccess = createAsyncThunk("api/users/getUserRequestSuccess", async (data) => {
    const token = await AsyncStorage.getItem('token')

    const mydata = await axios.get(`http://localhost:3000/api/user/getUserRequestSuccess/${data}`, {
        headers: {
            "auth-token": token
        }
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});
export const getDataFoForm = createAsyncThunk("api/users/getequ", async (data) => {
    const token = await AsyncStorage.getItem('token')
    const mydata = await axios.get("http://localhost:3000/api/user/getequ", {
        headers: {
            "auth-token": token
        }
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});

export const deleleReq = createAsyncThunk("api/users/deleleReq", async (data) => {
    const token = await AsyncStorage.getItem('token')

    const mydata = await axios.delete(`http://localhost:3000/api/user/del/${data}`,{

        headers: {
            "auth-token": token
        }
    })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
    return mydata

});


const authReducer = createSlice({
    name: "auth",
    initialState: {
        data: [],
        loading: false,
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            }),
            builder.addCase(registerUser.rejected, (state, action) => {
                state.loading = false
            }),
            builder.addCase(loginUser.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload

            }),
            builder.addCase(loginUser.rejected, (state, action) => {
                state.loading = false
            }),
            builder.addCase(getUser.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload

            }),
            builder.addCase(getUser.rejected, (state, action) => {
                state.loading = false
            })

    }

});
export default authReducer.reducer;