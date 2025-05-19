/* eslint-disable react/prop-types */
/*global google*/
import { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker,
} from "react-google-maps";
class Map extends Component {
  state = {
    directions: null,
  };

  componentDidMount() {
    const { alarmDetails, nearestPoliceStation } = this.props;
    const directionsService = new google.maps.DirectionsService();
    const origin = {
      lat: parseFloat(alarmDetails?.location?.latitude),
      lng: parseFloat(alarmDetails?.location?.longitude),
    };
    const destination = {
      lat: nearestPoliceStation?.geometry?.location?.lat(),
      lng: nearestPoliceStation?.geometry?.location?.lng(),
    };

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  render() {
    const { alarmDetails, nearestPoliceStation } = this.props;
    const targetMarkerIcon = {
      url: "/images/police.png", // Replace with your source marker icon URL
      scaledSize: new google.maps.Size(30, 30), // Set the size of the icon
    };
    const sourceMarkerIcon = {
      url: "/images/user.png", // Replace with your source marker icon URL
      scaledSize: new google.maps.Size(30, 30), // Set the size of the icon
    };
    const GoogleMapExample = withGoogleMap((props) => (
      <GoogleMap
        defaultCenter={{
          lat: parseFloat(alarmDetails?.location?.latitude),
          lng: parseFloat(alarmDetails?.location?.longitude),
        }}
        defaultZoom={13}
      >
        {/* source marker */}
        <Marker
          position={{
            lat: parseFloat(alarmDetails?.location?.latitude),
            lng: parseFloat(alarmDetails?.location?.longitude),
          }}
          icon={sourceMarkerIcon} // Apply the custom source marker icon
        />
        {/* target marker */}
        <Marker
          position={{
            lat: parseFloat(nearestPoliceStation?.geometry?.location?.lat()),
            lng: parseFloat(nearestPoliceStation?.geometry?.location?.lng()),
          }}
          icon={targetMarkerIcon} // Apply the custom source marker icon
        />
        <DirectionsRenderer
          options={{
            markerOptions: { icon: sourceMarkerIcon },
            suppressMarkers: true,
          }}
          directions={this.state.directions}
        />
      </GoogleMap>
    ));

    return (
      <div>
        <GoogleMapExample
          containerElement={<div className="w-full h-[58vh]" />}
          mapElement={<div style={{ height: `100%`, width: "100%", borderRadius: "10px" }} />}
        />
      </div>
    );
  }
}

export default Map;
