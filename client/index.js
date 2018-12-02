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

import "./scripts/front";
import { asyncForEach } from "./scripts/utils";
import firebase from "./scripts/firebase";

const itemTemplate = require("./templates/partials/dynamic/top-locations-item.hbs");

function displayLocation(location, i) {
  const elem = itemTemplate(location);

  if (i == 0) {
    const parent = $("#top-items");
    parent.prepend($('<div class="col-lg-6"></div>').append(elem));
  } else if (i <= 4) {
    const parent = $("#first-row > div.row");
    parent.append($('<div class="col-md-6"></div>').append(elem));
  } else {
    const parent = $("#second-row");
    parent.append($('<div class="col-md-3"></div>').append(elem));
  }
}

function displayLocations(locations) {
  locations.forEach(displayLocation);
}

async function getPlaces(location) {
  return firebase
    .database()
    .ref(`/places/${location.slug}`)
    .once("value")
    .then(snapshot => snapshot.val() || [])
    .catch(error => {
      console.error(error);
    });
}

async function getLocations() {
  return firebase
    .database()
    .ref("/locations")
    .once("value")
    .then(snapshot => Object.entries(snapshot.val()) || {})
    .catch(error => {
      console.error(error);
    });
}

const disableLinkForEmptyLocations = async locations => {
  await asyncForEach(locations, async location => {
    const places = await getPlaces(location);
    if (places.length == 0) {
      $(`a[href*="location.html?name=${location.slug}"]`).prop("href", "#");
    }
  });
};

function addSlug([slug, location]) {
  Object.assign(location, { slug });
}

async function getAndRun() {
  const entries = await getLocations();
  entries.forEach(addSlug);
  const locations = entries.map(entry => entry[1]);
  displayLocations(locations);
  disableLinkForEmptyLocations(locations);
}

getAndRun();
