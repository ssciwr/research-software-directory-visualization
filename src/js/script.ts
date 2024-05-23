// @ts-nocheck

import { List, SVG } from "@svgdotjs/svg.js"; // eslint-disable-line
import "@svgdotjs/svg.filter.js"; // eslint-disable-line
import * as Utils from "./utils";

const json_data_url =
  "https://raw.githubusercontent.com/ssciwr/research-software-directory/main/generated/data.json";

let sorted_group_indices = [];

const method_anim_ms = 1000;
const num_outer_rings = 2;

// this state can be modified by the user
let sort_by_group = false;

const updateSegments = function () {
  for (const group_card of SVG("#iwr-vis-menu-svg").find(
    ".iwr-vis-group-card",
  )) {
    group_card.css({ opacity: "0", visibility: "hidden" });
  }
  for (const group_item of SVG("#iwr-vis-menu-svg").find(
    ".iwr-vis-group-item",
  )) {
    group_item.show();
  }
  const segments = SVG("#iwr-vis-menu-svg").find(".iwr-vis-segment-item");
  for (const segment of segments) {
    if (segment.hasClass("selected")) {
      segment.css({ opacity: "1", filter: "grayscale(0)" });
      segment.findOne(".iwr-vis-segment-item-text").attr("fill", "#ffffff");
      segment
        .findOne(".iwr-vis-segment-item-arc")
        .attr("stroke-width", Utils.sx / 800);
    } else if (segment.hasClass("hovered")) {
      segment.css({ opacity: "1", filter: "grayscale(0)" });
      segment.findOne(".iwr-vis-segment-item-arc").attr("stroke-width", 0);
      segment.findOne(".iwr-vis-segment-item-text").attr("fill", "#000000");
    } else {
      segment.css({
        filter: "grayscale(80%)",
        opacity: "20%",
      });
      segment.findOne(".iwr-vis-segment-item-arc").attr("stroke-width", 0);
      segment.findOne(".iwr-vis-segment-item-text").attr("fill", "#000000");
    }
  }
};

function updateGroups(
  groups: List<Element>,
  show_all = false,
  zoom = 1,
  cx = Utils.cx,
  cy = Utils.cy,
) {
  updateSegments();
  const items = SVG("#iwr-vis-menu-svg").find(".iwr-vis-group-item");
  if (groups != null) {
    console.assert(items.length === groups.length, items, groups);
  }
  let groupBoxIndex = { x: 0, y: 0 };
  let nGroups = 0;
  if (groups == null || show_all === true) {
    nGroups = items.length;
  } else {
    for (let k = 0; k < items.length; k++) {
      if (groups[k] != 0) {
        ++nGroups;
      }
    }
  }
  let ncols = 2;
  let scaleFactor = 0.43 * zoom;
  if (nGroups > 12) {
    ncols = 3;
  }
  let nrows = Math.floor((nGroups + (ncols - 1)) / ncols);
  if (nGroups > 21) {
    ncols = 4;
    groupBoxIndex.x = 1;
    nrows = Math.floor((nGroups + 10 + (ncols - 1)) / ncols);
    scaleFactor = (4.3 / nrows) * zoom;
  }
  // todo: add 5 cols layout
  const width = Utils.sx * 0.5 * scaleFactor;
  const height = Utils.sy * 0.15 * scaleFactor;
  const x0 = cx - (width * ncols) / 2;
  const y0 = cy - (height * nrows) / 2;
  for (let i0 = 0; i0 < items.length; i0++) {
    let i = i0;
    if (sort_by_group) {
      i = sorted_group_indices[i0];
    }
    if (groups != null && show_all === false && groups[i] === 0) {
      items[i].css({ opacity: 0, visibility: "hidden" });
    } else {
      let opac = 1;
      if (groups != null) {
        opac = groups[i] + 0.2;
      }
      const padding = 0.8;
      items[i].animate(method_anim_ms, 0, "now").transform({
        scaleX: (width - padding) / items[i].width(),
        scaleY: (height - padding) / items[i].height(),
        positionX: x0 + width * (groupBoxIndex.x + 0.5),
        positionY: y0 + height * (groupBoxIndex.y + 0.5),
      });
      items[i].css({ opacity: opac, visibility: "visible" });
      groupBoxIndex = Utils.nextGroupBoxIndex(groupBoxIndex, ncols, nrows);
    }
  }
}

