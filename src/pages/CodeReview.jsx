import React from "react";
import { styled } from "styled-components";
import { Link } from "react-router-dom";

function CodeReview() {
  return (
    <div>
      <UploadCode>
        I don't have any idea what to do here. So plz click{" "}
        <Link to="/user/uploadcode">Here</Link>{" "}
      </UploadCode>
    </div>
  );
}

export default CodeReview;

const UploadCode = styled.div``;
