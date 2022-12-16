import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto";
import LightModeIcon from "@mui/icons-material/LightMode";
import StraightenIcon from "@mui/icons-material/Straighten";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { Button } from "@mui/material";
import Slider from "@mui/material/Slider";
import SendIcon from "@mui/icons-material/Send";

const DataSensors = () => {
  const userId = "oWcSC3ftqrbNQX1uWtEF8vAV0Q83";
  const db = getDatabase();
  const [on, seton] = useState(false);
  const [distance, setDistance] = useState(0);
  const [light, setLight] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [limitDistance, setLimitDistance] = useState(0);
  const [limitLight, setLimitLight] = useState(0);
  const [limitTemperature, setLimitTemperature] = useState(0);

  const onValueFunction = (ref, setState) => {
    onValue(ref, (snapshot) => {
      const data = snapshot.val();
      setState(data);
    });
  };

  useEffect(() => {
    const onRef = ref(db, "UsersData/" + userId + "/on");
    onValueFunction(onRef, seton);
  }, []);

  useEffect(() => {
    writeUserData(userId, "/on", on);
  }, [on]);

  useEffect(() => {
    const distanceRef = ref(
      db,
      "UsersData/" + userId + "/Sensors/Distance (Cm)"
    );
    onValueFunction(distanceRef, setDistance);

    const lightRef = ref(db, "UsersData/" + userId + "/Sensors/Ldr (Volts)");
    onValueFunction(lightRef, setLight);

    const temperatureRef = ref(
      db,
      "UsersData/" + userId + "/Sensors/Temperature (°C)"
    );
    onValueFunction(temperatureRef, setTemperature);
  }, [db]);

  function writeUserData(userId, path, data) {
    set(ref(db, "UsersData/" + userId + path), data);
  }

  const handleon = () => {
    seton(!on);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#282c34",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        align="center"
        sx={{ fontFamily: "monospace", fontWeight: "bold", marginTop: "20px" }}
      >
        ESP-32 FIREBASE DATABASE
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "20px",
          margin: "20px",
          width: "80%",
          maxWidth: "800px",
          border: "1px solid white",
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            margin: "10px 0",
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom align="center">
            <ThermostatAutoIcon sx={{ color: "white", margin: "0 10px" }} />
            Temperature : {temperature} °C
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", width: "50%" }}>
            <Slider
              defaultValue={3}
              aria-label="Limit"
              valueLabelDisplay="auto"
              getAriaValueText={(value) => setLimitTemperature(parseInt(value))}
              step={5}
              sx={{ color: "white", margin: "0 10px", width: "50%" }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                width: "50%",
              }}
              onClick={() =>
                writeUserData(userId, "/Limit Temp", limitTemperature)
              }
            >
              Limit
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            margin: "10px 0",
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom align="center">
            <LightModeIcon sx={{ color: "white", margin: "0 10px" }} />
            Light (LDR) : {light.toFixed(1)} Volts
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", width: "50%" }}>
            <Slider
              defaultValue={3}
              aria-label="Limit"
              valueLabelDisplay="auto"
              getAriaValueText={(value) => setLimitLight(parseInt(value))}
              step={1}
              min={0}
              max={5}
              sx={{ color: "white", margin: "0 10px", width: "50%" }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                width: "50%",
              }}
              onClick={() => writeUserData(userId, "/Limit Ldr", limitLight)}
            >
              Limit
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            margin: "10px 0",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            align="center"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <StraightenIcon sx={{ color: "white", margin: "0 10px" }} />
            Distance : {Math.round(distance)} Cm
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", width: "50%" }}>
            <Slider
              defaultValue={30}
              aria-label="Limit Distance"
              valueLabelDisplay="auto"
              getAriaValueText={(value) => setLimitDistance(parseInt(value))}
              step={5}
              sx={{ color: "white", margin: "0 10px", width: "50%" }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                width: "50%",
              }}
              onClick={() =>
                writeUserData(userId, "/Limit Distance", limitDistance)
              }
            >
              Limit
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            margin: "10px 0",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleon}
            color={on ? "primary" : "secondary"}
          >
            {on ? "ON" : "OFF"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DataSensors;
