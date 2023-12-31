import Layout from "../../components/Layout/Layout";
import { useContext, useEffect, useState } from "react";
import "./newList.scss";
import { getMovies } from "../../../../context/movieContext/apiCalls";
import { MovieContext } from "../../../../context/movieContext/MovieContext";
import { ListContext } from "../../../../context/listContext/ListContext";
import { createList } from "../../../../context/listContext/apiCalls";
import { useNavigate } from "react-router-dom";

const NewList = () => {
  const [list, setList] = useState({});
  const navigate = useNavigate();

  const { dispatch } = useContext(ListContext);
  const { movies, dispatch: dispatchMovie } = useContext(MovieContext);

  useEffect(() => {
    getMovies(dispatchMovie);
  }, [dispatchMovie]);

  const handleChange = (e) => {
    const value = e.target.value;
    setList({ ...list, [e.target.name]: value });
  };

  const handleSelect = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    setList({ ...list, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createList(list, dispatch);
    navigate("/dashboard/lists");
  };

  const canUpdate = Object.values(list).every((v) => v !== "");

  return (
    <Layout>
      <div className="newProduct">
        <h1 className="addProductTitle">New List</h1>
        <form className="addProductForm">
          <div className="formLeft">
            <div className="addProductItem">
              <label style={{ color: "white" }}>Title</label>
              <input
                type="text"
                placeholder="title"
                name="title"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label style={{ color: "white" }}>Genre</label>
              <input
                type="text"
                placeholder="genre"
                name="genre"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label style={{ color: "white" }}>Type</label>
              <select name="type" onChange={handleChange}>
                <option>Type</option>
                <option value="movies">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>
          </div>
          <div className="formRight">
            <div className="addProductItem">
              <label style={{ color: "white" }}>Content</label>
              <select
                multiple
                name="content"
                onChange={handleSelect}
                style={{ height: "280px" }}
              >
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {canUpdate && (
            <button className="addProductButton" onClick={handleSubmit}>
              Create
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default NewList;
