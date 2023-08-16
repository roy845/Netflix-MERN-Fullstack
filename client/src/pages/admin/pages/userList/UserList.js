import { DeleteOutline } from "@material-ui/icons";
import Layout from "../../components/Layout/Layout";
import "./userList.scss";
import { DataGrid } from "@material-ui/data-grid";
// import { userRows } from "../../../dummyData";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/userContext/UserContext";
import { getAllUsers } from "../../../../context/userContext/apiCalls";
import { deleteUser } from "../../../../context/userContext/apiCalls";

const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";
const UserList = () => {
  const [data, setData] = useState([]);
  const { users, dispatch } = useContext(UserContext);
  const { defaultAvatar } = useContext(UserContext);
  useEffect(() => {
    getAllUsers(dispatch);
  }, []);

  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  useEffect(() => {
    // Assign unique IDs to users from MongoDB
    const formattedUsers = users?.map((user) => ({
      ...user,
      id: user?._id,
    }));
    setData(formattedUsers);
  }, [users]);

  console.log(data);

  const handleDelete = (id) => {
    setData(data.filter((user) => user?.id !== id));
    deleteUser(dispatch, id);

    console.log(id);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => {
        const { row } = params;
        const { profilePic, username } = row;

        return (
          <div className="userListUser">
            <img
              className="userListImg"
              src={
                profilePic.data.data.length === 0
                  ? defaultAvatar
                  : `${BASE_IMAGE_URL}${row.id}?t=${Date.now()}`
              }
            />
            {username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const { row } = params;
        const { isConnected } = row;
        return (
          <>
            <Button type={isConnected ? "Active" : "Unactive"} />
          </>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/dashboard/user/${params?.id}`}>
              <button className="userListEdit">Edit</button>
            </Link>

            {!params.row.isAdmin && (
              <DeleteOutline
                className="userListDelete"
                onClick={() => handleDelete(params?.id)}
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="userList">
        <DataGrid
          className="purple-checkbox white-checkbox"
          style={{ height: "80vh", width: "99%", color: "white" }}
          rows={data}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
        <div className="center">
          <Link
            to={"/dashboard/newUser"}
            className="backBtnProduct center link"
          >
            Create new User
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default UserList;
