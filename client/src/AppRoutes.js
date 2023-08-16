import "./app.scss";
import Home from "./pages/Home/Home";
import Watch from "./pages/Watch/Watch";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import Dashboard from "./pages/admin/pages/dashboard/Dashboard";
import AdminRoute from "./pages/admin/routes/AdminRoute";
import UserList from "./pages/admin/pages/userList/UserList";
import User from "./pages/admin/pages/user/User";
import NewUser from "./pages/admin/pages/newUser/NewUser";
import ProductList from "./pages/admin/pages/products/ProdcutList";
import Product from "./pages/admin/pages/product/Product";
import NewProduct from "./pages/admin/pages/newProduct/NewProduct";
import ListList from "./pages/admin/pages/listList/ListList";
import { useAuth } from "./context/authContext/AuthContext";
import List from "./pages/admin/pages/List/List";
import NewList from "./pages/admin/pages/newList/NewList";
import NoMoviesToDisplay from "./components/NoMoviesToDisplay/NoMoviesToDisplay";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import MoviesSearch from "./components/MoviesSearch/MoviesSearch";
import MyList from "./components/MyList/MyList";
import Profiles from "./components/Profiles/Profiles";
import EditProfile from "./components/EditProfile/EditProfile";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import NotificationsComponent from "./components/Notifications/NotificationsComponent";
import MovieInfoModal from "./components/MovieInfo/MovieInfo";
import MovieInfoComponent from "./components/MovieInfoComponent/MovieInfoComponent";
import SeriesInfoComponent from "./components/SeriesInfoComponent/SeriesInfoComponent";
import WatchSeries from "./pages/WatchSeries/WatchSeries";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AnalyticsDashboard from "./components/Analytics/AnalyticsDashboard";
import MainDashboard from "./components/Analytics/MainDashboard";
import AddSeason from "./pages/admin/pages/AddSeason/AddSeason";
import AddEpisode from "./pages/admin/pages/AddEpisode/AddEpisode";

const AppRoutes = () => {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!auth ? <Login /> : <Home />} />

      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />

      <Route element={<RequireAuth />}>
        <Route path="/movies" element={<Home type="movies" />} />
        <Route path="/series" element={<Home type="series" />} />
        <Route path="/watch/:id" element={<Watch />} />{" "}
        <Route
          path="/watchSeries/:seasonNumber/:id"
          element={<WatchSeries />}
        />{" "}
        <Route path="/searchMovies" element={<MoviesSearch />} />
        <Route path="/myList" element={<MyList />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/editProfile/:id" element={<EditProfile />} />
        <Route path="/notifications" element={<NotificationsComponent />} />
        <Route path="/movieInfo/:mId" element={<MovieInfoComponent />} />
        <Route path="/seriesInfo/:sId" element={<SeriesInfoComponent />} />
        <Route path="/noMoviesToDisplay" element={<NoMoviesToDisplay />} />
        <Route path="/mainAnalyticsDashboard" element={<MainDashboard />} />
        <Route path="/watchingAnalytics" element={<AnalyticsDashboard />} />
      </Route>

      <Route path="/dashboard" element={<AdminRoute />}>
        <Route path="" element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="user/:userId" element={<User />} />
        <Route path="newUser" element={<NewUser />} />
        <Route path="movies" element={<ProductList />} />
        <Route path="product/:productId" element={<Product />} />
        <Route path="newProduct" element={<NewProduct />} />
        <Route path="lists" element={<ListList />} />
        <Route path="list/:productId" element={<List />} />
        <Route path="newList" element={<NewList />} />
        <Route path="addSeason" element={<AddSeason />} />
        <Route path="addEpisode" element={<AddEpisode />} />
      </Route>

      <Route
        path="/unauthorized"
        element={<Unauthorized profilesPath="/profiles" />}
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
