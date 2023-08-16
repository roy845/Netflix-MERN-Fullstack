import "./newProduct.scss";
import Layout from "../../components/Layout/Layout";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { createMovie } from "../../../../context/movieContext/apiCalls";
import { MovieContext } from "../../../../context/movieContext/MovieContext";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const [movie, setMovie] = useState({ isSeries: "false" });
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [numberOfActors, setNumberOfActors] = useState(0);
  const [actors, setActors] = useState({});
  const [actorsFiles, setActorsFiles] = useState({});
  const [directorFile, setDirectorFile] = useState(null);
  const [directorName, setDirectorName] = useState("");
  const [subtitles, setSubtitles] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [uploadedImages, setUploadedImages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressImages, setProgressImages] = useState(0);
  const [uploadState, setUploadState] = useState("");
  const [uploadStateImages, setUploadStateImages] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [showProgressImages, setShowProgressImages] = useState(false);
  const [fileUploaded, setFileUploaded] = useState("");
  const [fileUploadedImagesActors, setFileUploadedImagesActors] = useState("");
  const [isUploadTask, setIsUploadTask] = useState(null);
  const [isUploadTaskImageActors, setIsUploadTaskImageActors] = useState(null);
  const [error, setError] = useState("");
  const [isPause, setIsPause] = useState(false);
  const [isPauseImageActors, setIsPauseImageActors] = useState(false);

  const [showProgressDirector, setShowProgressDirector] = useState(false);
  const [isPauseImageDirector, setIsPauseImageDirector] = useState(false);
  const [isUploadTaskImageDirector, setIsUploadTaskImageDirector] =
    useState(false);
  const [fileUploadedImagesDirector, setFileUploadedImagesDirector] =
    useState("");
  const [progressDirector, setProgressDirector] = useState(0);
  const [uploadStateDirector, setUploadStateDirector] = useState("");
  const [uploadedDirector, setUploadedDirector] = useState(0);

  //==============================================================================tvShow section
  const [numOfSeasons, setNumOfSeasons] = useState(0);
  const [numOfEpisodes, setNumOfEpisodes] = useState(0);

  useEffect(() => {
    if (movie?.isSeries === "true") {
      const series = { seasons: [] };
      const numSeasons = parseInt(prompt("Enter the number of seasons:"));

      for (let i = 0; i < numSeasons; i++) {
        const season = { number: i + 1, episodes: [] };
        const numEpisodes = parseInt(
          prompt(`Enter the number of episodes in Season ${i + 1}:`)
        );

        for (let j = 0; j < numEpisodes; j++) {
          const episode = {
            title: "",
            description: "",
            duration: "",
            video: null,
            subtitles: null,
            thumbnail: null,
          };
          season.episodes.push(episode);
        }

        series.seasons.push(season);
      }
      const seasons = series.seasons;
      setMovie({ ...movie, seasons });

      setNumOfSeasons(seasons?.length);
      const numberOfEpisodes = seasons?.reduce(
        (total, season) => total + season?.episodes?.length,
        0
      );

      setNumOfEpisodes(numberOfEpisodes);
    } else {
      if (movie?.hasOwnProperty("seasons")) {
        delete movie?.seasons;
      }
    }
  }, [movie?.isSeries]);

  console.log("Number of seasons: ", numOfSeasons);
  console.log("Number of episodes: ", numOfEpisodes);
  console.log(movie);

  const handleEpisodeChange = (seasonIndex, episodeIndex, field, value) => {
    setMovie((prevData) => {
      const seasons = [...prevData.seasons];
      const episodes = [...seasons[seasonIndex].episodes];
      episodes[episodeIndex][field] = value;
      seasons[seasonIndex].episodes = episodes;
      return {
        ...prevData,
        seasons,
      };
    });
  };

  const handleVideoEpisodeUpload = (seasonIndex, episodeIndex, event) => {
    const file = event.target.files[0];
    setMovie((prevData) => {
      const seasons = [...prevData.seasons];
      const episodes = [...seasons[seasonIndex].episodes];
      episodes[episodeIndex].video = file;
      seasons[seasonIndex].episodes = episodes;
      return {
        ...prevData,
        seasons,
      };
    });
  };

  const handleSubtitlesEpisodeUpload = (seasonIndex, episodeIndex, event) => {
    const file = event.target.files[0];
    setMovie((prevData) => {
      const seasons = [...prevData.seasons];
      const episodes = [...seasons[seasonIndex].episodes];
      episodes[episodeIndex].subtitles = file;
      seasons[seasonIndex].episodes = episodes;
      return {
        ...prevData,
        seasons,
      };
    });
  };

  const handleThumbnailsEpisodeUpload = (seasonIndex, episodeIndex, event) => {
    const file = event.target.files[0];
    setMovie((prevData) => {
      const seasons = [...prevData.seasons];
      const episodes = [...seasons[seasonIndex].episodes];
      episodes[episodeIndex].thumbnail = file;
      seasons[seasonIndex].episodes = episodes;
      return {
        ...prevData,
        seasons,
      };
    });
  };

  const generateInputFields = () => {
    const inputFields = [];
    if (movie?.seasons) {
      movie?.seasons.forEach((season, seasonIndex) => {
        inputFields.push(
          <div key={`season${seasonIndex}`} className="addProductItem">
            <h3>Season {season.number}</h3>
            {season.episodes.map((episode, episodeIndex) => (
              <div key={`season${seasonIndex}-episode${episodeIndex}`}>
                <h4>Episode {episodeIndex + 1}</h4>
                <label>
                  Title:
                  <input
                    type="text"
                    value={episode.title}
                    onChange={(event) =>
                      handleEpisodeChange(
                        seasonIndex,
                        episodeIndex,
                        "title",
                        event.target.value
                      )
                    }
                  />
                </label>
                <br />
                <label>
                  Description:
                  <textarea
                    value={episode.description}
                    onChange={(event) =>
                      handleEpisodeChange(
                        seasonIndex,
                        episodeIndex,
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
                    value={episode.duration}
                    onChange={(event) =>
                      handleEpisodeChange(
                        seasonIndex,
                        episodeIndex,
                        "duration",
                        event.target.value
                      )
                    }
                  />
                </label>
                <br />
                <label>
                  Video:
                  <input
                    type="file"
                    onChange={(event) =>
                      handleVideoEpisodeUpload(seasonIndex, episodeIndex, event)
                    }
                  />
                </label>
                <br />
                <label>
                  Subtitles:
                  <input
                    type="file"
                    onChange={(event) =>
                      handleSubtitlesEpisodeUpload(
                        seasonIndex,
                        episodeIndex,
                        event
                      )
                    }
                  />
                </label>
                <br />
                <label>
                  Thumbnail:
                  <input
                    type="file"
                    onChange={(event) =>
                      handleThumbnailsEpisodeUpload(
                        seasonIndex,
                        episodeIndex,
                        event
                      )
                    }
                  />
                </label>
                <br />
              </div>
            ))}
          </div>
        );
      });
    }
    return inputFields;
  };

  const videoUploadTaskRef = useRef(null);
  const subtitleUploadTaskRef = useRef(null);
  const [isUploadVideoTask, setIsUploadVideoTask] = useState(null);
  const [videoFileUploaded, setVideoFileUploaded] = useState("");
  const [isUploadSubtitleTask, setIsUploadSubtitleTask] = useState(null);
  const [subtitleFileUploaded, setSubtitleFileUploaded] = useState("");
  const [isPauseSeasons, setIsPauseSeasons] = useState(false);
  const [progressVideoUpload, setProgressVideoUpload] = useState(0);
  const [showProgressSeasons, setShowProgressSeasonsUpload] = useState(0);
  const [progressSubtitleUpload, setProgressSubtitleUpload] = useState(0);
  const [uploadVideoState, setUploadVideoState] = useState("");
  const [uploadSubtitleState, setUploadSubtitleState] = useState("");
  const [uploadsFinishedVideos, setUploadsFinishedVideos] = useState(0);
  const [uploadsFinishedSubtitles, setUploadsFinishedSubtitles] = useState(0);

  const thumbnailUploadTaskRef = useRef(null);
  const [isUploadThumbnailTask, setIsUploadThumbnailTask] = useState(null);
  const [thumbnailFileUploaded, setThumbnailFileUploaded] = useState("");
  const [progressThumbnailUpload, setProgressThumbnailUpload] = useState(0);
  const [uploadThumbnailState, setUploadThumbnailState] = useState("");
  const [uploadsFinishedThumbnails, setUploadsFinishedThumbnails] = useState(0);

  console.log("finished Episodes Videos: ", uploadsFinishedVideos);
  console.log("finished Episodes Subtitles: ", uploadsFinishedSubtitles);

  const handlePauseVideoEpisodeUpload = () => {
    // Access the upload task from the ref variable and pause it
    if (videoUploadTaskRef.current) {
      videoUploadTaskRef.current.pause();
      setIsUploadVideoTask(videoUploadTaskRef.current); // update the upload task state variable
      setIsPauseSeasons(false);
    }
  };

  const handleResumeVideoEpisodeUpload = () => {
    // Access the upload task from the ref variable and resume it
    if (videoUploadTaskRef.current) {
      videoUploadTaskRef.current.resume();
      setIsUploadVideoTask(videoUploadTaskRef.current); // update the upload task state variable
      setIsPauseSeasons(true);
    }
  };

  const handleCanceVideoEpisodelUpload = () => {
    // Access the upload task from the ref variable and cancel it
    if (videoUploadTaskRef.current) {
      videoUploadTaskRef.current.cancel();
      setIsUploadVideoTask(null); // reset the upload task state variable
      setIsPauseSeasons(false); // hide the progress bar
    }
    const storageRef = ref(storage, `series/${movie.title}`);
    deleteFolder(storageRef);
    setUploaded(0);
  };

  const handlePauseSubtitlesEpisodeUpload = () => {
    // Access the upload task from the ref variable and pause it
    if (subtitleUploadTaskRef.current) {
      subtitleUploadTaskRef.current.pause();
      setIsUploadSubtitleTask(subtitleUploadTaskRef.current); // update the upload task state variable
      setIsPauseSeasons(false);
    }
  };

  const handleResumeSubtitlesEpisodeUpload = () => {
    // Access the upload task from the ref variable and resume it
    if (subtitleUploadTaskRef.current) {
      subtitleUploadTaskRef.current.resume();
      setIsUploadSubtitleTask(subtitleUploadTaskRef.current); // update the upload task state variable
      setIsPauseSeasons(true);
    }
  };

  const handleCanceSubtitlesEpisodelUpload = () => {
    // Access the upload task from the ref variable and cancel it
    if (subtitleUploadTaskRef.current) {
      subtitleUploadTaskRef.current.cancel();
      setIsUploadSubtitleTask(null); // reset the upload task state variable
      setIsPauseSeasons(false); // hide the progress bar
    }
    const storageRef = ref(storage, `series/${movie.title}`);
    deleteFolder(storageRef);
    setUploaded(0);
  };

  const handlePauseThumbnailsEpisodeUpload = () => {
    // Access the upload task from the ref variable and pause it
    if (thumbnailUploadTaskRef.current) {
      thumbnailUploadTaskRef.current.pause();
      setIsUploadThumbnailTask(thumbnailUploadTaskRef.current); // update the upload task state variable
      setIsPauseSeasons(false);
    }
  };

  const handleResumeThumbnailsEpisodeUpload = () => {
    // Access the upload task from the ref variable and resume it
    if (thumbnailUploadTaskRef.current) {
      thumbnailUploadTaskRef.current.resume();
      setIsUploadThumbnailTask(thumbnailUploadTaskRef.current); // update the upload task state variable
      setIsPauseSeasons(true);
    }
  };

  const handleCanceThumbnailsEpisodelUpload = () => {
    // Access the upload task from the ref variable and cancel it
    if (thumbnailUploadTaskRef.current) {
      thumbnailUploadTaskRef.current.cancel();
      setIsUploadThumbnailTask(null); // reset the upload task state variable
      setIsPauseSeasons(false); // hide the progress bar
    }
    const storageRef = ref(storage, `series/${movie.title}`);
    deleteFolder(storageRef);
    setUploaded(0);
  };

  const uploadVideosEpisodes = async (seasons) => {
    setShowProgressSeasonsUpload(true);
    setIsPauseSeasons(true);

    for (const season of seasons) {
      for (const episode of season.episodes) {
        // Upload video
        const fileName = new Date().getTime() + episode.video.name;
        const storageRef = ref(storage, `${movie.title}/${fileName}`);

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
              getDownloadURL(videoUploadTask.snapshot.ref).then(
                (downloadURL) => {
                  // Update movie object
                  setMovie((prev) => ({
                    ...prev,
                    seasons: prev.seasons.map((s) => {
                      if (s.number === season.number) {
                        return {
                          ...s,
                          episodes: s.episodes.map((e) => {
                            if (e.title === episode.title) {
                              return {
                                ...e,
                                video: downloadURL,
                              };
                            }
                            return e;
                          }),
                        };
                      }
                      return s;
                    }),
                  }));

                  setUploadsFinishedVideos((prev) => prev + 1); // increment uploaded state
                  resolve();
                }
              );
            }
          );
        });
      }
    }
  };

  const uploadSubtitlesEpisodes = async (seasons) => {
    setShowProgressSeasonsUpload(true);
    setIsPauseSeasons(true);

    for (const season of seasons) {
      for (const episode of season.episodes) {
        // Upload subtitle
        if (episode.subtitles) {
          const fileName = new Date().getTime() + episode.subtitles.name;
          const storageRef = ref(storage, `${movie.title}/${fileName}`);

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
                getDownloadURL(subtitleUploadTask.snapshot.ref).then(
                  (downloadURL) => {
                    // Update movie object
                    setMovie((prev) => ({
                      ...prev,
                      seasons: prev.seasons.map((s) => {
                        if (s.number === season.number) {
                          return {
                            ...s,
                            episodes: s.episodes.map((e) => {
                              if (e.title === episode.title) {
                                return {
                                  ...e,
                                  subtitles: downloadURL,
                                };
                              }
                              return e;
                            }),
                          };
                        }
                        return s;
                      }),
                    }));

                    setUploadsFinishedSubtitles((prev) => prev + 1); // increment uploaded state
                    resolve();
                  }
                );
              }
            );
          });
        }
      }
    }
  };

  const uploadThumbnailsEpisodes = async (seasons) => {
    setShowProgressSeasonsUpload(true);
    setIsPauseSeasons(true);

    for (const season of seasons) {
      for (const episode of season.episodes) {
        // Upload video
        const fileName = new Date().getTime() + episode.thumbnail.name;
        const storageRef = ref(storage, `${movie.title}/${fileName}`);

        const thumbnailUploadTask = uploadBytesResumable(
          storageRef,
          episode.thumbnail
        );

        thumbnailUploadTaskRef.current = thumbnailUploadTask;

        setIsUploadVideoTask(thumbnailUploadTask);
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
                  // Update movie object
                  setMovie((prev) => ({
                    ...prev,
                    seasons: prev.seasons.map((s) => {
                      if (s.number === season.number) {
                        return {
                          ...s,
                          episodes: s.episodes.map((e) => {
                            if (e.title === episode.title) {
                              return {
                                ...e,
                                thumbnail: downloadURL,
                              };
                            }
                            return e;
                          }),
                        };
                      }
                      return s;
                    }),
                  }));

                  setUploadsFinishedThumbnails((prev) => prev + 1); // increment uploaded state
                  resolve();
                }
              );
            }
          );
        });
      }
    }
  };

  //=============================================================================================

  const navigate = useNavigate();

  const uploadTaskRef = useRef(null);
  const uploadActorsImagesTaskRef = useRef(null);
  const uploadDirectorImagesTaskRef = useRef(null);

  const { dispatch } = useContext(MovieContext);
  let genres = [];
  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.name === "genres") {
      genres = e.target.value.split(" ");
      console.log(genres);
      setMovie({ ...movie, [e.target.name]: genres });
    } else {
      setMovie({ ...movie, [e.target.name]: value });
    }
  };

  console.log(movie);

  const handleActorsChange = (e) => {
    const value = e.target.value;
    setActors({ ...actors, [e.target.name]: value });
  };

  let directors = [];

  const handleChangeDirectorName = (e) => {
    const value = e.target.value;
    directors = value.split(",");
    console.log(directors);
    setDirectorName(directors);
  };

  const handleNumberOfActorsChange = (event) => {
    setNumberOfActors(event.target.value);
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

  const handlePauseUploadImagesActors = () => {
    // Access the upload task from the ref variable and pause it
    if (uploadActorsImagesTaskRef.current) {
      uploadActorsImagesTaskRef.current.pause();
      setIsUploadTaskImageActors(uploadActorsImagesTaskRef.current); // update the upload task state variable
      setIsPauseImageActors(false);
    }
  };

  const handlePauseUploadImagesDirector = () => {
    // Access the upload task from the ref variable and pause it
    if (uploadDirectorImagesTaskRef.current) {
      uploadDirectorImagesTaskRef.current.pause();
      setIsUploadTaskImageDirector(uploadDirectorImagesTaskRef.current); // update the upload task state variable
      setIsPauseImageDirector(false);
    }
  };

  const handleResumeUploadImagesDirector = () => {
    // Access the upload task from the ref variable and resume it
    if (uploadDirectorImagesTaskRef.current) {
      uploadDirectorImagesTaskRef.current.resume();
      setIsUploadTaskImageDirector(uploadDirectorImagesTaskRef.current); // update the upload task state variable
      setIsPauseImageDirector(true);
    }
  };

  const handleResumeUploadImagesActors = () => {
    // Access the upload task from the ref variable and resume it
    if (uploadActorsImagesTaskRef.current) {
      uploadActorsImagesTaskRef.current.resume();
      setIsUploadTaskImageActors(uploadActorsImagesTaskRef.current); // update the upload task state variable
      setIsPauseImageActors(true);
    }
  };

  const handleCancelUploadImagesActors = () => {
    // Access the upload task from the ref variable and cancel it
    if (uploadActorsImagesTaskRef.current) {
      uploadActorsImagesTaskRef.current.cancel();
      setIsUploadTaskImageActors(null); // reset the upload task state variable
      setShowProgressImages(false); // hide the progress bar
    }
    const storageRef = ref(storage, `/${movie.title}`);
    deleteFolder(storageRef);
    setUploadedImages(0);
  };

  const handleCancelUploadImagesDirector = () => {
    // Access the upload task from the ref variable and cancel it
    if (uploadDirectorImagesTaskRef.current) {
      uploadDirectorImagesTaskRef.current.cancel();
      setIsUploadTaskImageDirector(null); // reset the upload task state variable
      setShowProgressDirector(false); // hide the progress bar
    }
    const storageRef = ref(storage, `/${movie.title}`);
    deleteFolder(storageRef);
    setUploadedDirector(0);
  };

  const upload = async (items) => {
    setShowProgress(true);
    setIsPause(true);
    for (const item of items) {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const storageRef = ref(storage, `${movie.title}/${fileName}`);
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
            // Get the download URL of the uploaded file
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setMovie((prev) => ({
                ...prev,
                [item.label]: downloadURL,
              }));

              setUploaded((prev) => prev + 1); // increment uploaded state
              resolve();
            });
          }
        );
      });
    }
  };

  const uploadActorsImages = async (actors, actorsWithFiles) => {
    setShowProgressImages(true);
    setIsPauseImageActors(true);
    const actorObjects = [];
    for (const actor of Object.values(actors)) {
      const file = actorsWithFiles.find((f) => f.name === actor).file;
      console.log(file);
      if (file) {
        const fileName = new Date().getTime() + actor + file.name;
        const storageRef = ref(storage, `${movie.title}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadActorsImagesTaskRef.current = uploadTask;

        setIsUploadTaskImageActors(uploadTask);
        setFileUploadedImagesActors(file.name);
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

              setProgressImages(progress);
              switch (snapshot.state) {
                case "paused":
                  setUploadStateImages("Upload is paused");
                  break;
                case "running":
                  setUploadStateImages("Upload is running");
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
              setUploadStateImages("Upload successful");
              // Get the download URL of the uploaded file
              // Get the download URL of the uploaded file
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                actorObjects.push({ name: actor, image: downloadURL });
                setMovie((prev) => ({
                  ...prev,
                  actors: actorObjects,
                }));

                setUploadedImages((prev) => prev + 1); // increment uploaded state
                resolve();
              });
            }
          );
        });
      }
    }
  };

  const uploadDirector = async (director, directorWithFiles) => {
    setShowProgressDirector(true);
    setIsPauseImageDirector(true);
    let directorArray = [];
    for (let i = 0; i < director.length; i++) {
      const file = directorWithFiles.find((f) => f.name[i] === director[i])
        .file[i];
      console.log(file);
      if (file) {
        const fileName = new Date().getTime() + director + file.name;
        const storageRef = ref(storage, `${movie.title}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadDirectorImagesTaskRef.current = uploadTask;

        setIsUploadTaskImageDirector(uploadTask);
        setFileUploadedImagesDirector(file.name);
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

              setProgressDirector(progress);
              switch (snapshot.state) {
                case "paused":
                  setUploadStateDirector("Upload is paused");
                  break;
                case "running":
                  setUploadStateDirector("Upload is running");
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
              setUploadStateDirector("Upload successful");
              // Get the download URL of the uploaded file
              // Get the download URL of the uploaded file
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                directorArray.push({ name: director[i], image: downloadURL });
                // const directorObj = { name: director[i], image: downloadURL };
                setMovie((prev) => ({
                  ...prev,
                  directors: directorArray,
                }));

                setUploadedDirector((prev) => prev + 1); // increment uploaded state
                resolve();
              });
            }
          );
        });
      }
    }
  };

  let filesToUpload = [];

  if (movie?.isSeries === "false") {
    filesToUpload = [
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: imgSm, label: "imgSm" },
      { file: trailer, label: "trailer" },
      { file: video, label: "video" },
      { file: subtitles, label: "subtitles" },
    ];
  } else {
    filesToUpload = [
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: imgSm, label: "imgSm" },
      { file: trailer, label: "trailer" },
    ];
  }

  console.log(movie?.seasons);

  const actorsWithFiles = Object.values(actors).map((actor, index) => ({
    name: actor,
    file: Object.values(actorsFiles)[index],
  }));

  const dName = directorName;

  const directorNameWithFile = [
    {
      name: directorName,
      file: directorFile,
    },
  ];

  const file = directorNameWithFile.find((f) => f.name[0] === dName[0]).file;
  console.log(file);
  console.log(directorNameWithFile);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (movie?.isSeries === "false") {
      upload(filesToUpload);
      uploadActorsImages(actors, actorsWithFiles);
      uploadDirector(dName, directorNameWithFile);
    } else {
      upload(filesToUpload);
      uploadActorsImages(actors, actorsWithFiles);
      uploadDirector(dName, directorNameWithFile);
      uploadVideosEpisodes(movie.seasons);
      uploadSubtitlesEpisodes(movie.seasons);
      uploadThumbnailsEpisodes(movie.seasons);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    createMovie(movie, dispatch);
    navigate("/dashboard/movies");
  };

  const handleActorsFiles = (e) => {
    const value = e.target.files[0];
    setActorsFiles({ ...actorsFiles, [e.target.name]: value });
  };

  const allFieldsNotEmpty =
    movie && Object.values(movie).every((value) => value !== "");
  const allFieldsActorsNotEmpty =
    actors && Object.values(actors).every((value) => value != "");
  let canUpload = null;
  if (movie?.isSeries === "false") {
    canUpload =
      img &&
      imgSm &&
      imgTitle &&
      trailer &&
      video &&
      actorsFiles &&
      allFieldsNotEmpty &&
      allFieldsActorsNotEmpty;
  } else {
    canUpload =
      img &&
      imgSm &&
      imgTitle &&
      trailer &&
      actorsFiles &&
      allFieldsNotEmpty &&
      allFieldsActorsNotEmpty;
  }

  console.log(movie?.isSeries);

  return (
    <Layout>
      <div className="newProduct">
        <h1 className="addProductTitle">
          {movie?.isSeries === "false" ? "New Movie" : "New Series"}
        </h1>
        <form className="addProductForm">
          <div className="addProductItem">
            <label style={{ color: "white" }}>Image</label>
            <input
              type="file"
              id="img"
              name="img"
              onChange={(e) => setImg(e.target.files[0])}
              accept="image/*"
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
          <div className="addProductItem">
            <label style={{ color: "white" }}>Title</label>
            <input
              type="text"
              placeholder="Title"
              name="title"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label style={{ color: "white" }}>Description</label>
            <input
              type="text"
              placeholder="Description"
              name="description"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label style={{ color: "white" }}>Year</label>
            <input
              type="text"
              placeholder="Year"
              name="year"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label
              htmlFor="genre"
              className="tooltip-label"
              style={{ color: "white" }}
            >
              Genre(s)
              <span className="tooltip-text">
                To add multiple genres separate them with space
              </span>
            </label>
            <input
              type="text"
              placeholder="Genres"
              name="genres"
              onChange={handleChange}
            />
          </div>
          {movie?.isSeries === "false" && (
            <div className="addProductItem">
              <label style={{ color: "white" }}>Duration</label>
              <input
                type="text"
                placeholder="Duration"
                name="duration"
                onChange={handleChange}
              />
            </div>
          )}
          <div className="addProductItem">
            <label style={{ color: "white" }}>Limit</label>
            <input
              type="text"
              placeholder="Limit"
              name="limit"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label style={{ color: "white" }}>Is Series ?</label>
            <select id="isSeries" name="isSeries" onChange={handleChange}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="addProductItem">
            <label style={{ color: "white" }}>Number of actors </label>
            <input
              type="number"
              placeholder="Enter number of actors"
              onChange={handleNumberOfActorsChange}
            />
          </div>
          <div className="addProductItem">
            <label
              htmlFor="genre"
              className="tooltip-label"
              style={{ color: "white" }}
            >
              Director(s)
              <span className="tooltip-text">
                To add multiple directors separate them with commas (,)
              </span>
            </label>
            <input
              type="text"
              name="director"
              onChange={handleChangeDirectorName}
              value={directorName}
            />
            <input
              type="file"
              name="director"
              onChange={(e) => {
                setDirectorFile(e.target.files);
              }}
              accept="image/*"
              multiple
            />
          </div>
          {movie?.isSeries === "false" && (
            <div className="addProductItem">
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
          )}
          <div className="addProductItem">
            <label style={{ color: "white" }}>Trailer</label>
            <input
              type="file"
              name="trailer"
              onChange={(e) => setTrailer(e.target.files[0])}
              accept="video/*,video/x-matroska,video/*"
            />
          </div>
          {movie?.isSeries === "true" && generateInputFields()}
          {movie?.isSeries === "false" && (
            <div className="addProductItem">
              <label style={{ color: "white" }}>Video</label>
              <input
                type="file"
                name="video"
                onChange={(e) => setVideo(e.target.files[0])}
                accept="video/*,video/x-matroska,video/*"
              />
            </div>
          )}
          {Array.from({ length: numberOfActors }, (_, index) => (
            <div className="addProductItem" key={index}>
              <input
                type="text"
                name={`actor${index + 1}`}
                onChange={handleActorsChange}
                placeholder={`Enter Actor #${index + 1}`}
              />
              <input
                type="file"
                name={`actor${index + 1}`}
                onChange={handleActorsFiles}
              />
            </div>
          ))}
          {uploaded === filesToUpload.length &&
          uploadedImages === actorsWithFiles.length &&
          uploadsFinishedVideos === numOfEpisodes ? (
            <button className="addProductButton" onClick={handleSubmit}>
              Create
            </button>
          ) : (
            canUpload && (
              <button className="addProductButton" onClick={handleUpload}>
                Upload
              </button>
            )
          )}
        </form>
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

        {!showProgressImages ? null : (
          <div className="progressBar">
            <LinearProgressBar progress={progressImages} />
            {`uploadState : ${uploadStateImages}`} <br />
            {`total files uploaded : ${uploadedImages}/${actorsWithFiles.length}`}
            <br />
            {uploadedImages !== actors.length &&
              `currently uploading : ${fileUploadedImagesActors}`}
            {isUploadTaskImageActors &&
              uploadedImages !== actorsWithFiles.length && (
                <button
                  className="addProductButton cancel"
                  onClick={handleCancelUploadImagesActors}
                >
                  Cancel Upload
                </button>
              )}
            {isUploadTaskImageActors &&
              uploadedImages !== actorsWithFiles.length &&
              isPauseImageActors && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseUploadImagesActors}
                >
                  Pause Upload
                </button>
              )}
            {isUploadTaskImageActors &&
              uploadedImages !== actors.length &&
              !isPauseImageActors && (
                <button
                  className="addProductButton resume"
                  onClick={handleResumeUploadImagesActors}
                >
                  Resume Upload
                </button>
              )}
          </div>
        )}

        {!showProgressDirector ? null : (
          <div className="progressBar">
            <LinearProgressBar progress={progressDirector} />
            {`uploadState : ${uploadStateDirector}`} <br />
            {`total files uploaded : ${uploadedDirector}/${directorName.length}`}
            <br />
            {uploadedDirector !== dName.length &&
              `currently uploading : ${fileUploadedImagesDirector}`}
            {isUploadTaskImageDirector &&
              uploadedDirector !== directorName.length && (
                <button
                  className="addProductButton cancel"
                  onClick={handleCancelUploadImagesDirector}
                >
                  Cancel Upload
                </button>
              )}
            {isUploadTaskImageDirector &&
              uploadedDirector !== directorName.length &&
              isPauseImageDirector && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseUploadImagesDirector}
                >
                  Pause Upload
                </button>
              )}
            {isUploadTaskImageDirector &&
              uploadedDirector !== directorName.length &&
              !isPauseImageDirector && (
                <button
                  className="addProductButton resume"
                  onClick={handleResumeUploadImagesDirector}
                >
                  Resume Upload
                </button>
              )}
          </div>
        )}

        {!showProgressSeasons ? null : (
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
              isPauseSeasons && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseVideoEpisodeUpload}
                >
                  Pause Upload
                </button>
              )}
            {isUploadVideoTask &&
              uploadsFinishedVideos !== numOfEpisodes &&
              !isPauseSeasons && (
                <button
                  className="addProductButton resume"
                  onClick={handleResumeVideoEpisodeUpload}
                >
                  Resume Upload
                </button>
              )}
          </div>
        )}

        {!showProgressSeasons ? null : (
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
              isPauseSeasons && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseSubtitlesEpisodeUpload}
                >
                  Pause Upload
                </button>
              )}
            {isUploadSubtitleTask &&
              uploadsFinishedSubtitles !== numOfEpisodes &&
              !isPauseSeasons && (
                <button
                  className="addProductButton resume"
                  onClick={handleResumeSubtitlesEpisodeUpload}
                >
                  Resume Upload
                </button>
              )}
          </div>
        )}

        {!showProgressSeasons ? null : (
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
              isPauseSeasons && (
                <button
                  className="addProductButton pause"
                  onClick={handlePauseThumbnailsEpisodeUpload}
                >
                  Pause Upload
                </button>
              )}
            {isUploadThumbnailTask &&
              uploadsFinishedThumbnails !== numOfEpisodes &&
              !isPauseSeasons && (
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

export default NewProduct;
