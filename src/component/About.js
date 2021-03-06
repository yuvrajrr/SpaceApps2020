import React from 'react';
import Layout from './Layout'
import Iframe from 'react-iframe'

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pic: [],
            start: {},
            location: {},
            currLoc: "Hamilton",
            input: "Enter Location...",
            rad_input: 0,
            radius: 0,
            atStart: true
        }
    }
    componentDidMount() {
        if ('geolocation' in navigator) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    location: position.coords,
                    currLoc: position.coords.latitude + ',' + position.coords.longitude,
                    start: position.coords
                    //currLoc : "toronto"
                })
            });
        }
        // console.log("Location " + this.state.location.latitude + " " + this.state.location.longitude);
        // console.log("CURRLOC" + this.state.currLoc);
    }

    location_input_style = () => {
        return {
            position: "Absolute",
            top: "40%",
            right: "50%",
            paddingBottom: "30px"

        }
    }
    rad_input_style = () => {
        return {
            position: "Absolute",
            top: "60%",
            right: "50%",
            paddingBottom: "30px"

        }
    }
    text_box_attrib = () => {
        return {
            autofocus: "false",
            resize: "none",
            width: "300px",
            height: "30px",
            margin: "5px"
        }
    }

    get_new_coords = async (new_address, obj) => {
        //console.log('IN CALL: ' + this.state.currLoc)
        const addy = new_address.split(' ').join('%20')
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addy}&key=AIzaSyAPHaPH5VuQOqpUdh_9Fd55cduWiybq4qs`)
            .then(response => response.json())
            .then(function (data) {

                let lat = data.results[0].geometry.location.lat;
                let lng = data.results[0].geometry.location.lng;
                obj.setState({ location: { latitude: lat, longitude: lng } })
            })
            .catch(err => {
                console.log(err)
            })
    }
    areas_style = () => {
        return {
            position: "absolute",
            left: "65%",
            bottom: "15%",
            width: "550px",
            height: "400px",
            overflowY: "scroll",
            display: "none"
        }
    }

    areas_click = (name, loc) => {
        this.setState({ currLoc: name + ", " + loc });
    }

    get_locations = async (obj, atStart) => {
        console.log('ATSTART: ' + atStart)
        if (!atStart)
            await this.get_new_coords(this.state.input, this)

        let keywords = "Space%20Agency|Astronomy|Space%20Station|NASA|SpaceX|CSA|Planetarium|Launch%20Site";
        let key = "AIzaSyAPHaPH5VuQOqpUdh_9Fd55cduWiybq4qs";
        let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + this.state.location.latitude + "," + this.state.location.longitude + "&radius=" + this.state.rad_input + "&keyword=" + keywords + "&key=" + key;
        let proxy = "https://cors-anywhere.herokuapp.com/";
        let data;
        let locations = [];

        console.log(url);

        await fetch(proxy + url).then(response => response.json()).then(output => { data = output.results });

        for (let index = 0; index < data.length; index++) {
            let latitude, longitude, name, address;
            latitude = data[index].geometry.location.lat;
            longitude = data[index].geometry.location.lng;
            name = data[index].name;
            address = data[index].vicinity;
            locations.push([latitude, longitude, name, address]);
        }

        console.log(locations);

        let areas = document.getElementById("areas");
        document.getElementById("placeList").style.display = "block"
        // If areas is null, don't modify the document
        if (areas === null) {
            console.log('AREAS IS NULL')
            return
        }


        areas.innerHTML = "";

        console.log('LOC LEN ' + locations.length)
        if (locations.length === 0) {
            console.log('reeeeee')
            let text = document.createElement("h3")
            text.textContent = "No Space Results found :("
            areas.appendChild(text);
        }

        for (let index = 0; index < locations.length; index++) {
            let element = document.createElement("li");
            console.log(locations[index][2]);
            element.textContent = locations[index][2] + ", " + locations[index][3];
            element.addEventListener("click", function () {
                obj.areas_click(locations[index][2], locations[index][3]);
            });
            element.addEventListener('mouseenter', () => {
                element.style.background = '#E7E7E7'
            })
            element.addEventListener('mouseleave', () => {
                element.style.background = ''
            })
            areas.appendChild(element);

        }

        console.log(areas.innerHTML)
    }

    render() {
        return (
            <div>

                <Layout>
                    <h2>Welcome to Space Nearby!</h2>
                    <p>This web application allows you to explore nearby space research and development centres, right in your backyard!</p>

                    <Iframe src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyAPHaPH5VuQOqpUdh_9Fd55cduWiybq4qs&q=${this.state.currLoc}`}
                        width="450px"
                        height="450px"
                        id="myId"
                        className="myClassname"
                        display="initial"
                        position="relative"
                        frameborder="0"
                        allowfullscreen>
                    </Iframe>


                </Layout>
                <div className="container" style={this.location_input_style()}>
                    <div>
                        <h3>Current Location:</h3>
                        <p>We think you're here: <b>{this.state.currLoc}</b></p>
                        <input type="text" onChange={(e) => this.setState({ input: e.target.value })} id="input-text" style={this.text_box_attrib()} placeholder={"Enter Location..."} />
                        {/* <input type="button" className="btn btn-outline-primary" value="Submit" onClick={function(){
                            this.setState({currLoc : this.state.input})
                            this.get_new_coords(this.state.input,this);
                            //new_lat, new_long
                            //this.setState({location : ...})
                            }.bind(this)}/> */}
                    </div>
                    <div>
                        <input type="button" className="btn btn-outline-success" value="Back to my Location" onClick={function () {
                            this.setState({ currLoc: `${this.state.start.latitude},${this.state.start.longitude}`, input: `${this.state.start.latitude},${this.state.start.longitude}`, atStart: true })
                            document.getElementById("input-text").value = "";
                            document.getElementById("areas").innerHTML = "";
                        }.bind(this)} />
                    </div>
                </div>
                <div className="container" style={this.rad_input_style()}>
                    <h3>Current Radius:</h3>
                    <p><b>{this.state.radius} meter(s)</b></p>
                    <input type="text" onChange={(e) => this.setState({ rad_input: e.target.value })} id="input-text" style={this.text_box_attrib()} placeholder={"Enter Radius..."} />
                    <div>
                        <input type="button" className="btn btn-outline-primary" value="Submit" onClick={function () {
                            console.log('CUR: ' + this.state.currLoc)
                            console.log('INP: ' + this.state.input)
                            if (this.state.rad_input <= 1 || isNaN(this.state.rad_input)) return;
                            // UPDATE DISPLAY ONLY IF NEW TEXT WAS ENTERED
                            if (this.state.input !== this.state.start && this.state.input !== "Enter Location...") {
                                this.setState({ currLoc: this.state.input, atStart: false });
                                console.log('updating display')
                                this.setState({ radius: Math.floor(this.state.rad_input) })
                                this.get_locations(this, false);
                            }
                            else {
                                this.setState({ input: this.state.start })
                                this.setState({ radius: Math.floor(this.state.rad_input) })
                                this.get_locations(this, true);
                            }


                        }.bind(this)} />
                    </div>
                </div>

                <div style={this.areas_style()} id='placeList'>
                    <nav>
                        <ul id="areas">

                        </ul>
                    </nav>
                </div>
            </div>

        )
    }
}


export default About