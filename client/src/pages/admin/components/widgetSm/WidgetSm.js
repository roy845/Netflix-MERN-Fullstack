import "./widgetSm.scss";
import { Visibility } from "@material-ui/icons";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../../context/userContext/UserContext";
import { getNewUsers } from "../../../../context/userContext/apiCalls";
const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";
const WidgetSm = () => {
  const { newUsers, dispatch } = useContext(UserContext);
  const { defaultAvatar } = useContext(UserContext);
  useEffect(() => {
    getNewUsers(dispatch);
  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {newUsers?.map((user) => (
          <>
            {" "}
            <li key={user._id} className="widgetSmListItem">
              <img
                src={
                  user.profilePic.data.data.length === 0
                    ? defaultAvatar
                    : `${BASE_IMAGE_URL}${user._id}?t=${Date.now()}`
                }
                alt=""
                className="widgetSmImg"
              />
              <div className="widgetSmUser">
                <span className="widgetSmUserName">{user.username}</span>
              </div>
              <button className="widgetSmButton">
                <Visibility className="widgetSmIcon" />
                Display
              </button>
            </li>
            <hr />
          </>
        ))}
      </ul>
    </div>
  );
};

export default WidgetSm;
