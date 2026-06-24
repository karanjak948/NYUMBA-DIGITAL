import { useEffect, useState,} from "react";

import Navbar from "../components/layout/Navbar";

import { getInquiries, replyInquiry, deleteInquiry,} from "../services/api";;

import "../styles/landlord-inquiries.css";

function LandlordInquiries() {

  const [inquiries, setInquiries] =
    useState([]);

  const [replies, setReplies] =
    useState({});

  useEffect(() => {

    fetchInquiries();

  }, []);

  const fetchInquiries =
    async () => {

      try {

        const data =
          await getInquiries();

        setInquiries(data);

      } catch (error) {

        console.error(error);
      }
    };

  const handleReply =
    async (id) => {

      try {

        await replyInquiry(
          id,
          replies[id]
        );

        alert(
          "Reply sent"
        );

        fetchInquiries();

      } catch (error) {

        console.error(error);
      }
    };

    const handleDelete = async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this inquiry?"
        );

      if (!confirmDelete) return;

      try {

        await deleteInquiry(id);

        fetchInquiries();

      } catch (error) {

        console.error(error);

      }
    };

  return (

    <>
      <Navbar />

      <div className="container">

        <h1>
          Tenant Inquiries
        </h1>

        {inquiries.map(
          (inquiry) => (

            <div
              key={inquiry.id}
              className="inquiry-card"
            >

              <div className="inquiry-left">

                <div className="avatar">

                  {inquiry.tenant_username
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <h3 className="property-name">

                    {inquiry.property_title}

                  </h3>

                  <p className="location">

                    {inquiry.property_location}

                  </p>

                  <div className="message-box">

                    {inquiry.message}

                  </div>

                  <p className="message-time">

                    {new Date(
                      inquiry.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

              <div className="inquiry-right">

                <div>

                  <h4 className="tenant-name">

                    {inquiry.tenant_username}

                  </h4>

                </div>

                {inquiry.landlord_reply ? (

                  <>

                    <div className="status-replied">

                      REPLIED

                    </div>

                    <div className="reply-preview">

                      <strong>
                        Your Reply:
                      </strong>

                      <p>
                        {inquiry.landlord_reply}
                      </p>

                    </div>

                    <button
                      className="delete-inquiry-btn"
                      onClick={() =>
                        handleDelete(inquiry.id)
                      }
                    >
                      Delete Inquiry
                    </button>

                  </>

                ) : (

                  <>

                    <div className="status-pending">

                      PENDING

                    </div>

                    <div className="reply-box">

                      <textarea
                        value={
                          replies[inquiry.id] || ""
                        }
                        onChange={(e) =>
                          setReplies({
                            ...replies,
                            [inquiry.id]:
                              e.target.value,
                          })
                        }
                        placeholder="Type your reply..."
                      />

                    </div>

                    <button
                      className="reply-btn"
                      onClick={() =>
                        handleReply(
                          inquiry.id
                        )
                      }
                    >
                      Send Reply
                    </button>

                  </>

                )}

              </div>

            </div>

          )
        )}

      </div>

    </>
  );
}

export default LandlordInquiries;