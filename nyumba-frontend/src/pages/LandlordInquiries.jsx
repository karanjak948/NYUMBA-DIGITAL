import {
  useEffect,
  useState,
} from "react";

import Navbar
from "../components/layout/Navbar";

import {
  getInquiries,
  replyInquiry,
} from "../services/api";

function LandlordInquiries() {

  const [inquiries,
         setInquiries] =
    useState([]);

  const [reply,
         setReply] =
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
          reply[id]
        );

        alert(
          "Reply sent"
        );

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

              <h3>
                {
                  inquiry.property_title
                }
              </h3>

              <p>
                <strong>
                  Tenant:
                </strong>

                {" "}

                {
                  inquiry.tenant_username
                }
              </p>

              <p>
                {
                  inquiry.message
                }
              </p>

              {inquiry.landlord_reply ? (

                <div>

                  <strong>
                    Reply:
                  </strong>

                  <p>
                    {
                      inquiry.landlord_reply
                    }
                  </p>

                </div>

              ) : (

                <>
                  <textarea
                    value={
                      reply[
                        inquiry.id
                      ] || ""
                    }
                    onChange={(e) =>
                      setReply({
                        ...reply,
                        [inquiry.id]:
                        e.target.value
                      })
                    }
                  />

                  <button
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

          )
        )}

      </div>

    </>
  );
}

export default LandlordInquiries;