import React from "react";
import Layout from "../../components/Layout/Layout";
import "./addSeason.scss";
import { useEffect, useState } from "react";
import storage from "../../../../firebase";
import { useNavigate } from "react-router-dom";

import { useRef } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import axios from "axios";
import LinearProgressBar from "../../components/LinearProgressBar/LinearProgressBar";
import { toast } from "react-hot-toast";

const GET_ALL_SERIES = "http://localhost:8800/api/movies/series";
const GET_ONE_SERIES = "http://localhost:8800/api/movies/find/series/";
const CREATE_NEW_SEASON = "http://localhost:8800/api/movies/newSeason/";

const AddSeason = () => {
  const [newSeason, setNewSeason] = useState();
  const [series, setSeries] = useState([]);
  const [numOfEpisodes, setNumOfEpisodes] = useState();
  const [selectedSeries, setSelectedSeries] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    const value = e.target.value;
    setNewSeason({ ...newSeason, [e.target.name]: value });
  };

  const handleChangeNumOfEpisodes = (e) => {
    let numOfEpisodes = e.target.value;
    setNumOfEpisodes(numOfEpisodes);
    const episodes = { episodes: [] };

    for (let i = 0; i < numOfEpisodes; i++) {
      const episode = {
        title: "",
        description: "",
        duration: "",
        video: null,
        subtitles: null,
        thumbnail: null,
      };
      episodes.episodes.push(episode);
    }

    setNewSeason({ ...newSeason, episodes });
  };

  const handleSelect = (e) => {
    getSelectedSeries(e.target.value);
  };

  const getSelectedSeries = async (seriesId) => {
    try {
      const { data } = await axios.get(`${GET_ONE_SERIES}${seriesId}`);
      setSelectedSeries(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllSeries = async () => {
      try {
        const { data } = await axios.get(GET_ALL_SERIES);
        setSeries(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllSeries();
  }, []);

  console.log(newSeason);
  console.log(selectedSeries);

  const handleEpisodeChange = (episodeIndex, field, value) => {
    setNewSeason((prevData) => {
      const episodes = [...prevData.episodes.episodes];
      episodes[episodeIndex][field] = value;
      return {
        ...prevData,
        episodes: {
          episodes,
        },
      };
    });
  };

  const handleVideoEpisodeUpload = (episodeIndex, event) => {
    const file = event.target.files[0];
    setNewSeason((prevData) => {
      const episodes = [...prevData.episodes.episodes];
      episodes[episodeIndex].video = file;
      return {
        ...prevData,
        episodes: {
          episodes,
        },
      };
    });
  };

  const handleSubtitlesEpisodeUpload = (episodeIndex, event) => {
    const file = event.target.files[0];
    setNewSeason((prevData) => {
      const episodes = [...prevData.episodes.episodes];
      episodes[episodeIndex].subtitles = file;
      return {
        ...prevData,
        episodes: {
          episodes,
        },
      };
    });
  };

  const handleThumbnailsEpisodeUpload = (episodeIndex, event) => {
    const file = event.target.files[0];
    setNewSeason((prevData) => {
      const episodes = [...prevData.episodes.episodes];
      episodes[episodeIndex].thumbnail = file;
      return {
        ...prevData,
        episodes: {
          episodes,
        },
      };
    });
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

  const videoUploadTaskRef = useRef(null);
  const subtitleUploadTaskRef = useRef(null);
  const thumbnailUploadTaskRef = useRef(null);
  const [isUploadVideoTask, setIsUploadVideoTask] = useState(null);
  const [videoFileUploaded, setVideoFileUploaded] = useState("");
  const [isUploadSubtitleTask, setIsUploadSubtitleTask] = useState(null);
  const [subtitleFileUploaded, setSubtitleFileUploaded] = useState("");
  const [isPauseEpisodes, setIsPauseEpisodes] = useState(false);
  const [progressVideoUpload, setProgressVideoUpload] = useState(0);
  const [showProgressEpisodes, setShowProgressEpisodesUpload] = useState(0);
  const [progressSubtitleUpload, setProgressSubtitleUpload] = useState(0);
  const [uploadVideoState, setUploadVideoState] = useState("");
  const [uploadSubtitleState, setUploadSubtitleState] = useState("");
  const [uploadsFinishedVideos, setUploadsFinishedVideos] = useState(0);
  const [uploadsFinishedSubtitles, setUploadsFinishedSubtitles] = useState(0);

  const [isUploadThumbnailTask, setIsUploadThumbnailTask] = useState(null);
  const [thumbnailFileUploaded, setThumbnailFileUploaded] = useState("");
  const [progressThumbnailUpload, setProgressThumbnailUpload] = useState(0);
  const [uploadThumbnailState, setUploadThumbnailState] = useState("");
  const [uploadsFinishedThumbnails, setUploadsFinishedThumbnails] = useState(0);
  const [uploaded, setUploaded] = useState(0);

  const handlePauseVideoEpisodeUpload = () => {
    // Access the upload task from the ref variable and pause it
    if (videoUploadTaskRef.current) {
      videoUploadTaskRef.current.pause();
      setIsUploadVideoTask(videoUploadTaskRef.current); // update the upload task state variable
      setIsPauseEpisodes(false);
    }
  };

  const handleResumeVideoEpisodeUpload = () => {
    // Access the upload task from the ref variable and resume it
    if (videoUploadTaskRef.current) {
      videoUploadTaskRef.current.resume();
      setIsUploadVideoTask(videoUploadTaskRef.current); // update the upload task state variable
      setIsPauseEpisodes(true);
    }
  };

  const handleCanceVideoEpisodelUpload = () => {
    // Access the upload task from the ref variable and cancel it
    if (videoUploadTaskRef.current) {
      videoUploadTaskRef.current.cancel();
      setIsUploadVideoTask(null); // reset the upload task state variable
      setIsPauseEpisodes(false); // hide the progress bar
    }
    const storageRef = ref(storage, `series/${series.title}`);
    deleteFolder(storageRef);
    setUploaded(0);
  };

  const handlePauseSubtitlesEpisodeUpload = () => {
    // Access the upload task from the ref variable and pause it
    if (subtitleUploadTaskRef.current) {
      subtitleUploadTaskRef.current.pause();
      setIsUploadSubtitleTask(subtitleUploadTaskRef.current); // update the upload task state variable
      setIsPauseEpisodes(false);
    }
  };

  const handleResumeSubtitlesEpisodeUpload = () => {
    // Access the upload task from the ref variable and resume it
    if (subtitleUploadTaskRef.current) {
      subtitleUploadTaskRef.current.resume();
      setIsUploadSubtitleTask(subtitleUploadTaskRef.current); // update the upload task state variable
      setIsPauseEpisodes(true);
    }
  };

  const handleCanceSubtitlesEpisodelUpload = () => {
    // Access the upload task from the ref variable and cancel it
    if (subtitleUploadTaskRef.current) {
      subtitleUploadTaskRef.current.cancel();
      setIsUploadSubtitleTask(null); // reset the upload task state variable
      setIsPauseEpisodes(false); // hide the progress bar
    }
    const storageRef = ref(storage, `series/${series.title}`);
    deleteFolder(storageRef);
    setUploaded(0);
  };

  const handlePauseThumbnailsEpisodeUpload = () => {
    // Access the upload task from the ref variable and pause it
    if (thumbnailUploadTaskRef.current) {
      thumbnailUploadTaskRef.current.pause();
      setIsUploadThumbnailTask(thumbnailUploadTaskRef.current); // update the upload task state variable
      setIsPauseEpisodes(false);
    }
  };

  const handleResumeThumbnailsEpisodeUpload = () => {
    // Access the upload task from the ref variable and resume it
    if (thumbnailUploadTaskRef.current) {
      thumbnailUploadTaskRef.current.resume();
      setIsUploadThumbnailTask(thumbnailUploadTaskRef.current); // update the upload task state variable
      setIsPauseEpisodes(true);
    }
  };

  const handleCanceThumbnailsEpisodelUpload = () => {
    // Access the upload task from the ref variable and cancel it
    if (thumbnailUploadTaskRef.current) {
      thumbnailUploadTaskRef.current.cancel();
      setIsUploadThumbnailTask(null); // reset the upload task state variable
      setIsPauseEpisodes(false); // hide the progress bar
    }
    const storageRef = ref(storage, `series/${series.title}`);
    deleteFolder(storageRef);
    setUploaded(0);
  };

  const uploadVideosEpisodes = async (episodes) => {
    setShowProgressEpisodesUpload(true);
    setIsPauseEpisodes(true);

    for (const episode of episodes) {
      // Upload video
      const fileName = new Date().getTime() + episode.video.name;
      const storageRef = ref(storage, `${selectedSeries.title}/${fileName}`);

      const videoUploadTask = uploadBytesResumable(storageRef, episode.video);

      videoUploadTaskRef.current = videoUploadTask;

      setIsUploadVideoTask(videoUploadTask);
      setVideoFileUploaded(episode.video.name);

      await new Promise((resolve, reject) => {
        videoUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              snapshot.totalBytes > 0
                ? Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  )
                : 0;
            setProgressVideoUpload(progress);
            switch (snapshot.state) {
              case "paused":
                setUploadVideoState("Upload is paused");
                break;
              case "running":
                setUploadVideoState("Upload is running");
                break;
            }
          },
          (error) => console.error(error),
          () => {
            // Handle successful uploads on complete
            setUploadVideoState("Upload successful");
            // Get the download URL of the uploaded file
            getDownloadURL(videoUploadTask.snapshot.ref).then((downloadURL) => {
              // Update the episodes array in newSeason with the video URL
              setNewSeason((prevData) => {
                const updatedEpisodes = prevData.episodes.episodes.map((e) => {
                  if (e.title === episode.title) {
                    return {
                      ...e,
                      video: downloadURL,
                    };
                  }
                  return e;
                });
                return {
                  ...prevData,
                  episodes: {
                    episodes: updatedEpisodes,
                  },
                };
              });

              setUploadsFinishedVideos((prev) => prev + 1); // increment uploaded state
              resolve();
            });
          }
        );
      });
    }
  };

  const uploadSubtitlesEpisodes = async (episodes) => {
    setShowProgressEpisodesUpload(true);
    setIsPauseEpisodes(true);

    for (const episode of episodes) {
      // Upload subtitle
      if (episode.subtitles) {
        const fileName = new Date().getTime() + episode.subtitles.name;
        const storageRef = ref(storage, `${selectedSeries.title}/${fileName}`);

        const subtitleUploadTask = uploadBytesResumable(
          storageRef,
          episode.subtitles
        );

        subtitleUploadTaskRef.current = subtitleUploadTask;

        setIsUploadSubtitleTask(subtitleUploadTask);
        setSubtitleFileUploaded(episode.subtitles.name);
        await new Promise((resolve, reject) => {
          subtitleUploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                snapshot.totalBytes > 0
                  ? Math.round(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                  : 0;
              setProgressSubtitleUpload(progress);
              switch (snapshot.state) {
                case "paused":
                  setUploadSubtitleState("Upload is paused");
                  break;
                case "running":
                  setUploadSubtitleState("Upload is running");
                  break;
              }
            },
            (error) => console.error(error),
            () => {
              // Handle successful uploads on complete
              setUploadSubtitleState("Upload successful");
              // Get the download URL of the uploaded file
              // Get the download URL of the uploaded file
              getDownloadURL(subtitleUploadTask.snapshot.ref).then(
                (downloadURL) => {
                  // Update the episodes array in newSeason with the video URL
                  setNewSeason((prevData) => {
                    const updatedEpisodes = prevData.episodes.episodes.map(
                      (e) => {
                        if (e.title === episode.title) {
                          return {
                            ...e,
                            subtitles: downloadURL,
                          };
                        }
                        return e;
                      }
                    );
                    return {
                      ...prevData,
                      episodes: {
                        episodes: updatedEpisodes,
                      },
                    };
                  });

                  setUploadsFinishedSubtitles((prev) => prev + 1); // increment uploaded state
                  resolve();
                }
              );
            }
          );
        });
      }
    }
  };

  const uploadThumbnailsEpisodes = async (episodes) => {
    setShowProgressEpisodesUpload(true);
    setIsPauseEpisodes(true);

    for (const episode of episodes) {
      // Upload video
      const fileName = new Date().getTime() + episode.thumbnail.name;
      const storageRef = ref(storage, `${selectedSeries.title}/${fileName}`);

      const thumbnailUploadTask = uploadBytesResumable(
        storageRef,
        episode.thumbnail
      );

      thumbnailUploadTaskRef.current = thumbnailUploadTask;

      setIsUploadThumbnailTask(thumbnailUploadTask);
      setThumbnailFileUploaded(episode.thumbnail.name);

      await new Promise((resolve, reject) => {
        thumbnailUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              snapshot.totalBytes > 0
                ? Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  )
                : 0;
            setProgressThumbnailUpload(progress);
            switch (snapshot.state) {
              case "paused":
                setUploadThumbnailState("Upload is paused");
                break;
              case "running":
                setUploadThumbnailState("Upload is running");
                break;
            }
          },
          (error) => console.error(error),
          () => {
            // Handle successful uploads on complete
            setUploadThumbnailState("Upload successful");
            // Get the download URL of the uploaded file
            getDownloadURL(thumbnailUploadTask.snapshot.ref).then(
              (downloadURL) => {
                // Update the episodes array in newSeason with the video URL
                setNewSeason((prevData) => {
                  const updatedEpisodes = prevData.episodes.episodes.map(
                    (e) => {
                      if (e.title === episode.title) {
                        return {
                          ...e,
                          thumbnail: downloadURL,
                        };
                      }
                      return e;
                    }
                  );
                  return {
                    ...prevData,
                    episodes: {
                      episodes: updatedEpisodes,
                    },
                  };
                });

                setUploadsFinishedThumbnails((prev) => prev + 1); // increment uploaded state
                resolve();
              }
            );
          }
        );
      });
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    uploadVideosEpisodes(newSeason.episodes.episodes);
    uploadSubtitlesEpisodes(newSeason.episodes.episodes);
    uploadThumbnailsEpisodes(newSeason.episodes.episodes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSeasonObj = {
      number: newSeason.number,
      episodes: newSeason.episodes.episodes,
    };
    try {
      const { data } = await axios.post(`${CREATE_NEW_SEASON}`, {
        seriesId: selectedSeries._id,
        newSeason: newSeasonObj,
      });
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(uploadsFinishedVideos === Number(numOfEpisodes));
  console.log("finishedUploadedVideos:", uploadsFinishedVideos);
  console.log("numOfEpisodes:", numOfEpisodes);
  return (
    <Layout>
      <div className="newSeason">
        <h1 className="addNewSeasonTitle">{"Add New Season"}</h1>
        <form className="addProductForm">
          <div className="addProductItem">
            <label style={{ color: "white" }}>Season Number</label>
            <input
              type="text"
              id="number"
              name="number"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label style={{ color: "white" }}>Number Of Episodes</label>
            <input
              type="number"
              id="number"
              name="number"
              onChange={handleChangeNumOfEpisodes}
            />
          </div>
          {Array.from({ length: numOfEpisodes }, (_, index) => (
            <div className="addProductItem" key={index}>
              <h4>Episode {index + 1}</h4>
              <label>
                Title:
                <input
                  type="text"
                  value={newSeason?.episodes?.episodes[index]?.title || ""}
                  onChange={(event) =>
                    handleEpisodeChange(index, "title", event.target.value)
                  }
                />
              </label>
              <br />
              <label>
                Description:
                <textarea
                  value={
                    newSeason?.episodes?.episodes[index]?.description || ""
                  }
                  onChange={(event) =>
                    handleEpisodeChange(
                      index,
                      "description",
                      event.target.value
                    )
                  }
                />
              </label>
              <br />
              <label>
                Duration:
                <input
                  type="text"
                  value={newSeason?.episodes?.episodes[index]?.duration || ""}
                  onChange={(event) =>
                    handleEpisodeChange(index, "duration", event.target.value)
                  }
                />
              </label>
              <br />
              <label>
                Video:
                <input
                  type="file"
                  onChange={(event) => handleVideoEpisodeUpload(index, event)}
                />
              </label>
              <br />
              <label>
                Subtitles:
                <input
                  type="file"
                  onChange={(event) =>
                    handleSubtitlesEpisodeUpload(index, event)
                  }
                />
              </label>
              <br />
              <label>
                Thumbnail:
                <input
                  type="file"
                  onChange={(event) =>
                    handleThumbnailsEpisodeUpload(index, event)
                  }
                />
              </label>
              <br />
            </div>
          ))}
          <div className="formRight">
            <div className="addProductItem">
              <label style={{ color: "white" }}>Content</label>
              <select
                multiple
                name="content"
                onChange={handleSelect}
                style={{ height: "280px" }}
              >
                {series?.map((series) => (
                  <option key={series._id} value={series._id}>
                    {series.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {uploadsFinishedVideos === parseInt(numOfEpisodes, 10) ? (
            <button className="addProductButton" onClick={handleSubmit}>
              Create
            </button>
          ) : (
            <button className="addProductButton" onClick={handleUpload}>
              Upload
            </button>
          )}
        </form>
        {!showProgressEpisodes ? null : (
          <div className="progressBar">
            <LinearProgressBar progress={progressVideoUpload} />
            {`uploadState : ${uploadVideoState}`} <br />
            {`total files uploaded : ${uploadsFinishedVideos}/${numOfEpisodes}`}
            <br />
            {uploadsFinishedVideos !== numOfEpisodes &&
              `currently uploading : ${videoFileUploaded}`}
            {isUploadVideoTask && uploadsFinishedVideos !== numOfEpisodes && (
              <button
                className="addProductButton cancel"
                onClick={handleCanceVideoEpisodelUpload}
              >
                Cancel Upload
              </button>
            )}
            {isUploadVideoTask &&
              uploadsFinishedVideos !== numOfEpisodes &&
              isPauseEpisodes && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseVideoEpisodeUpload}
                >
                  Pause Upload
                </button>
              )}
            {isUploadVideoTask &&
              uploadsFinishedVideos !== numOfEpisodes &&
              !isPauseEpisodes && (
                <button
                  className="addProductButton resume"
                  onClick={handleResumeVideoEpisodeUpload}
                >
                  Resume Upload
                </button>
              )}
          </div>
        )}

        {!showProgressEpisodes ? null : (
          <div className="progressBar">
            <LinearProgressBar progress={progressSubtitleUpload} />
            {`uploadState : ${uploadSubtitleState}`} <br />
            {`total files uploaded : ${uploadsFinishedSubtitles}/${numOfEpisodes}`}
            <br />
            {uploadsFinishedSubtitles !== numOfEpisodes &&
              `currently uploading : ${subtitleFileUploaded}`}
            {isUploadSubtitleTask &&
              uploadsFinishedSubtitles !== numOfEpisodes && (
                <button
                  className="addProductButton cancel"
                  onClick={handleCanceSubtitlesEpisodelUpload}
                >
                  Cancel Upload
                </button>
              )}
            {isUploadSubtitleTask &&
              uploadsFinishedSubtitles !== numOfEpisodes &&
              isPauseEpisodes && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseSubtitlesEpisodeUpload}
                >
                  Pause Upload
                </button>
              )}
            {isUploadSubtitleTask &&
              uploadsFinishedSubtitles !== numOfEpisodes &&
              !isPauseEpisodes && (
                <button
                  className="addProductButton resume"
                  onClick={handleResumeSubtitlesEpisodeUpload}
                >
                  Resume Upload
                </button>
              )}
          </div>
        )}

        {!showProgressEpisodes ? null : (
          <div className="progressBar">
            <LinearProgressBar progress={progressThumbnailUpload} />
            {`uploadState : ${uploadThumbnailState}`} <br />
            {`total files uploaded : ${uploadsFinishedThumbnails}/${numOfEpisodes}`}
            <br />
            {uploadsFinishedThumbnails !== numOfEpisodes &&
              `currently uploading : ${thumbnailFileUploaded}`}
            {isUploadThumbnailTask &&
              uploadsFinishedThumbnails !== numOfEpisodes && (
                <button
                  className="addProductButton cancel"
                  onClick={handleCanceThumbnailsEpisodelUpload}
                >
                  Cancel Upload
                </button>
              )}
            {isUploadThumbnailTask &&
              uploadsFinishedThumbnails !== numOfEpisodes &&
              isPauseEpisodes && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseThumbnailsEpisodeUpload}
                >
                  Pause Upload
                </button>
              )}
            {isUploadThumbnailTask &&
              uploadsFinishedThumbnails !== numOfEpisodes &&
              !isPauseEpisodes && (
                <button
                  className="addProductButton resume"
                  onClick={handleResumeThumbnailsEpisodeUpload}
                >
                  Resume Upload
                </button>
              )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddSeason;
