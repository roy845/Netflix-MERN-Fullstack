import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./newUser.scss";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
const REGISTER_URL = "http://localhost:8800/api/auth/register";

const NewUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all the fields");
      return;
    }

    try {
      const response = await axios.post(REGISTER_URL, {
        email,
        username,
        password,
      });
      console.log(REGISTER_URL);
      console.log(response);

      toast.success(`User ${email.match(/^[^@]+/)[0]} created successfully`);
      navigate("/dashboard/users");
    } catch (err) {
      if (!err || !err.response) {
        toast.error("No Server Response");
      } else if (err?.response?.status === 409) {
        toast.error("Username Already exists");
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  return (
    <Layout>
      <div className="newUser">
        <h1 className="newUserTitle">New User</h1>
        <form className="newUserForm">
          <div className="newUserItem">
            <label>Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
            />
          </div>
          {/* <div className="newUserItem">
            <label>Full Name</label>
            <input type="text" placeholder="John Smith" />
          </div> */}
          <div className="newUserItem">
            <label>Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
            />
          </div>
          <div className="newUserItem">
            <label>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
            />
          </div>
          {/* <div className="newUserItem">
            <label>Phone</label>
            <input type="text" placeholder="+1 123 456 78" />
          </div>
          <div className="newUserItem">
            <label>Address</label>
            <input type="text" placeholder="New York | USA" />
          </div>
          <div className="newUserItem">
            <label>Gender</label>
            <div className="newUserGender">
              <input type="radio" name="gender" id="male" value="male" />
              <label htmlFor="Male">Male</label>
              <input type="radio" name="gender" id="female" value="female" />
              <label htmlFor="Female">Female</label>
              <input type="radio" name="gender" id="other" value="other" />
              <label htmlFor="Other">Other</label>
            </div>
          </div>
          <div className="newUserItem">
            <label>Active</label>
            <select className="newUserSelect" name="active" id="active">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div> */}
          <button onClick={handleRegister} className="newUserButton">
            Create
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default NewUser;
