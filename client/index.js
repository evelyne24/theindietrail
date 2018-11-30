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
import "./scripts/front";
import "popper.js";

$(function() {
  const itemTemplate = require("./templates/partials/dynamic/top-locations-item.hbs");
  $.getJSON("./json/top-cities.json")
    .done(json => {
      json.forEach((jsonElem, i) => {
        const elem = itemTemplate(jsonElem);

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

        const name = jsonElem.name;
        const file = name.replace(/\s/g, "");
        $.getJSON(`./json/${file}.json`).fail((p1, p2, err) => {
          $(`a[href*="location.html?name=${name}"]`).prop("href", "#");
        });
      });
    })
    .fail((p1, p2, error) => {
      console.error(error);
    });
});
