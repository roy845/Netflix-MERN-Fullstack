import React, { useState, useEffect, useContext } from "react";
import "./editProfile.scss";
import { TextField } from "@material-ui/core";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import axios from "axios";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext/UserContext";
import { useAuth } from "../../context/authContext/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import DeleteUserDialog from "../DeleteUserDialog/DeleteUserDialog";

const GET_USER_URL = "http://localhost:8800/api/users/find/";
const EDIT_PROFILE_URL = "http://localhost:8800/api/users/updateUserProfile/";
const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";

function EditProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [photo, setPhoto] = useState("");
  const [length, setLength] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { defaultAvatar } = useContext(UserContext);
  const { auth, setAuth } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${GET_USER_URL}${id}`, {
          headers: {
            Authorization: auth?.token,
          },
        });

        setUsername(data.username);
        setEmail(data.email);
        setUser(data);
        setLength(data.profilePic.data.data.length);
      } catch (error) {
        const { response } = error;
        console.log(error);
        toast.error(response?.data);
        setIsAuthorized(false);
      }
    };

    getUser();
  }, [auth?.token, id, navigate]);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    photo && formData.append("photo", photo);
    try {
      const { data } = await axios.put(`${EDIT_PROFILE_URL}${id}`, formData);

      if (data) {
        setAuth({ ...auth, user: data?.userInfo });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.userInfo;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success(data.message);
        navigate("/profiles");
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 404) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong in updating user profile");
      }
    }
  };

  if (!isAuthorized) return <Navigate Navigate to="/unauthorized" />;

  return (
    <div className="edit-profile">
      <div className="header">
        <h2 className="editProfileHeader" onClick={() => navigate("/profiles")}>
          Edit Profile
        </h2>
        <div className="back-icon">
          <Link to="/profiles" className="link">
            <NavigateNextIcon />
          </Link>
        </div>
      </div>
      <div className="edit-profile-content">
        <div className="profile-pic">
          <label htmlFor="file-upload">
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                alt="product-photo"
                height={"200px"}
                className="img-responsive"
              />
            ) : (
              <img
                src={
                  length === 0
                    ? defaultAvatar
                    : `${BASE_IMAGE_URL}${user._id}?t=${Date.now()}`
                }
                alt={username}
              />
            )}
          </label>
          <input
            type="file"
            id="file-upload"
            name="profilePic"
            style={{ display: "none" }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>
        <div className="profile-fields">
          <TextField
            required
            fullWidth
            label="Username"
            name="username"
            value={username}
            id="name"
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#fff" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            className="whiteLabel"
          />
          <TextField
            type="text"
            fullWidth
            label="Email"
            name="email"
            value={email}
            id="password"
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#fff" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            className="whiteLabel"
          />
          <TextField
            type="password"
            fullWidth
            label="Password"
            name="password"
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#fff" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            className="whiteLabel"
          />
        </div>
        <div className="profile-actions">
          <div className="profile-action">
            <div className="delete-icon">
              <DeleteOutlineOutlinedIcon
                variant="contained"
                color="secondary"
                style={{ cursor: "pointer" }}
                onClick={() => setOpenDeleteDialog(true)}
              />
            </div>

            <span style={{ color: "white" }}>Delete</span>
          </div>
          <div className="profile-action">
            <div className="save-icon">
              <CheckOutlinedIcon
                variant="contained"
                color="primary"
                style={{ cursor: "pointer" }}
                onClick={handleSaveClick}
              />
            </div>
            <span style={{ color: "white" }}>Save</span>
          </div>
        </div>
      </div>
      {openDeleteDialog && (
        <DeleteUserDialog
          open={openDeleteDialog}
          onClose={setOpenDeleteDialog}
          user={user}
        />
      )}
    </div>
  );
}

export default EditProfile;
