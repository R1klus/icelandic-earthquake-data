import React, { useEffect, useState} from "react";
import {useSelector} from "react-redux";
import ReactMapGL, {Marker} from "react-map-gl"
import "./styles.scss"
import { MdReportProblem } from "react-icons/md"


const EarthquakeMap = () => {
    const earthquakes = useSelector(({earthquakes}) => earthquakes);

    useEffect(() => {
        console.log(earthquakes)
    }, [earthquakes])

    const [viewport, setViewport] = useState({
        latitude: 64.8085175,
        longitude: -18.806046007266094,
        zoom: 6,
    })

    const level1 = 0xfab30a;
    const level2 = 0xf57d17;
    const level3 = 0xfa340a;
    const calculateColorValue = (percentage) => {
        const percentColors = [
            { percentage: 0.0, color: level1 },
            { percentage: 0.25, color: level2 },
            { percentage: 0.5, color: level3 } ];

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
                mapStyle="mapbox://styles/mapbox/dark-v10"
                onMove={evt => setViewport(evt.viewState)}
            >
                {earthquakes.map(earthquake => (
                    <Marker key={earthquake.timestamp} longitude={earthquake.longitude} latitude={earthquake.latitude}>
                        <MdReportProblem className="bi-current-location" color={calculateColorValue(earthquake.size/10)}/>
                    </Marker>
                ))}
            </ReactMapGL>
        </div>

    )
}

export default EarthquakeMap