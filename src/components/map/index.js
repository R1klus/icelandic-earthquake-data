import React, {useEffect, useState, useContext} from "react";
import {useSelector} from "react-redux";
import ReactMapGL, {Marker, Popup} from "react-map-gl"
import "./styles.scss"
import {MdReportProblem} from "react-icons/md"
import {themeContext} from "../../App";


const EarthquakeMap = () => {
    const lightMapTheme = "mapbox://styles/mapbox/light-v10"
    const darkMapTheme = "mapbox://styles/mapbox/dark-v10"

    const earthquakes = useSelector(({earthquakes}) => earthquakes);
    const [selectedEarthquake, setSelectedEarthquake] = useState(null);
    const [mapTheme, setMapTheme] = useState(lightMapTheme)
    const theme = useContext(themeContext);

    useEffect(() => {
        switch(theme.currentTheme){
            case "light":
                setMapTheme(lightMapTheme)
                break
            case "dark":
                setMapTheme(darkMapTheme)
                break
            default:
                return setMapTheme(lightMapTheme)
        }
    },[theme])

    const [viewport, setViewport] = useState({
        latitude: 64.8085175,
        longitude: -18.806046007266094,
        zoom: 5.4,
    })

    const calculateColorValue = (percentage) => {
        const percentColors = [
            {percentage: 0.0, color: {r: 0xFA, g: 0xB3, b: 0x0A}},
            {percentage: 0.25, color: {r: 0xF5, g: 0x7D, b: 17}},
            {percentage: 0.5, color: {r: 0xFA, g: 0x34, b: 0x0A}}];


        const getColorForPercentage = (percentage) => {
            for (var i = 1; i < percentColors.length - 1; i++) {
                if (percentage < percentColors[i].percentage) {
                    break;
                }
            }
            const lower = percentColors[i - 1];
            const upper = percentColors[i];
            const range = upper.percentage - lower.percentage;
            const rangePct = (percentage - lower.percentage) / range;
            const pctLower = 1 - rangePct;
            const pctUpper = rangePct;
            const color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
            // or output as hex if preferred
        }
        return getColorForPercentage(percentage);
    }

    return (
        <div className="map-container">

            <ReactMapGL
                {...viewport}
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
                mapStyle={mapTheme}
                onMove={evt => setViewport(evt.viewState)}
            >
                <div className="map-legend">
                    <h3>
                    Richter Scale
                    </h3>
                <div className="richter-scale">&nbsp;</div>
                    <div className="richter-data-labels"><span>0</span> <span>2</span> <span>4</span> <span>6</span> <span>8</span> <span>10</span></div>
                </div>
                {earthquakes.map((earthquake, index) => (
                    <Marker key={index} longitude={earthquake.longitude}
                            latitude={earthquake.latitude} onClick={e => {
                                e.originalEvent.stopPropagation();
                                setSelectedEarthquake(earthquake);
                    }}>

                        <MdReportProblem className="bi-current-location"
                                         color={calculateColorValue(earthquake.size / 10)}
                                         />

                    </Marker>
                ))}
                {selectedEarthquake ? (
                    <Popup
                        latitude={selectedEarthquake.latitude}
                        longitude={selectedEarthquake.longitude}
                        onClose={() => {
                            setSelectedEarthquake(null)
                        }}
                    >
                        <div>
                            <h1>Information</h1>
                            <div><b>Location:</b> {selectedEarthquake.humanReadableLocation}</div>
                            <div><b>Latitude:</b> {selectedEarthquake.latitude}</div>
                            <div><b>Longitude:</b> {selectedEarthquake.longitude}</div>
                            <div><b>Quality:</b> {selectedEarthquake.quality}</div>
                            <div><b>Richter:</b> {selectedEarthquake.size}</div>
                            <div><b>Time:</b> {selectedEarthquake.timestamp ? new Date(selectedEarthquake.timestamp).toString() : null}</div>
                        </div>

                    </Popup>
                ) : null || undefined}
            </ReactMapGL>
        </div>

    )
}

export default EarthquakeMap