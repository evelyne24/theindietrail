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
import createCategoryMap from "./scripts/map-multi.js";

$(function() {
  const place = qs
    .parse(window.location.search, { ignoreQueryPrefix: true })
    .name.replace(/\s/g, "");

  const itemTemplate = require("./templates/partials/dynamic/place-list-item.hbs");

  $.getJSON(`./json/${place}.json`)
    .done(json => {
      const jsonItems = json.items;
      $(".container h1").text(json.title);
      $(".container p.lead:first").text(json.description);
      $("#places-count strong").text(jsonItems.length);

      jsonItems.forEach((jsonItem, i) => {
        const item = itemTemplate({
          badge: jsonItem.badge,
          name: jsonItem.name,
          address: jsonItem.address,
          description: jsonItem.description,
          photo: jsonItem.photo
        });
        $("#items").append(item);
      });

      var lat = json.coordinates.lat;
      var lng = json.coordinates.lng;
      var jsonFile = `./json/addresses/${place}.json`;
      loadMapMarkers(lat, lng, jsonFile);
    })
    .fail((j, s, error) => {
      console.log(error);
    });
});

function loadMapMarkers(lat, lng, jsonFile) {
  var markerImage = "img/map-marker-red.png";

  $.getJSON(jsonFile)
    .done(json => {
      createCategoryMap(lat, lng, json, markerImage);
    })
    .fail((j, s, error) => {
      console.log(error);
    });
}
