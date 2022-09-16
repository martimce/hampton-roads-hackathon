import React, { useEffect, useState } from "react";
import KeplerGl from "kepler.gl";
import { addDataToMap } from "kepler.gl/actions";
import data from "../data/bird_observations.csv";
import infoData from "../data/bird_data.csv";
import Papa from "papaparse";
import NavBar from "./NavBar";
import InfoCard from "./InfoCard";
import { useDispatch } from "react-redux";

function Map() {
  const [activeData, setActiveData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [filtered, setFiltered] = useState(false);
  const [allSpecies, setAllSpecies] = useState([]);
  const [allConservation, setAllConservation] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState();
  const [conservationStatus, setConservationStatus] = useState();
  const [selectedCommonName, setSelectedCommonName] = useState();
  const [birdData, setBirdData] = useState();
  const dispatch = useDispatch();

  const fetchData = async () => {
    fetch(data)
      .then((res) =>
        res.text().then((res) => buildDataObject(Papa.parse(res).data))
      )
      .catch((err) => console.log("err", err));
  };

  const fetchInfoData = async () => {
    fetch(infoData)
      .then((res) =>
        res.text().then((res) => buildBirdData(Papa.parse(res).data))
      )
      .catch((err) => console.log("err", err));
  };

  const filterData = (field, value) => {
    const matchingSet = new Set();
    for (let key of Object.keys(birdData)) {
      if (birdData[key][field] === value) {
        matchingSet.add(key);
      }
    }
    const dataToFilter = filtered ? filteredData : activeData;
    const filteredDataRows = dataToFilter.rows.filter((row) =>
      matchingSet.has(row[3])
    );
    const furtherFilteredData = {
      fields: dataToFilter.fields,
      rows: filteredDataRows,
    };

    setFiltered(true);
    setFilteredData(furtherFilteredData);
  };

  const selectSpecies = (e) => {
    const species = e.target.value;
    const speciesCode = species.split("#")[0];
    const speciesName = species.split("#")[1];
    setSelectedSpecies(speciesCode);
    setSelectedCommonName(speciesName);
    filterData("species_code", speciesCode);
  };

  const selectConservation = (e) => {
    const consStatus = e.target.value;
    setConservationStatus(consStatus);
    filterData("cons_status", consStatus);
  };

  const selectNative = (e) => {
    const native = e.target.value === "native";
  };

  const getSpeciesList = (data) => {
    const speciesSet = new Set();
    const speciesList = [];
    const speciesIdx = 3;

    for (let row of data) {
      if (row[speciesIdx]) {
        if (!birdData[row[speciesIdx]]) continue;
        const speciesInfo = `${row[speciesIdx]}#${
          birdData[row[speciesIdx]]["common_name"]
        }`;
        if (!speciesSet.has(speciesInfo)) {
          speciesSet.add(speciesInfo);
          speciesList.push(speciesInfo);
        }
      }
    }

    setAllSpecies(speciesList);
  };

  const getConservationList = (data) => {
    const conservationSet = new Set();
    const conservationList = [];
    const conservationIdx = 3;

    for (let row of data) {
      if (row[conservationIdx]) {
        if (!birdData[row[conservationIdx]]) continue;
        const conservationInfo = birdData[row[conservationIdx]]["cons_status"];
        if (!conservationSet.has(conservationInfo)) {
          conservationSet.add(conservationInfo);
          conservationList.push(conservationInfo);
        }
      }
    }

    setAllConservation(conservationList);
  };

  const buildBirdData = (data) => {
    const cols = data[0];
    const birdDataObject = {};

    for (let row of data.slice(1)) {
      if (row) {
        const speciesCode = row[3];
        const localObj = {};
        for (let i = 0; i < cols.length; i++) {
          localObj[cols[i]] = row[i];
        }
        birdDataObject[speciesCode] = localObj;
      }
    }
    setBirdData(birdDataObject);
  };

  const buildDataObject = (data) => {
    const fields = [
      { name: "latitude", format: "", type: "real" },
      { name: "longitude", format: "", type: "real" },
      { name: "observation_date", format: "YYYY-M-D H:m:s", type: "timestamp" },
      { name: "species_code", format: "" },
      { name: "count", format: "real" },
    ];
    const rows = [];

    for (let row of data.slice(1)) {
      const lat = row[0];
      const lon = row[1];
      const day = row[5];
      const month = row[4];
      const year = row[3];
      const speciesCode = row[2];
      const count = row[6];
      if (!lat || !lon || !day || !month || !year || !count || !speciesCode) {
        continue;
      }

      const dateTime = `${year}-${month.length === 1 ? "0" + month : month}-${
        day.length === 1 ? "0" + day : day
      } 00:00:00`;

      rows.push([
        parseFloat(lat),
        parseFloat(lon),
        dateTime,
        speciesCode,
        parseInt(count),
      ]);
    }

    const dataObject = {
      fields,
      rows,
    };

    setActiveData(dataObject);
  };

  useEffect(() => {
    fetchData();
    fetchInfoData();
  }, []);

  useEffect(() => {
    if (activeData && birdData) {
      if (filtered) {
        getSpeciesList(filteredData.rows);
        getConservationList(filteredData.rows);
        dispatch(
          addDataToMap({
            datasets: {
              info: {
                label: "Hampton Roads Birds Data",
                id: "test_inat_data",
              },
              data: filteredData,
            },
            option: {
              readOnly: true,
            },
            config: {
              mapStyle: {
                styleType: "light",
              },
            },
          })
        );
      } else {
        getSpeciesList(activeData.rows);
        getConservationList(activeData.rows);
        dispatch(
          addDataToMap({
            datasets: {
              info: {
                label: "Hampton Roads Bird Data",
                id: "test_inat_data",
              },
              data: activeData,
            },
            option: {
              centerMap: true,
              readOnly: true,
            },
            config: {
              mapStyle: {
                styleType: "light",
              },
            },
          })
        );
      }
    }
  }, [dispatch, filtered, activeData, filteredData]);

  return (
    <div style={{ position: "relative" }}>
      <NavBar
        selectedSpecies={selectedCommonName}
        conservationStatus={conservationStatus}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <KeplerGl
          id="map"
          width={window.innerWidth}
          mapboxApiAccessToken="pk.eyJ1IjoibWFydGltYyIsImEiOiJjbDd5MzY5NHowd2IzM3psZXo1aDRpODhjIn0.Qavba6nX0FDvqI5KYjyy5w"
          height={window.innerHeight - 200}
        />
        <div style={{ margin: "2em" }}>
          <p>Native Status</p>
          <select onChange={selectNative}>
            <option value="none" selected={!filtered ? true : false} disabled>
              Select an Option
            </option>
            <option key="native" value="data">
              Native
            </option>
            <option key="nonnative" value="data">
              Non-Native
            </option>
          </select>
          <p>Conservation Status</p>
          <select onChange={selectConservation}>
            <option value="none" selected={!filtered ? true : false} disabled>
              Select an Option
            </option>
            {allConservation.map((cons) => (
              <option
                key={cons}
                value={cons}
                selected={conservationStatus === cons ? true : false}
              >
                {cons}
              </option>
            ))}
          </select>
          <p>Common Name</p>
          <select onChange={selectSpecies}>
            <option value="none" selected={!filtered ? true : false}>
              Select an Option
            </option>
            {allSpecies.map((spec) => (
              <option
                key={spec.split("#")[0]}
                selected={
                  selectedCommonName === spec.split("#")[1] ? true : false
                }
                value={spec}
              >
                {spec.split("#")[1]}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button
            onClick={() => {
              setFiltered(false);
              setSelectedCommonName();
              setSelectedSpecies();
            }}
          >
            Reset
          </button>
        </div>
      </div>
      {selectedSpecies ? (
        <InfoCard
          speciesCode={selectedSpecies}
          speciesName={selectedCommonName}
          birdData={birdData}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Map;