const resetAll = function () {
  SVG("#iwr-vis-menu-svg")
    .find(".iwr-vis-segment-item")
    .addClass("hovered")
    .removeClass("selected");
  updateGroups(null);
};

const selectSegment = function () {
  const segments = SVG("#iwr-vis-menu-svg").find(".iwr-vis-segment-item");
  const nSelected = segments.hasClass("selected").filter(Boolean).length;
  if (this.hasClass("selected") && nSelected === 1) {
    resetAll();
  } else {
    segments.removeClass("hovered");
    segments.removeClass("selected");
    this.addClass("selected");
    updateGroups(this.data("groups"));
  }
};

const hoverSegment = function () {
  const segments = SVG("#iwr-vis-menu-svg").find(".iwr-vis-segment-item");
  const nSelected = segments.hasClass("selected").filter(Boolean).length;
  if (nSelected != 1) {
    segments.removeClass("selected").removeClass("hovered");
    this.addClass("hovered");
    updateGroups(this.data("groups"), true);
  }
  if (!this.hasClass("selected")) {
    this.findOne(".iwr-vis-segment-item-text").fill("#ffffff");
    this.findOne(".iwr-vis-segment-item-arc").attr({
      "stroke-width": Utils.sx / 800,
    });
  }
};

const leaveSegment = function () {
  if (!this.hasClass("selected")) {
    this.findOne(".iwr-vis-segment-item-text").fill("#000000");
    this.findOne(".iwr-vis-segment-item-arc").attr({ "stroke-width": 0 });
  }
  const segments = SVG("#iwr-vis-menu-svg").find(".iwr-vis-segment-item");
  const nSelected = segments.hasClass("selected").filter(Boolean).length;
  if (nSelected === 1) {
    return;
  }
  segments.addClass("hovered");
  updateGroups(null);
};

function applyWeightedHighlights(items, weights) {
  console.assert(items.length === weights.length, items, weights);
  items.css({ filter: "grayscale(80%)", opacity: "20%" });
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > 0) {
      items[i].css({ filter: "grayscale(0)" });
      items[i].css({ opacity: weights[i] });
    }
  }
}

const highlightSegments = function () {
  applyWeightedHighlights(
    SVG("#iwr-vis-menu-svg").find(".iwr-vis-method-item"),
    this.data("method_weights"),
  );
  applyWeightedHighlights(
    SVG("#iwr-vis-menu-svg").find(".iwr-vis-application-item"),
    this.data("application_weights"),
  );
};

const shadowFilter = function (add) {
  add.blend(add.$source, add.gaussianBlur(Utils.sx / 600).in(add.$sourceAlpha));
};

function addSegments(
  svg,
  label,
  names,
  groups,
  color,
  ringIndex,
  segmentClass,
) {
  if (names.length > 0) {
  } else {
    names = Object.keys(names);
  }
  const width = Utils.sx / 40;
  const radius = Utils.sx / 2 - width * (1 + 2 * ringIndex);
  const delta = 360 / (names.length + 1);
  for (let i = 0; i < names.length; i++) {
    const group = svg
      .group()
      .addClass("iwr-vis-segment-item")
      .addClass(segmentClass)
      .addClass("highlighted");
    group.click(selectSegment);
    group.on("mouseenter", hoverSegment);
    group.on("mouseleave", leaveSegment);
    group.data("text", names[i]);
    group.data("groups", groups[i]);
    group.css({
      "transition-property": "opacity",
      "transition-duration": "0.6s",
    });
    group
      .path(
        Utils.makeSegment(radius, (i + 0.5) * delta, (i + 1.5) * delta, width),
      )
      .addClass("iwr-vis-segment-item-arc")
      .fill(color)
      .stroke("#ffffff")
      .attr("stroke-width", 0)
      .filterWith(shadowFilter);
    const strPath = group
      .path(Utils.makeTextArc(radius, (i + 0.5) * delta, (i + 1.5) * delta))
      .fill("none")
      .stroke("none");
    strPath
      .text(names[i])
      .addClass("iwr-vis-segment-item-text")
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle")
      .attr("font-size", `${0.88 * width}px`);
  }
  // label
  const groupLabel = svg.group();
  groupLabel
    .path(Utils.makeSegment(radius, -delta / 2.05, delta / 2.05, width))
    .fill("#ffffff");
  const labelPath = groupLabel
    .path(Utils.makeTextArc(radius, -delta / 2, delta / 2))
    .fill("none")
    .stroke("none");
  const labelPathText = labelPath
    .text(label)
    .attr("startOffset", "50%")
    .attr("text-anchor", "middle")
    .attr("font-size", `${1.056 * width}px`)
    .attr("fill", color)
    .attr("font-weight", "bold");
  const arrow = groupLabel.marker(4, 4, function (add) {
    add.polyline([0, 0, 4, 2, 0, 4]).fill(color).stroke("none");
  });
  const circumference = 6.28318530718 * radius;
  const txtExtentDegrees = (360 * labelPathText.length()) / circumference;
  const arrowPaddingDegrees = 2;
  groupLabel
    .path(
      Utils.makeArrowArc(
        radius,
        txtExtentDegrees / 2 + arrowPaddingDegrees,
        delta / 2 - arrowPaddingDegrees,
      ),
    )
    .fill("none")
    .stroke(color)
    .attr({ "stroke-width": Utils.sx / 200 })
    .marker("end", arrow);
  groupLabel
    .path(
      Utils.makeArrowArc(
        radius,
        -txtExtentDegrees / 2 - arrowPaddingDegrees,
        -delta / 2 + arrowPaddingDegrees,
      ),
    )
    .fill("none")
    .stroke(color)
    .attr({ "stroke-width": Utils.sx / 200 })
    .marker("end", arrow);
}

