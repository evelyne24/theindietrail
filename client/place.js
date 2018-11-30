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

$(function() {
  const place = qs
    .parse(window.location.search, { ignoreQueryPrefix: true })
    .name.replace(/\s/g, "");

  const openingHoursTemplate = require("./templates/partials/dynamic/place-opening-hours.hbs");

  $.getJSON(`./json/places/${place}.json`)
    .done(json => {
      $("section.hero").css("background", `url('${json.photo}')`);
      $("#badge").text(json.badge);
      $("#name").text(json.name);
      $("#address").text(json.address);
      $("#description").text(json.description);
      if (json.opening_hours) {
        json.opening_hours.forEach(data => {
          $("div.days").append(
            openingHoursTemplate({
              day: data.day,
              time: data.slots[0]
            })
          );
        });
      }
      setContact(json, "phone");
      setContact(json, "website");
      setContact(json, "email");
      setContact(json, "facebook");
      setContact(json, "twitter");
      setContact(json, "instagram");

      var lat = json.coordinates.lat;
      var lng = json.coordinates.lng;
      const markerImage = "img/map-marker-red.png";
      createDetailMap(lat, lng, markerImage);
    })
    .fail((j, s, error) => {
      console.log(error);
    });
});

function setContact(json, field) {
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
