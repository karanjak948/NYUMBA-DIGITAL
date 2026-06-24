import { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";

import Navbar from "../components/layout/Navbar";

import {
  getNotifications,
  markNotificationRead,
} from "../services/api";

import "../styles/notifications.css";

function NotificationsPage() {

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications =
    async () => {

      try {

        const data =
          await getNotifications();

        console.log(
          "NOTIFICATIONS PAGE:",
          data
        );

        setNotifications(

          Array.isArray(data)
            ? data
            : data.results || []

        );

      } catch (error) {

        console.error(error);

        setNotifications([]);
      }
    };

  const handleMarkRead =
    async (id) => {

      try {

        await markNotificationRead(id);

        fetchNotifications();

      } catch (error) {

        console.error(error);

      }
    };

  return (
    <div>

      <Navbar />

      <section className="notifications-page">

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="notification-header">

          <h1>
            Notifications
          </h1>

          <div className="notification-stats">

            <span>
              Total:
              {" "}
              {notifications.length}
            </span>

            <span>
              Unread:
              {" "}
              {
                notifications.filter(
                  (n) => !n.is_read
                ).length
              }
            </span>

          </div>

        </div>

        {notifications.length === 0 ? (

          <p>
            No notifications available.
          </p>

        ) : (

          Array.isArray(notifications) &&
          notifications.map(
            (notification) => (

              <div
                key={notification.id}
                className={`notification-card ${
                  notification.is_read
                    ? "read"
                    : "unread"
                }`}
              >

                {/* =========================================
                    STATUS BADGE
                ========================================= */}
                <div className="notification-top">

                  <span
                    className={
                      notification.is_read
                        ? "read-badge"
                        : "unread-badge"
                    }
                  >

                    {notification.is_read
                      ? "Read"
                      : "New"}

                  </span>

                </div>

                {/* =========================================
                    CONTENT
                ========================================= */}
                <div className="notification-content">

                  <h3>
                    {notification.message}
                  </h3>

                 <p>
                    {formatDistanceToNow(
                        new Date(notification.created_at),
                        {
                        addSuffix: true,
                        }
                    )}
                 </p>

                </div>

                {/* =========================================
                    MARK READ BUTTON
                ========================================= */}
                {!notification.is_read && (

                  <button
                    className="mark-read-btn"
                    onClick={() =>
                      handleMarkRead(
                        notification.id
                      )
                    }
                  >
                    Mark Read
                  </button>

                )}

              </div>
            )
          )
        )}

      </section>

    </div>
  );
}

export default NotificationsPage;