function addGroups(
  svg,
  projects,
  method_weights,
  application_weights,
  color,
  image_base_url,
) {
  const boxHeight = 60;
  const boxWidth = 290;
  for (let i = 0; i < projects.length; i++) {
    const groupContainer = svg.group();
    const group = groupContainer.group().addClass("iwr-vis-group-item");
    group.on("mouseenter", highlightSegments);
    group.on("mouseclick", highlightSegments);
    group.on("mouseleave", function () {
      if (!this.hasClass("frozenSegments")) {
        updateSegments();
      }
      return;
    });
    group.data("method_weights", method_weights[i]);
    group.data("application_weights", application_weights[i]);
    group.css({
      transition: "opacity 0.6s, visibility 0.6s",
    });
    group.click(function () {
      this.addClass("frozenSegments");
      SVG("#iwr-vis-menu-svg").find(".iwr-vis-group-item").hide();
      this.parent()
        .findOne(".iwr-vis-group-card")
        .front()
        .css({ opacity: 1, visibility: "visible" });
    });
    // box
    group
      .rect(boxWidth, boxHeight)
      .fill(color)
      .stroke("none")
      .addClass("iwr-vis-group-item-box")
      .filterWith(shadowFilter);
    // large professor name
    group
      .text(projects[i].group + "\n" + projects[i].name)
      .addClass("iwr-vis-group-item-profname-large")
      .attr("startOffset", "50%")
      .attr("dominant-baseline", "middle")
      .attr("font-size", `${boxHeight / 3}px`)
      .y(boxHeight / 10)
      .x(boxWidth / 2)
      .attr("text-anchor", "middle");
    group.size(65, 20);
    group.move(Utils.cx - 65 / 2, Utils.cy - 20 / 2);
    addGroupCard(groupContainer, projects[i], color, image_base_url);
  }
}

const hideGroupCard = function () {
  const card = this.parent();
  card.parent().findOne(".iwr-vis-group-item").removeClass("frozenSegments");
  card.css({ opacity: 0, visibility: "hidden" });
  SVG("#iwr-vis-menu-svg").find(".iwr-vis-group-item").show();
};

