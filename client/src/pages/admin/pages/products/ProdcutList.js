import "./productList.scss";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { useContext, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { MovieContext } from "../../../../context/movieContext/MovieContext";
import { AuthContext } from "../../../../context/authContext/AuthContext";
import {
  deleteMovie,
  getMovies,
} from "../../../../context/movieContext/apiCalls";
import CircularSpinner from "../../../../components/spinner/CircularSpinner";
import { Link, useNavigate } from "react-router-dom";

import { ref, listAll, deleteObject } from "firebase/storage";
import storage from "../../../../firebase";

export default function ProductList() {
  const { movies, dispatch, isFetching } = useContext(MovieContext);
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    getMovies(dispatch);
  }, [dispatch]);

  const deleteFolder = (storageRef) => {
    listAll(storageRef)
      .then((result) => {
        result.items.forEach((fileRef) => {
          // Delete each file reference
          deleteObject(fileRef)
            .then(() => {
              console.log("File deleted successfully");
            })
            .catch((error) => {
              console.log(`Error deleting file: ${error}`);
            });
        });
      })
      .catch((error) => {
        console.log(`Error listing files: ${error}`);
      });
  };
  const handleDelete = (id, uId) => {
    const movie = movies.find((movie) => movie._id === id);
    const storageRef = ref(storage, `/${movie.title}`);
    deleteFolder(storageRef);
    deleteMovie(id, uId, dispatch);
  };

  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "movie",
      headerName: "Movie",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.imgSm} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    {
      field: "genre",
      headerName: "Genre",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">{params.row.genres.join(", ")}</div>
        );
      },
    },
    { field: "year", headerName: "Year", width: 120 },
    { field: "limit", headerName: "Limit", width: 120 },
    { field: "isSeries", headerName: "IsSeries", width: 130 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link
              to={{
                pathname: "/dashboard/product/" + params.row._id,
              }}
            >
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id, auth?.user?._id)}
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
            rows={movies}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(r) => r._id}
          />
        )}
        <div className="center">
          <Link
            className="backBtnProduct center link"
            to="/dashboard/newProduct"
          >
            Create new Content
          </Link>
        </div>
      </div>
    </Layout>
  );
}
