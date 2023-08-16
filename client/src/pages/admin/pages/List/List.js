import { Link, useParams, useNavigate } from "react-router-dom";
import "./list.scss";
import Layout from "../../components/Layout/Layout";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { getList } from "../../../../context/listContext/apiCalls";
import { ListContext } from "../../../../context/listContext/ListContext";
import { updateList } from "../../../../context/listContext/apiCalls";
import { getMovies } from "../../../../context/movieContext/apiCalls";
import { MovieContext } from "../../../../context/movieContext/MovieContext";

export default function List() {
  const { productId } = useParams();
  const { list, dispatch } = useContext(ListContext);
  const [formState, setFormState] = useState({});
  const { movies, dispatch: dispatchMovie } = useContext(MovieContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    updateList(productId, formState, dispatch);
    navigate("/dashboard/lists");
  };

  const handleSelect = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormState({ ...list, [e.target.name]: value });
  };

  useEffect(() => {
    getList(productId, dispatch);
  }, [productId, dispatch]);

  useEffect(() => {
    getMovies(dispatchMovie);
  }, [dispatchMovie]);

  useEffect(() => {
    if (list) {
      setFormState(list);
    }
  }, [list]);

  const canUpdate = Object.values(formState).every((v) => v !== "");

  return (
    <Layout>
      <div className="product">
        <div className="productTitleContainer">
          <h1 className="productTitle">List</h1>
        </div>
        <div className="productTop">
          <div className="productTopRight">
            <div className="productInfoTop">
              <span className="productName">{formState.title}</span>
            </div>
            <div className="productInfoBottom">
              <div className="productInfoItem">
                <span className="productInfoKey">id:</span>
                <span className="productInfoValue">{formState._id}</span>
              </div>
              <div className="productInfoItem">
                <span className="productInfoKey">genre:</span>
                <span className="productInfoValue">{formState.genre}</span>
              </div>
              <div className="productInfoItem">
                <span className="productInfoKey">type:</span>
                <span className="productInfoValue">{formState.type}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="productBottom">
          <form className="productForm">
            <div className="productFormLeft">
              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>List Title</label>
                <input
                  type="text"
                  placeholder={formState.title}
                  name="title"
                  onChange={handleChange}
                  value={formState.title}
                />
              </div>
              <div className="addProductItem">
                <label style={{ color: "white" }}>Type</label>
                <input
                  type="text"
                  placeholder="Type"
                  name="type"
                  onChange={handleChange}
                  value={formState.type}
                />
              </div>
              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>Genre</label>
                <input
                  type="text"
                  placeholder={formState.genre}
                  name="genre"
                  onChange={handleChange}
                  value={formState.genre}
                />
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
                <div className="productUpload">
                  {" "}
                  {canUpdate && (
                    <button className="addProductButton" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <Link
          to="/dashboard/lists"
          className="backBtnProduct productAddButton link"
        >
          Back
        </Link>
      </div>
    </Layout>
  );
}
