import { Publish } from "@material-ui/icons";
import "./user.scss";
import Layout from "../../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/userContext/UserContext";
import { toast } from "react-hot-toast";
const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";
const GET_USER_URL = "http://localhost:8800/api/users/find/";
const EDIT_PROFILE_URL = "http://localhost:8800/api/users/updateUserProfile/";
export default function User() {
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [photo, setPhoto] = useState(null);
  const { defaultAvatar } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${GET_USER_URL}${userId}`);
        setProfilePic(data?.profilePic);
        setUsername(data?.username);
        setEmail(data?.email);
      } catch (error) {
        const { response } = error;
        console.log(error);
        toast.error(response?.data);
      }
    };
    getUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    photo && formData.append("photo", photo);
    try {
      const { data } = await axios.put(
        `${EDIT_PROFILE_URL}${userId}`,
        formData
      );

      if (data) {
        toast.success(data.message);
        navigate("/dashboard/users");
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

  return (
    <Layout>
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit User</h1>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              {!photo ? (
                <img
                  src={
                    profilePic?.data?.data?.length === 0
                      ? defaultAvatar
                      : `${BASE_IMAGE_URL}${userId}?t=${Date.now()}`
                  }
                  alt=""
                  className="userShowImg"
                />
              ) : (
                <img
                  src={URL.createObjectURL(photo)}
                  alt=""
                  className="userShowImg"
                />
              )}

              <div className="userShowTopTitle">
                <span className="userShowUsername">{username}</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">Edit</span>
            <form className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    placeholder={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="userUpdateInput"
                  />
                </div>

                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    value={email}
                    placeholder={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    className="userUpdateInput"
                  />
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  {!photo ? (
                    <img
                      className="userUpdateImg"
                      src={
                        profilePic?.data?.data?.length === 0
                          ? defaultAvatar
                          : `${BASE_IMAGE_URL}${userId}?t=${Date.now()}`
                      }
                      alt=""
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt=""
                      className="userShowImg"
                    />
                  )}
                  <label htmlFor="file">
                    <Publish className="userUpdateIcon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
                <button className="userUpdateButton" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
