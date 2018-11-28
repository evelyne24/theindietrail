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
  const place = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    .place;

  const itemTemplate = require("./templates/partials/dynamic/category-list-item.hbs");

  $.getJSON("./json/manchester.json")
    .done(function(json) {
      const jsonItems = json.items;
      $(".container h1").text(json.title);
      $(".container p.lead").text(json.description);

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
    })
    .fail(function(jqxhr, textStatus, error) {
      console.log(error);
    });

  // coordinates for the center of the map
  var lat = 40.732346;
  var long = -74.0014247;
  // json file path with the markers to display on the map
  var jsonFile = "./json/addresses/manchester.json";
  // if using with other than default style, change the path to the colour variant
  // of the marker. E.g. to img/map-marker-violet.png.
  var markerImage = "img/map-marker-default.png";

  $.getJSON(jsonFile)
    .done(function(json) {
      const map = createCategoryMap(lat, long, json, markerImage);
    })
    .fail(function(jqxhr, textStatus, error) {
      console.log(error);
    });
});
