import "./widgetLg.scss";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../../context/userContext/UserContext";
import { getNewUsers } from "../../../../context/userContext/apiCalls";

const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";
const WidgetLg = () => {
  const { newUsers, dispatch } = useContext(UserContext);
  const { defaultAvatar } = useContext(UserContext);
  useEffect(() => {
    getNewUsers(dispatch);
  }, []);

  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  console.log(newUsers);
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Users status</h3>
      <table className="widgetLgTable">
        <tbody>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">User</th>
            <th className="widgetLgTh">Created</th>

            <th className="widgetLgTh">Status</th>
          </tr>

          {newUsers?.map((user) => {
            const dateString = user.createdAt.toString();
            const date = new Date(dateString);
            const formattedDate = date.toLocaleString();

            return (
              <tr className="widgetLgTr">
                <td className="widgetLgUser">
                  <img
                    src={
                      user.profilePic.data.data.length === 0
                        ? defaultAvatar
                        : `${BASE_IMAGE_URL}${user._id}?t=${Date.now()}`
                    }
                    alt=""
                    className="widgetLgImg"
                  />
                  <span className="widgetLgName">{user.username}</span>
                </td>
                <td className="widgetLgDate">{formattedDate}</td>

                <td className="widgetLgStatus">
                  <Button
                    type={user.isConnected === true ? "Active" : "Unactive"}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WidgetLg;
