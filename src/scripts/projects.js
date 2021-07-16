/* eslint-disable strict */

$(function () {
    initFiltering();
});


function initFiltering() {
    var tagsMapping = {};
    var typesMapping = {};
    var activeTags = [];
    var activeTypes = [];
    var tagsTitles = {};

    // elements
    var projects = $(".projectContainer");
    // tags
    var tagsContainer = $("#filteredTagsContainer");
    var tagsList = $("#filteredTagsContainer ul");
    var searchInput = $("#filterSearchInput");
    var clearSearchIcon = $("#filterSearchClearIcon");
    var noTagsMessage = $("#filteredTagsContainer #noTagsMessage");
    var extraTagsContainer = $("#extraTagsContainer");
    var extraTagsList = $("#extraTagsContainer ul");
    //types
    var typesContainer = $("#filteredTypesContainer")
    var typesList = $("#filteredTypesContainer ul");

    //default hidden elements
    extraTagsContainer.hide();

    // find all tags and fill tagsMapping and types Mapping
    projects.each(function (i, el) {
        // tags
        var tags = $(el).find(".projectHeader li");
        tags.each(function (j, tagEl) {
            var tag = tagEl.textContent;
            if (tag in tagsMapping) {
                tagsMapping[tag].push(i);
            } else {
                tagsMapping[tag] = [i];
            }
            var title = $(tagEl).attr("title");
            if (typeof title !== typeof undefined && title !== false) {
                // tag has title
                tagsTitles[tag] = title;
            }
        })
        //type
        var type = $(el).find(".projectType")[0].textContent;
        if (type in typesMapping) {
            typesMapping[type].push(i);
        } else {
            typesMapping[type] = [i];
        }
    });

    // gen html for all tags
    var validTags = Object.getOwnPropertyNames(tagsMapping);
    validTags.sort();
    validTags.forEach(function (t) {
        if (tagsTitles.hasOwnProperty(t)) {
            title = tagsTitles[t];
            tagsList.append("<li title='" + title + "'>" + t + "<i class='material-icons'>close</i></li>");
            extraTagsList.append("<li class='active hidden' title='" + title + "'>" + t + "<i class='material-icons'>close</i></li>");
        } else {
            tagsList.append("<li>" + t + "<i class='material-icons'>close</i></li>");
            extraTagsList.append("<li class='active hidden'>" + t + "<i class='material-icons'>close</i></li>");
        }
    });

    var validTypes = Object.getOwnPropertyNames(typesMapping);
    validTypes.sort();
    validTypes.forEach(function (t) {
        typesList.append("<li>" + t + "<i class='material-icons'>close</i></li>");
    });


    // lists of all the jquery list elements for the tags
    var tagsListItems = tagsList.children("li");
    var extraTagsListItems = extraTagsList.children("li");

    // list of all list elements for the types
    var typesListItems = typesList.children("li");

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

    //click handler for types
    typesContainer.click(function (event) {
        var target = $(event.target);
        if (target.is("li")) {
            var clickedType = target[0].childNodes[0].textContent;
            if (target.hasClass("active")) {
                activeTypes.splice(activeTypes.indexOf(clickedType), 1);
            } else {
                activeTypes.push(clickedType);
            }
            target.toggleClass("active");
            filterProjects();
            highlightProjects();
        }
    });

    //handlers for search Input
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
        filteredProjectsByType = {};
        filteredProjectsByTag = {};
        projects.each(function (i, el) {
            $(el).hide();
            filteredProjectsByType[i] = activeTypes.length === 0;
            filteredProjectsByTag[i] = activeTags.length === 0;
        });

        activeTypes.forEach(function (t) {
            typesMapping[t].forEach(function (i) {
                filteredProjectsByType[i] = true;
            });
        });

        activeTags.forEach(function (t) {
            tagsMapping[t].forEach(function (i) {
                filteredProjectsByTag[i] = true;
            });
        });

        projects.each(function (i, el) {
            if (filteredProjectsByType[i] && filteredProjectsByTag[i]) {
                $(el).show();
            }
        });
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