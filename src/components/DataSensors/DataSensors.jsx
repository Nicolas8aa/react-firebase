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
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Brightness5OutlinedIcon from "@mui/icons-material/Brightness5Outlined";
import CrisisAlertSharpIcon from "@mui/icons-material/CrisisAlertSharp";
import WifiIcon from "@mui/icons-material/Wifi";
import { useSelector } from "react-redux";

const DataSensors = () => {
  const { uid } = useSelector((state) => state.login);
  const userId = uid;
  const db = getDatabase();
  const [on, seton] = useState(false);
  const [distance, setDistance] = useState(0);
  const [light, setLight] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [limitDistance, setLimitDistance] = useState(0);
  const [limitLight, setLimitLight] = useState(0);
  const [limitTemperature, setLimitTemperature] = useState(0);
  const [limitDistanceFB, setLimitDistanceFB] = useState(0);
  const [limitLightFB, setLimitLightFB] = useState(0);
  const [limitTemperatureFB, setLimitTemperatureFB] = useState(0);

  const onValueFunction = (ref, setState) => {
    onValue(ref, (snapshot) => {
      const data = snapshot.val();
      setState(data);
    });
  };

  const path = "UsersData/" + userId;

  useEffect(() => {
    const onRef = ref(db, path + "/on");
    onValueFunction(onRef, seton);
  }, [path]);

  useEffect(() => {
    writeUserData(userId, "/on", on);
  }, [on]);

  useEffect(() => {
    const distanceRef = ref(db, path + "/Sensors/Distance (Cm)");
    onValueFunction(distanceRef, setDistance);

    const limitDistanceFbRef = ref(db, path + "/Limit Distance");
    onValueFunction(limitDistanceFbRef, setLimitDistanceFB);

    const lightRef = ref(db, path + "/Sensors/Ldr (Volts)");
    onValueFunction(lightRef, setLight);

    const limitLigthFbRef = ref(db, path + "/Limit Ldr");
    onValueFunction(limitLigthFbRef, setLimitLightFB);

    const temperatureRef = ref(db, path + "/Sensors/Temperature (°C)");
    onValueFunction(temperatureRef, setTemperature);

    const limitTempFbRef = ref(db, path + "/Limit Temp");
    onValueFunction(limitTempFbRef, setLimitTemperatureFB);
  }, [db, path]);

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
          margin: "20px 0",
          width: "85%",
          maxWidth: "800px",
          border: "1px solid white",
          borderRadius: "10px",
          "& h2": {
            width: "50%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            margin: "10px 0",
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom align="start">
            <ThermostatAutoIcon sx={{ color: "white", margin: "0 10px" }} />
            Temperature : {temperature} °C
          </Typography>
          {temperature > limitTemperatureFB && (
            <CrisisAlertSharpIcon sx={{ width: "5%" }} />
          )}
          <Box sx={{ display: "flex", flexDirection: "row", width: "45%" }}>
            <Slider
              defaultValue={3}
              aria-label="Limit"
              valueLabelDisplay="auto"
              getAriaValueText={(value) => setLimitTemperature(parseInt(value))}
              step={5}
              sx={{ color: "white", margin: "0 10px", width: "60%" }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                width: "40%",
              }}
              onClick={() =>
                writeUserData(userId, "/Limit Temp", limitTemperature)
              }
            >
              Lim {limitTemperatureFB}
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
          <Typography variant="h5" component="h2" gutterBottom align="start">
            <LightModeIcon sx={{ color: "white", margin: "0 10px" }} />
            Light (LDR) : {light.toFixed(1)} Volts
          </Typography>
          {light > limitLightFB ? (
            <Brightness5OutlinedIcon sx={{ width: "5%" }} />
          ) : (
            <DarkModeOutlinedIcon sx={{ width: "5%" }} />
          )}
          <Box sx={{ display: "flex", flexDirection: "row", width: "45%" }}>
            <Slider
              defaultValue={3}
              aria-label="Limit"
              valueLabelDisplay="auto"
              getAriaValueText={(value) => setLimitLight(parseFloat(value))}
              step={0.1}
              min={0}
              max={5}
              sx={{ color: "white", margin: "0 10px", width: "60%" }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                width: "40%",
              }}
              onClick={() => writeUserData(userId, "/Limit Ldr", limitLight)}
            >
              Lim {limitLightFB}
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
          <Typography variant="h5" component="h2" gutterBottom align="start">
            <StraightenIcon sx={{ color: "white", margin: "0 10px" }} />
            Distance : {Math.round(distance)} Cm
          </Typography>
          {distance < limitDistanceFB && (
            <NotificationsActiveOutlinedIcon sx={{ width: "5%" }} />
          )}
          <Box sx={{ display: "flex", flexDirection: "row", width: "45%" }}>
            <Slider
              defaultValue={30}
              aria-label="Limit Distance"
              valueLabelDisplay="auto"
              getAriaValueText={(value) => setLimitDistance(parseInt(value))}
              step={5}
              sx={{ color: "white", margin: "0 10px", width: "60%" }}
            />

            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                width: "40%",
              }}
              onClick={() =>
                writeUserData(userId, "/Limit Distance", limitDistance)
              }
            >
              lim {limitDistanceFB}
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            margin: "10px 0",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom align="start">
            <WifiIcon
              sx={{
                color: on ? "green" : "red",
                margin: "0 10px",
                transition: "color 0.2s ease-in-out",
              }}
            />
            Toggle ESP32 sensors data
          </Typography>

          <Button
            variant="contained"
            onClick={handleon}
            color={on ? "secondary" : "primary"}
          >
            {on ? "OFF" : "ON"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DataSensors;