function addGroupCard(svg, project, color) {
  const group_card = svg.group().addClass("iwr-vis-group-card");
  const card_size = Utils.sx / 2;
  const bg_circle = group_card
    .circle(Utils.sx * (1 - num_outer_rings / 10))
    .cx(Utils.cx)
    .cy(Utils.cy)
    .fill("#ffffff")
    .stroke("none");
  group_card
    .rect(card_size, card_size)
    .cx(Utils.cx)
    .cy(Utils.cy)
    .fill(color)
    .stroke("none")
    .filterWith(shadowFilter);
  const close_button_size = Utils.sx * 0.015;
  const close_button_padding = close_button_size / 2;
  const close_button_x =
    Utils.cx + card_size / 2 - close_button_size - close_button_padding;
  const close_button_y = Utils.cx - card_size / 2 + close_button_padding;
  const close_button = group_card.group().addClass("iwr-vis-clickable");
  close_button
    .rect(close_button_size, close_button_size)
    .move(close_button_x, close_button_y)
    .stroke("#ffffff")
    .fill("#ffffff");
  close_button
    .line(
      close_button_x,
      close_button_y,
      close_button_x + close_button_size,
      close_button_y + close_button_size,
    )
    .stroke("#777777")
    .attr({ "stroke-width": 0.5 });
  close_button
    .line(
      close_button_x + close_button_size,
      close_button_y,
      close_button_x,
      close_button_y + close_button_size,
    )
    .stroke("#777777")
    .attr({ "stroke-width": 0.5 });
  bg_circle.click(hideGroupCard);
  close_button.click(hideGroupCard);
  const group_title_height = card_size / 20;
  let current_y = Utils.cy - card_size / 2;
  current_y += 1.2 * group_title_height;
  group_card
    .text(project.group)
    .attr("startOffset", "50%")
    .attr("dominant-baseline", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", `${group_title_height}px`)
    .x(Utils.cx)
    .y(current_y)
    .attr("text-anchor", "middle");
  const project_title_height = card_size / 16;
  current_y += 1.5 * project_title_height;
  group_card
    .text(project.name)
    .fill("#0000ff")
    .attr("startOffset", "50%")
    .attr("dominant-baseline", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", `${project_title_height}px`)
    .x(Utils.cx)
    .y(current_y)
    .attr("text-anchor", "middle")
    .linkTo(project.website);
  current_y += 2 * project_title_height;
  group_card.css({ opacity: 0, visibility: "hidden" });
  const html_card_width = 0.85 * card_size;
  const html_card_height = 0.85 * (card_size / 2 + Utils.cy - current_y);
  const html_card = group_card
    .foreignObject(html_card_width, html_card_height)
    .attr({ x: Utils.cx - html_card_width / 2, y: current_y });
  let doi_content = '<ul class="list-group border-0 rounded-0">';
  for (const doi of project.doi) {
    if (doi !== "") {
      doi_content += `<li class="list-group-item border-0 rounded-0"><a href='https://doi.org/${doi}'>${doi}</a></li>`;
    }
  }
  doi_content += "</ul>";
  html_card.add(
    SVG(
      '<div xmlns="http://www.w3.org/1999/xhtml" class="iwr-vis-group-card-html">' +
        '<div class="card overflow-auto border-0 rounded-0" style="width: 100%; height: 100%;">' +
        '<div class="card-body">' +
        `<p class="card-text fs-5">${project.description}</p>` +
        doi_content +
        "</div>" +
        "</div>" +
        "</div>",
      true,
    ),
  );
}

const zoomGroups = function (e) {
  // only zoom in/out if all groups are displayed
  const segments = SVG("#iwr-vis-menu-svg").find(".iwr-vis-segment-item");
  const nHovered = segments.hasClass("hovered").filter(Boolean).length;
  if (nHovered != segments.length) {
    return;
  }
  const p = this.point(e.clientX, e.clientY);
  const z = 2;
  if (e.deltaY < 0) {
    updateGroups(
      null,
      true,
      z,
      Utils.cx + (1 - z) * (p.x - Utils.cx),
      Utils.cy + (1 - z) * (p.y - Utils.cy),
    );
  } else {
    updateGroups(null, true);
  }
};

const sortGroupsByProf = function () {
  const group = SVG("#iwr-vis-menu-svg").find(
    ".iwr-vis-settings-menu-sort-by-group",
  );
  const prof = SVG("#iwr-vis-menu-svg").find(
    ".iwr-vis-settings-menu-sort-by-prof",
  );
  if (this.findOne(".iwr-vis-settings-menu-sort-by-prof") != null) {
    prof.fill("#777777");
    group.fill("#ffffff");
    sort_by_group = false;
  } else {
    group.fill("#777777");
    prof.fill("#ffffff");
    sort_by_group = true;
  }
  resetAll();
};

function addSettings(svg) {
  const line_color = "#777777";
  const bg_color = "#ffffff";
  const padding = Utils.sx / 200;
  const font_size = Utils.sx / 75;
  const settings_menu = svg.group().addClass("iwr-vis-settings-menu-large");
  // group sorting options
  const sort_by_group = settings_menu.group().addClass("iwr-vis-clickable");
  sort_by_group
    .rect(font_size, font_size)
    .radius(1)
    .stroke(line_color)
    .fill(bg_color)
    .move(font_size, font_size)
    .attr({ "stroke-width": 0.5 })
    .addClass("iwr-vis-settings-menu-sort-by-group");
  sort_by_group
    .text("Sort by group name")
    .attr("dominant-baseline", "middle")
    .attr("font-size", `${font_size}px`)
    .fill(line_color)
    .x(2 * font_size + padding)
    .y(font_size);
  sort_by_group.click(sortGroupsByProf);
  const sort_by_prof = settings_menu.group().addClass("iwr-vis-clickable");
  sort_by_prof
    .rect(font_size, font_size)
    .radius(1)
    .stroke(line_color)
    .fill(line_color)
    .move(font_size, 3 * font_size)
    .attr({ "stroke-width": 0.5 })
    .addClass("iwr-vis-settings-menu-sort-by-prof");
  sort_by_prof
    .text("Sort by software name")
    .attr("dominant-baseline", "middle")
    .attr("font-size", `${font_size}px`)
    .fill(line_color)
    .x(2 * font_size + padding)
    .y(3 * font_size);
  sort_by_prof.click(sortGroupsByProf);
}

function create_iwr_vis(data) {
  sorted_group_indices = Utils.sorted_indices(data.projects, "group");
  const svg = SVG("#iwr-vis-menu-svg") as SVG.Container;
  // background
  const bg_group = svg.group().addClass("iwr-vis-bg");
  bg_group.click(resetAll);
  bg_group
    .rect(Utils.sx, Utils.sy)
    .cx(Utils.cx)
    .cy(Utils.cy)
    .fill("#ffffff")
    .stroke("#ffffff");

  const inner_circle = svg
    .circle(Utils.sx * (1.0 - num_outer_rings / 10))
    .cx(Utils.cx)
    .cy(Utils.cy)
    .fill("none")
    .stroke("none");
  svg.on("wheel", zoomGroups);

  // create array of weights from project data
  const method_weights = [];
  const application_weights = [];
  for (const project of data.projects) {
    method_weights.push(project.method_weights);
    application_weights.push(project.application_weights);
  }

  // groups
  const groups = svg.group();
  groups.clipWith(inner_circle);
  addGroups(
    groups,
    data.projects,
    method_weights,
    application_weights,
    data.group_color,
    data.image_base_url,
  );
  // methods
  addSegments(
    svg,
    "Research Groups",
    data.methods,
    Utils.transpose(method_weights),
    data.method_color,
    1,
    "iwr-vis-method-item",
  );
  // applications
  addSegments(
    svg,
    "Field of Study",
    data.applications,
    Utils.transpose(application_weights),
    data.application_color,
    0,
    "iwr-vis-application-item",
  );
  resetAll();
  // settings menu
  addSettings(svg);
}

window.onload = function () {
  fetch(json_data_url, { cache: "no-store" })
    .then((response) => response.json())
    .then((data) => {
      data.group_color = "#ffffff";
      data.method_color = "#e13535";
      data.application_color = "#499bce";
      data.show_group_names = false;
      data.methods = ["A-D", "E-H", "I-L", "M-P", "Q-T", "U-Z"];
      data.applications = {
        "Physical Sciences": [
          "Applied Physics",
          "Astronomy",
          "Astrophysics",
          "Biophysics",
          "Geodesy",
          "Geoscience",
          "Physical Chemistry",
          "Physics",
        ],
        "Life Sciences": ["Biochemistry", "Bioinformatics", "Biology"],
        "Computational Sciences": [
          "Complexity Science",
          "Computer Science",
          "Data Science",
          "Machine Learning",
          "Machine learning in thermodynamics",
          "Software Engineering",
        ],
        "Language and Text Analysis": [
          "Corpus Linguistics",
          "Historical Lexicology",
          "Linked Open Data",
          "Text Edition",
        ],
        "Image and Vision Processing": [
          "Computer Vision",
          "Image Analysis",
          "Visual Computing",
        ],
        "Interdisciplinary and Applied Sciences": [
          "Applied Mathematics",
          "Geoinformatics",
          "Social Sciences",
          "Sports Science",
          "Theoretical chemistry",
          "explainable AI",
        ],
      };
      data.projects.forEach(function (item) {
        item.method_weights = Utils.getMethodWeight(item.group, data.methods);
        item.application_weights = Utils.getApplicationWeight(
          item.field,
          data.applications,
        );
      });
      create_iwr_vis(data);
    });
};
