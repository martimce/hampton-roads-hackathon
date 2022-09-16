import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import logo from "../images/logo.JPG";

const NavBar = ({ selectedSpecies, conservationStatus, nativeStatus }) => {
  const displayString = [];
  if (nativeStatus) {
    displayString.push(
      <div
        style={{
          padding: 15,
          background: "brown",
          color: "white",
          borderRadius: 15,
        }}
      >
        {nativeStatus}
      </div>
    );
  }
  if (conservationStatus) {
    displayString.push(
      <div
        style={{
          padding: 15,
          background: "green",
          color: "white",
          borderRadius: 15,
        }}
      >
        {conservationStatus}
      </div>
    );
  }
  if (selectedSpecies) {
    displayString.push(
      <div
        style={{
          padding: 15,
          background: "orange",
          color: "white",
          borderRadius: 15,
        }}
      >
        {selectedSpecies}
      </div>
    );
  }
  return (
    <Navbar bg="light" expand="lg" style={{ display: "flex", maxHeight: 100 }}>
      <Navbar.Brand>
        <img
          src={logo}
          style={{
            width: 100,
            height: 100,
          }}
        />
      </Navbar.Brand>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 15px",
          width: "100%",
        }}
      >
        <p style={{ fontSize: "2em" }}>Hampton Roads Datathon 2022</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: "1.5em",
          }}
        >
          {displayString.map((el) => (
            <div style={{ fontSize: "0.8em", margin: "0 5px" }}>{el}</div>
          ))}
        </div>
      </div>
    </Navbar>
  );
};

export default NavBar;
