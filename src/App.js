import React, { Component } from "react";
import {
  InputGroup,
  InputGroupButtonDropdown,
  Input,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap";
import "./App.css";

const getDate = date => {
  const h = (date.getHours() < 10 ? "0" : "") + date.getHours();
  let d;
  if (h <= "08") {
    d = date.getDate() - 1;
  } else {
    d = date.getDate();
  }

  const day = d < 10 ? "0" + d : "" + d;

  const m = date.getMonth() + 1;
  const month = m < 10 ? "0" + m : "" + m;

  const year = date.getFullYear();

  const newDate = `${day}-${month}-${year}`;
  return newDate;
};
const newTime = time => {
  const h = (time.getHours() < 10 ? "0" : "") + time.getHours();
  const m = (time.getMinutes() < 10 ? "0" : "") + time.getMinutes();
  const newtime = h + ":" + m;
  return newtime;
};
const date = getDate(new Date());
const timeNow = newTime(new Date());
const allAreas = {
  ath: "Αττική",
  ag: "Αγρινίου",
  al: "Αλεξανδρούπολης",
  art: "Άρτας",
  be: "Βέροιας",
  b: "Βόλος",
  gian: "Γιαννιτσών",
  gre: "Γρεβενών",
  gyt: "Γύθειο",
  dra: "Δράμας",
  ede: "Έδεσσας",
  zak: "Ζακύνθου",
  h: "Ηράκλειο Κρήτης",
  t: "Θεσσαλονίκης",
  ioa: "Ιωαννίνων",
  kab: "Καβάλας",
  kal: "Καλαμάτας",
  k: "Καρδίτσας",
  kas: "Καστοριάς",
  kat: "Κατερίνης",
  ke: "Κέρκυρας",
  kil: "Κιλκίς",
  koz: "Κοζάνης",
  ko: "Κομοτηνής",
  kor: "Κορίνθου",
  cyp: "Κύπρου",
  kos: "Κως",
  L: "Λαμίας",
  La: "Λάρισας",
  leuk: "Λευκάδας",
  liv: "Λιβαδειάς",
  myt: "Μυτιλήνης",
  n: "Ναυπάκτου",
  xan: "Ξάνθης",
  p: "Πάτρας",
  pyrg: "Πύργου Ηλείας",
  ret: "Ρεθύμνου",
  r: "Ρόδου",
  samos: "Σάμου",
  ser: "Σερρών",
  spa: "Σπάρτης",
  trik: "Τρικάλων",
  tr: "Τρίπολης",
  flo: "Φλώρινας",
  xal: "Χαλκίδας",
  xalk: "Χαλκιδικής",
  x: "Χανίων",
  xios: "Χίος"
};

class App extends Component {
  state = {
    data: [],
    cities: allAreas,
    date: date,
    time: timeNow,
    value: "",
    area: "Αττική",
    select: "",
    splitButtonOpen: false,
    dropdownOpen: false
  };
  async componentDidMount() {
    const proxyUrl = "https://morning-dawn-46551.herokuapp.com/",
      targetUrl = `https://fastinfo.gr/widget/farmakeia/json/${
        this.state.date
      }.json`;
    const response = await fetch(proxyUrl + targetUrl);
    const json = await response.json();
    this.setState({ data: json });
  }
  async getFarmacies(e, cityName) {
    // console.log(cityName);
    if (e === "ath") {
      this.setState({ area: "Αττική" });
      e = "";
    } else {
      this.setState({ area: cityName });
    }

    const proxyUrl = "https://morning-dawn-46551.herokuapp.com/",
      targetUrl =
        "https://fastinfo.gr/widget/farmakeia/json/" +
        this.state.date +
        e +
        ".json";
    const response = await fetch(proxyUrl + targetUrl);
    const json = await response.json();
    this.setState({ data: json, select: "" });
  }
  selectedArea = e => {
    if (e === "Όλες οι Περιοχές") {
      this.setState({ select: "" });
    } else {
      this.setState({ select: e.target.value });
    }
  };
  toggleSplit = () => {
    this.setState({
      splitButtonOpen: !this.state.splitButtonOpen
    });
  };
  onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  render() {
    const array = this.state.data.map(arr => arr.perioxi);
    const unique = array.filter(this.onlyUnique);
    const areas = unique.map((area, i) => {
      return <option key={i}>{area}</option>;
    });
    const showCities = Object.keys(this.state.cities).map((city, i) => {
      return (
        <DropdownItem
          key={i}
          value={city}
          onClick={e => this.getFarmacies(e.target.value, allAreas[city])}
        >
          {allAreas[city]}
        </DropdownItem>
      );
    });
    const cards = this.state.data
      .filter(item => {
        return item.perioxi.indexOf(this.state.select) >= 0;
      })
      .map((card, i) => {
        return (
          <Card key={i} style={{ margin: 3, padding: 1, width: 400 }}>
            <CardBody>
              <CardTitle>{card.onoma}</CardTitle>
              <CardSubtitle>
                {card.odos1}, {card.perioxi} , {card.thlefono}
              </CardSubtitle>
              <CardText>
                {card.anoixta1} {card.anoixta2}
              </CardText>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={`https://google.com//maps/place/${card.lat}+${
                  card.lon
                }/@${card.lat},${card.lon},18z`}
              >
                <Button color="info">Map</Button>
              </a>
            </CardBody>
          </Card>
        );
      });

    return (
      <div className="App">
        <br />
        <InputGroup style={{ width: "60%", marginLeft: "20%" }}>
          <InputGroupButtonDropdown
            addonType="prepend"
            isOpen={this.state.splitButtonOpen}
            toggle={this.toggleSplit}
          >
            <Button outline>{this.state.area}</Button>
            <DropdownToggle split outline />

            <DropdownMenu>{showCities}</DropdownMenu>
          </InputGroupButtonDropdown>
          <Input
            type="select"
            onChange={this.selectedArea}
            value={this.state.select}
          >
            <option value="">Όλες οι Περιοχές</option>
            {areas}
          </Input>
        </InputGroup>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {cards}
        </div>
      </div>
    );
  }
}

export default App;
