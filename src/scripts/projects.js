/* eslint-disable strict */

$(function () {
    initTags();
});


function initTags() {
    var tagsMapping = {};
    var activeTags = [];

    // elements
    var projects = $(".projectContainer");
    var tagsContainer = $("#filteredTagsContainer");
    var tagsList = $("#filteredTagsContainer ul");
    var searchInput = $("#filterSearchInput");
    var clearSearchIcon = $("#filterSearchClearIcon");
    var noTagsMessage = $("#filteredTagsContainer #noTagsMessage");
    var extraTagsContainer = $("#extraTagsContainer");
    var extraTagsList = $("#extraTagsContainer ul");

    extraTagsContainer.hide();

    // find all tags and fill tagsMapping
    projects.each(function (i, el) {
        var tags = $(el).find(".projectHeader li");
        tags.each(function (j, tagEl) {
            var tag = tagEl.textContent;
            if (tag in tags) {
                tagsMapping[tag].push(i);
            } else {
                tagsMapping[tag] = [i];
            }
        })
    });

    // gen html for all tags
    var validTags = Object.getOwnPropertyNames(tagsMapping);
    validTags.sort();
    validTags.forEach(function (t) {
        tagsList.append("<li>" + t + "<i class='material-icons'>close</i></li>");
        extraTagsList.append("<li class='active hidden'>" + t + "<i class='material-icons'>close</i></li>");
    });

    // lists of all the jquery list elements for the tags
    var tagsListItems = tagsList.children("li");
    var extraTagsListItems = extraTagsList.children("li");

    // click handler for each tag in the main list
    tagsContainer.click(function (event) {
        var target = $(event.target);
        if (target.is("li")) {
            var clickedTag = target[0].childNodes[0].textContent;
            if (target.hasClass("active")) {
                activeTags.splice(activeTags.indexOf(clickedTag), 1);
            } else {
                activeTags.push(clickedTag);
            }
            target.toggleClass("active");
            filterProjects();
            highlightProjects();
        }
    });

    // click handler for each tag in the extra list
    extraTagsContainer.click(function (event) {
        var target = $(event.target);
        if (target.is("li")) {
            var clickedTag = target[0].childNodes[0].textContent;
            activeTags.splice(activeTags.indexOf(clickedTag), 1);
            target.hide();
            tagsListItems.eq(validTags.indexOf(clickedTag)).removeClass("active");
            filterProjects();
            highlightProjects();
        }
    });

    //handler for search Input
    searchInput.on("input", function (e) {
        filterTags($(this).val().toLowerCase());

    });

    clearSearchIcon.click(function (e) {
        searchInput.val("");
        filterTags("");
    });


    var filterTags = function (search) {
        var extra = false;
        var found = false;
        validTags.forEach(function (t, i) {
            if (t.toLowerCase().indexOf(search) > -1) {
                found = true;
                // found
                tagsListItems.eq(i).show();
                extraTagsListItems.eq(i).hide();
            } else {
                // excluded
                tagsListItems.eq(i).hide();
                // if active show to extra list
                if (activeTags.indexOf(t) > -1) {
                    extraTagsListItems.eq(i).show();
                    extra = true;
                } else {
                    extraTagsListItems.eq(i).hide();
                }
            }
        })
        if (found) {
            noTagsMessage.hide();
        } else {
            noTagsMessage.show();
        }
        if (extra) {
            extraTagsContainer.show();
        } else {
            extraTagsContainer.hide();
        }
    }

    var filterProjects = function () {
        if (activeTags.length) {
            projects.each(function (i, el) {
                $(el).hide();
            });

            activeTags.forEach(function (t) {
                projIdxs = tagsMapping[t];
                projIdxs.forEach(function (i) {
                    $(projects[i]).show();
                });
            });
        } else {
            projects.each(function (i, el) {
                $(el).show();
            });
        }
    };

    var highlightProjects = function () {
        projects.each(function (i, el) {
            $(el).find(".projectHeader li").each(function (i, tagEl) {
                var t = tagEl.textContent;
                if (activeTags.includes(t)) {
                    $(tagEl).addClass("active");
                } else {
                    $(tagEl).removeClass("active");
                }
            })
        });
    };
}