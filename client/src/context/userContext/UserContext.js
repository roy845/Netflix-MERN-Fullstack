import UserReducer from "./UserReducer";
import { createContext, useReducer, useState } from "react";

const Initial_State = {
  newUsers: [],
  usersStats: [],
  users: [],
  isFetching: false,
  error: false,
};

export const UserContext = createContext(Initial_State);

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, Initial_State);
  const [movieInfo, setMovieInfo] = useState({
    rating: 0,
    like: false,
    dislike: false,
  });

  const [myMovieListInfo, setMyMovieListInfo] = useState({
    title: "",
    content: [],
    isAdded: {},
  });

  const [mySeriesListInfo, setMySeriesListInfo] = useState({
    title: "",
    content: [],
    isAdded: {},
  });

  const defaultAvatar =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkCAMAAAAua3VzAAAAyVBMVEX/rQH/////qwD///3/rwD/qQD///v6qgD//f77qAD///b/pwD7pgD///jywFv+rRP9/+3xtj/0z5D8+en036/2w270oAD3rSj2szL3rQf4x3j54Lf47tD12J35u0r5sCP1yn3258L204v1x2rxvlH12KX1vmPuznv579fyyHL3vFz8/eX4wXL7uT/yrwj21pT14qr55snepivLlTnioiLMoETisDDYpTfiskrXqUfRmTDlsUG4j0DKjhrSmyTEiSa5iyvlngnXkwLn3lR0AAAEy0lEQVR4nO2bC3OiSBDHYR4MDx8xEB0SBRHjYbLGnJpzY6K7ue//oW4GkBV2LwkcXLJV/UtV0CqZ/tM9L6dbRQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoD4IiS9IvGrMBMpekEpGxE2MDDjnXUZr1FUwwrrCxKCLKEJvf/oXUPfyyjZNczjyWjVrSyHIHwe2qZ0F5wujUguUB5qaYE9YzfJSE9MhPpoIKziC0Kmp/iBwq0XjNQsIhVn7QuuIKSVtELqw41sluvDodf2+RKGpaieOmJT2JblS8bEFjDXcDmsePYQMIlXDmURdNXnZNmYazhrAui4C3q1XpGL9IZ7+xAhWnZLRQiPxaDnMXs0iW0O1QFTSldYwL1I857zmoeOaKs5Z0Mybci30b3N9WjZ3btUr0s8ZiE18KeeH/lnuMWUTdYvkuCASq19oKZU/dRisXtQ8vJlZsKCbs3JrI3WKvVprYODgvDOjRbnpHM0L4VYjv2aR1rLghdJTkOIHhSbm1XYArzC4zfentld2/kDTdjrkEgK3bo0KGufH96jsskgUOhdNiGVL/In/9l3tGwwxdEYyyHJngLEu3FBhZFphFLtSOLPt+KiJ3XlrYh8Hj7msECoitlJ8GcX3BzPWiEaiMO/6LDbhzIwf3yXej5yyKLvrdHquISU2IBNJK4wLEwzFb6uaKLcGVKLitxsAAAAAAAAAAAAAAAAAaAhE5KEtauR4sTaEuBbv9FrVKhzey389H6Q9x9S0+9pTBycw78ZjyQloSVfIs1kFsem1JlPJ6n0z9QnSUGtp23YQtmhW/1KKvufYaY7E9uqXl0DHaTIq9Euf2SJjEMoqDHm4L5MQl9VPpF/Ht5MMhaoGYz/JxLyhFaUep2wxkilMIVHWJmDVnDUjkihTM8sQatHkzqL0TTuiHyrUYvPAztJhmuyTDSS0UpELO0ubycAF8wWz3og6MlzvMogHS5YTE35cNlR9JDAm6jHeWNXF1b6aeIYVz0ppHdlJ+BFttXg4+jMdK8njYXmbM21Oo7C7NNV8ShebkTPvDboMZdVd8oK63YEX3kf2SQ1LXCsiHDrslC0KKgexxFSs/owZBc75ZHwRMx9PRs4wah91nSRnRaCDDqPNVe0lIDYLcp7UcVZTpLZjsrdaPOOcOl5zOm7jEmOZlMdTsrCuF0p1fkmc/JUfbEcTv9lA52S2+GioFZz078TdEkfXodvkgl2EEGT4N1dn75IY1xyd3YfcoP+fG5V4+IpuZfWncvSqSeRxGn9dT2YoLSkoE2PKDpa8b9E4Y/0Bu0gxUU/H18NsLZFFAanIBHvoTEKfGR+YmiVim00p63LvchREdlvDKVrbvhXyLjzuK0ZT+4jSUMvq913e8zqCmx6/c1t9y0rLLD6JxiNi0REgSLwDAAAAAAAAAAAAAAAAvweEJUds5HjSRmLk5SNlFeixlbxwQ/5miLgKWa0PGwW53U1jieXSkIfNw19Pg+3XLX/ive3jhu82/u5pNV1vnxpKNZaHbHsPW/58WG0enx+f/e3gMNh8Xa9Xj/sD33+WiLO9+23zff+yWm92uz05vJDDerfffH/ZHV7+/iwi4/xDhkJO3n6eQ2uCUFJyg44/tkvTu6jCj++A355/AIfoRL06NjCqAAAAAElFTkSuQmCC";

  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  return (
    <UserContext.Provider
      value={{
        newUsers: state.newUsers,
        users: state.users,
        usersStats: state.usersStats,
        isFetching: state.isFetching,
        error: state.error,
        movieInfo,
        setMovieInfo,
        myMovieListInfo,
        setMyMovieListInfo,
        mySeriesListInfo,
        setMySeriesListInfo,
        defaultAvatar,
        notifications,
        setNotifications,
        notificationsCount,
        setNotificationsCount,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
