import "./listList.scss";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { useContext, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { ListContext } from "../../../../context/listContext/ListContext";

import CircularSpinner from "../../../../components/spinner/CircularSpinner";
import { Link } from "react-router-dom";

// import { ref, listAll, deleteObject } from "firebase/storage";
// import storage from "../../../../firebase";
import { deleteList, getLists } from "../../../../context/listContext/apiCalls";

export default function ListList() {
  const { lists, dispatch, isFetching } = useContext(ListContext);

  useEffect(() => {
    getLists(dispatch);
  }, [dispatch]);

  // const deleteFolder = (storageRef) => {
  //   listAll(storageRef)
  //     .then((result) => {
  //       result.items.forEach((fileRef) => {
  //         // Delete each file reference
  //         deleteObject(fileRef)
  //           .then(() => {
  //             console.log("File deleted successfully");
  //           })
  //           .catch((error) => {
  //             console.log(`Error deleting file: ${error}`);
  //           });
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(`Error listing files: ${error}`);
  //     });
  // };
  const handleDelete = (id) => {
    // const movie = movies.find((movie) => movie._id === id);
    // const storageRef = ref(storage, `/${movie.title}`);
    // deleteFolder(storageRef);
    deleteList(id, dispatch);
  };

  //   const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "title", headerName: "Title", width: 250 },
    { field: "genre", headerName: "Genre", width: 150 },
    { field: "type", headerName: "Type", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link
              to={{
                pathname: "/dashboard/list/" + params.row._id,
              }}
            >
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="productList">
        {isFetching ? (
          <CircularSpinner />
        ) : (
          <DataGrid
            className="purple-checkbox white-checkbox"
            style={{ height: "80vh", width: "99%", color: "white" }}
            rows={lists}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(r) => r._id}
          />
        )}
        <div className="center">
          <Link className="backBtnProduct center link" to="/dashboard/newList">
            Create new List
          </Link>
        </div>
      </div>
    </Layout>
  );
}
