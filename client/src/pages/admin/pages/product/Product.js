import { Link, useParams, useNavigate } from "react-router-dom";
import "./product.scss";
import { Publish } from "@material-ui/icons";
import Layout from "../../components/Layout/Layout";
import { useContext, useEffect } from "react";
import { getMovie } from "../../../../context/movieContext/apiCalls";
import { updateMovie } from "../../../../context/movieContext/apiCalls";
import { MovieContext } from "../../../../context/movieContext/MovieContext";
import { useState } from "react";
import storage from "../../../../firebase";
import { useRef } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import LinearProgressBar from "../../components/LinearProgressBar/LinearProgressBar";

export default function Product() {
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [subtitles, setSubtitles] = useState(null);
  const { productId } = useParams();
  const { movie, dispatch } = useContext(MovieContext);
  const [formState, setFormState] = useState({});
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(0);
  const [progress, setProgress] = useState(0);
  const [uploadState, setUploadState] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [fileUploaded, setFileUploaded] = useState("");
  const [isUploadTask, setIsUploadTask] = useState(null);
  const [isPause, setIsPause] = useState(false);

  const uploadTaskRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    updateMovie(productId, formState, dispatch);
    navigate("/dashboard/movies");
  };

  useEffect(() => {
    getMovie(productId, dispatch);
  }, [productId, dispatch]);

  useEffect(() => {
    if (movie) {
      setFormState(movie);
    }
  }, [movie]);

  const handleCancelUpload = () => {
    // Access the upload task from the ref variable and cancel it
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
      setIsUploadTask(null); // reset the upload task state variable
      setShowProgress(false); // hide the progress bar
    }

    const storageRef = ref(storage, `/${movie.title}`);
    deleteFolder(storageRef);
    setUploaded(0);
  };

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

  const handlePauseUpload = () => {
    // Access the upload task from the ref variable and pause it
    if (uploadTaskRef.current) {
      uploadTaskRef.current.pause();
      setIsUploadTask(uploadTaskRef.current); // update the upload task state variable
      setIsPause(false);
    }
  };

  const handleResumeUpload = () => {
    // Access the upload task from the ref variable and resume it
    if (uploadTaskRef.current) {
      uploadTaskRef.current.resume();
      setIsUploadTask(uploadTaskRef.current); // update the upload task state variable
      setIsPause(true);
    }
  };

  const upload = async (items) => {
    setShowProgress(true);
    setIsPause(true);
    const storageRef = ref(storage, `/${movie.title}`);
    deleteFolder(storageRef);

    for (const item of items) {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const storageRef = ref(storage, `${formState.title}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTaskRef.current = uploadTask;

      setIsUploadTask(uploadTask);
      setFileUploaded(item.file.name);
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

            const progress =
              snapshot.totalBytes > 0
                ? Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  )
                : 0;

            setProgress(progress);
            switch (snapshot.state) {
              case "paused":
                setUploadState("Upload is paused");
                break;
              case "running":
                setUploadState("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            setError(error.code);
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            setUploadState("Upload successful");
            // Get the download URL of the uploaded file
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormState((prev) => {
                return { ...prev, [item.label]: downloadURL };
              });
              setUploaded((prev) => prev + 1); // increment uploaded state
              resolve();
            });
          }
        );
      });
    }
  };

  const filesToUpload = [
    { file: img, label: "img" },
    { file: imgTitle, label: "imgTitle" },
    { file: imgSm, label: "imgSm" },
    { file: trailer, label: "trailer" },
    { file: video, label: "video" },
    { file: subtitles, label: "subtitles" },
  ];

  const handleUpload = (e) => {
    e.preventDefault();
    upload(filesToUpload);
  };

  const allFieldsNotEmpty =
    movie && Object.values(movie).every((value) => value !== "");
  const canUpload =
    img && imgSm && imgTitle && trailer && video && allFieldsNotEmpty;

  console.log(formState);

  return (
    <Layout>
      <div className="product">
        <div className="productTitleContainer">
          <h1 className="productTitle">Movie</h1>
        </div>
        <div className="productTop">
          <div className="productTopRight">
            <div className="productInfoTop">
              <div className="productInfoTop">
                {img ? (
                  <>
                    <img
                      src={URL.createObjectURL(img)}
                      alt="movie-photo"
                      height={"200px"}
                      className="img-responsive"
                    />
                    <span className="productName">{formState.title}</span>
                  </>
                ) : (
                  <>
                    <img src={movie.img} alt="" className="productInfoImg" />

                    <span className="productName">{formState.title}</span>
                  </>
                )}
              </div>
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
                <span className="productInfoKey">year:</span>
                <span className="productInfoValue">{formState.year}</span>
              </div>
              <div className="productInfoItem">
                <span className="productInfoKey">limit:</span>
                <span className="productInfoValue">{formState.limit}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="productBottom">
          <form className="productForm">
            <div className="productFormLeft">
              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>Movie Title</label>
                <input
                  type="text"
                  placeholder={formState.title}
                  name="title"
                  onChange={handleChange}
                  value={formState.title}
                />
              </div>
              <div className="addProductItem">
                <label style={{ color: "white" }}>Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  name="description"
                  onChange={handleChange}
                  value={formState.description}
                />
              </div>
              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>Year</label>
                <input
                  type="text"
                  placeholder={formState.year}
                  name="year"
                  onChange={handleChange}
                  value={formState.year}
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
              <div className="addProductItem">
                <label style={{ color: "white" }}>Duration</label>
                <input
                  type="text"
                  placeholder="Duration"
                  name="duration"
                  onChange={handleChange}
                  value={formState.duration}
                />
              </div>
              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>Limit</label>
                <input
                  type="text"
                  placeholder={formState.limit}
                  name="limit"
                  onChange={handleChange}
                  value={formState.limit}
                />
              </div>

              <div className="addProductItem">
                <label style={{ color: "white" }}>Is Series</label>
                <select
                  name="isSeries"
                  value={formState.isSeries}
                  onChange={handleChange}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>Subtitles</label>
                <input
                  type="file"
                  name="subtitles"
                  onChange={(e) => {
                    setSubtitles(e.target.files[0]);
                  }}
                  accept=".srt,.vtt"
                  multiple
                />
              </div>

              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>Trailer</label>
                <input
                  type="file"
                  onChange={(e) => setTrailer(e.target.files[0])}
                />
              </div>
              <div className="addProductItem">
                {" "}
                <label style={{ color: "white" }}>Video</label>
                <input
                  type="file"
                  onChange={(e) => setVideo(e.target.files[0])}
                />
              </div>
            </div>
            <div className="productFormRight">
              <div className="productUpload">
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    alt="movie-photo"
                    height={"200px"}
                    className="img-responsive"
                  />
                ) : (
                  <img src={movie.img} alt="" className="productUploadImg" />
                )}
                <label htmlFor="file">
                  <Publish style={{ color: "white" }} />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                  }}
                  name="imageUpload"
                />
              </div>
              <div className="addProductItem">
                <label style={{ color: "white" }}>Title Image</label>
                <input
                  type="file"
                  id="imgTitle"
                  name="imgTitle"
                  onChange={(e) => setImgTitle(e.target.files[0])}
                  accept="image/*"
                />
              </div>
              <div className="addProductItem">
                <label style={{ color: "white" }}>Thumbnail Image</label>
                <input
                  type="file"
                  id="imgSmall"
                  name="imgSmall"
                  onChange={(e) => setImgSm(e.target.files[0])}
                  accept="image/*"
                />
              </div>
              {uploaded === filesToUpload.length ? (
                <button className="addProductButton" onClick={handleUpdate}>
                  Update
                </button>
              ) : (
                canUpload && (
                  <button className="addProductButton" onClick={handleUpload}>
                    Upload
                  </button>
                )
              )}
            </div>
          </form>
        </div>

        <Link
          to="/dashboard/movies"
          className="backBtnProduct productAddButton link"
        >
          Back
        </Link>
        {!showProgress ? null : (
          <div className="progressBar">
            <LinearProgressBar progress={progress} />
            {`uploadState : ${uploadState}`} <br />
            {`total files uploaded : ${uploaded}/${filesToUpload.length}`}
            <br />
            {uploaded !== filesToUpload.length &&
              `currently uploading : ${fileUploaded}`}
            {isUploadTask && uploaded !== filesToUpload.length && (
              <button
                className="addProductButton cancel"
                onClick={handleCancelUpload}
              >
                Cancel Upload
              </button>
            )}
            {isUploadTask && uploaded !== filesToUpload.length && isPause && (
              <button
                className="addProductButton pause"
                onClick={handlePauseUpload}
              >
                Pause Upload
              </button>
            )}
            {isUploadTask && uploaded !== filesToUpload.length && !isPause && (
              <button
                className="addProductButton resume"
                onClick={handleResumeUpload}
              >
                Resume Upload
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
