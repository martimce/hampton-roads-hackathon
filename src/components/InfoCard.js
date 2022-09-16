import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const InfoCard = ({ speciesCode, speciesName, birdData }) => {
  const [selectedBirdData, setSelectedBirdData] = useState();

  useEffect(() => {
    if (birdData && speciesCode) {
      console.log("here", birdData, speciesCode);
      setSelectedBirdData(birdData[speciesCode]);
    }
  }, [speciesCode, selectedBirdData]);

  const convertToPercent = (val) => {
    return (val * 100).toFixed(2);
  };

  if (selectedBirdData) {
    return (
      <Card
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          background: "white",
          padding: 15,
          borderRadius: 5,
          border: "1px solid gray",
        }}
      >
        <Card.Img
          variant="top"
          style={{ maxHeight: 300, textAlign: "center" }}
          src={selectedBirdData["image_url"]}
        />
        <Card.Body>
          <Card.Title style={{ fontWeight: "bold", textAlign: "center" }}>
            {selectedBirdData["common_name"]}
          </Card.Title>
          <Card.Text style={{ fontSize: "0.8em" }}>
            Conservation Status: {selectedBirdData["cons_status"]}
            <br />
            Native Stataus: {selectedBirdData["native"]}
            <br />
            Quantity: {selectedBirdData["count_2020"]} (2020){" "}
            {selectedBirdData["count_2021"]} (2020)
            <br />
            Change: {convertToPercent(selectedBirdData["perc_diff"])}
            {"% "}
            {selectedBirdData["perc_diff"] > 0 ? (
              <span style={{ color: "green" }}>▲</span>
            ) : (
              <span style={{ color: "red" }}>▼</span>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default InfoCard;
