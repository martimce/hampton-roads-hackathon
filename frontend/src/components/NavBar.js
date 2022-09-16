import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import logo from "../images/logo.JPG";

const NavBar = ({ selectedSpecies, conservationStatus, nativeStatus }) => {
  const displayString = [];
  if (nativeStatus) {
    displayString.push(nativeStatus);
  }
  if (conservationStatus) {
    displayString.push(conservationStatus);
  }
  if (selectedSpecies) {
    displayString.push(selectedSpecies);
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
        <p style={{ fontSize: "1.5em", padding: "0 20px" }}>
          {displayString.length > 0
            ? displayString.join(" : ")
            : "Filter by species below"}
        </p>
      </div>
    </Navbar>
  );
};

export default NavBar;
