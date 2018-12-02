"use strict";

import "babel-polyfill";

import "bootstrap/scss/bootstrap.scss";
import "owl.carousel2/dist/assets/owl.carousel.css";
import "owl.carousel2/dist/assets/owl.theme.default.css";
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
import createLocationMap from "./scripts/map-multi.js";
import firebase from "./scripts/firebase";

const placeTemplate = require("./templates/partials/dynamic/place-list-item.hbs");
const slug = qs.parse(window.location.search, { ignoreQueryPrefix: true }).name;
const markerImage = "img/map-marker-red.png";

function displayLocation({ name, description }) {
  $(".container h1").text(name);
  $(".container p.lead:first").text(description);
}

function displayPlace(place) {
  $("#items").append(placeTemplate(place));
}

function displayPlaces(location, places) {
  $("#places-count strong").text(places.length);
  places.forEach(displayPlace);
  const mapPlaces = places
    .filter(place => place.coordinates)
    .map((place, i) =>
      Object.assign(place, {
        _id: place.slug,
        index: i,
        isActive: true,
        icon: "http://placehold.it/32x32",
        logo: "http://placehold.it/32x32",
        link: `place.html?location=${location.slug}&name=${place.slug}`
      })
    );
  createLocationMap(
    location.coordinates.lat,
    location.coordinates.lng,
    mapPlaces,
    markerImage
  );
}

async function getPlaces(location) {
  return firebase
    .database()
    .ref(`/places/${location.slug}`)
    .once("value")
    .then(snapshot => {
      const places = snapshot.val() || [];
      for (let k in places) {
        if (places.hasOwnProperty(k)) places[k].slug = k;
      }
      return Object.values(places);
    })
    .catch(error => {
      console.error(error);
    });
}

async function getLocation(slug) {
  return firebase
    .database()
    .ref(`/locations/${slug}`)
    .once("value")
    .then(snapshot => Object.assign(snapshot.val(), { slug }))
    .catch(error => {
      console.error(error);
    });
}

async function getAndRun() {
  const location = await getLocation(slug);
  displayLocation(location);
  const places = await getPlaces(location);
  places.forEach(place => Object.assign(place, { location: slug }));
  displayPlaces(location, places);
}

getAndRun();
