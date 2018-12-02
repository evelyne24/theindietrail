"use strict";

import "babel-polyfill";

import "bootstrap/scss/bootstrap.scss";
import "owl.carousel2/dist/assets/owl.carousel.css";
import "owl.carousel2/dist/assets/owl.theme.default.css";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "./styles/style.red.scss";
import "./styles/custom.scss";

import "./styles/custom-fonticons.css";
import "bootstrap-select/dist/css/bootstrap-select.css";

import $ from "jquery";
import "bootstrap";
import "owl.carousel2";
import "@fancyapps/fancybox";
import "@fancyapps/fancybox/dist/jquery.fancybox";
import "jquery.cookie";
import "bootstrap-select";
import "popper.js";
import qs from "qs";

import "./scripts/front";
import createDetailMap from "./scripts/map.js";
import firebase from "./scripts/firebase";

const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
const location = params.location;
const slug = params.name;

const openingHoursTemplate = require("./templates/partials/dynamic/place-opening-hours.hbs");
const markerImage = "img/map-marker-red.png";

async function getPlace(location, slug) {
  return firebase
    .database()
    .ref(`/places/${location}/${slug}`)
    .once("value")
    .then(snapshot => snapshot.val() || {})
    .catch(error => {
      console.error(error);
    });
}

function displayContact(json, field) {
  const elem = $(`#${field}`);
  const value = `${json[field]}`;
  if (json[field]) {
    elem.append(value);
    if (field == "email") {
      elem.prop("href", `mailto:${value}`);
    } else if (field == "phone") {
      elem.prop("href", `tel:${value}`);
    } else {
      elem.prop("href", value);
    }
  } else {
    elem.hide();
  }
}

function displayPlace(place) {
  $("section.hero").css("background", `url('${place.photo}')`);
  $("#badge").text(place.badge);
  $("#name").text(place.name);
  $("#address").text(place.address);
  $("#description").text(place.description);
  if (place.opening_hours) {
    place.opening_hours.forEach(data => {
      $("div.days").append(
        openingHoursTemplate({
          day: data.day,
          time: data.slots[0]
        })
      );
    });
  }
  displayContact(place, "phone");
  displayContact(place, "website");
  displayContact(place, "email");
  displayContact(place, "facebook");
  displayContact(place, "twitter");
  displayContact(place, "instagram");
  if (place.coordinates) {
    createDetailMap(place.coordinates.lat, place.coordinates.lng, markerImage);
  }
}

async function getAndRun() {
  const place = await getPlace(location, slug);
  displayPlace(place);
}

getAndRun();