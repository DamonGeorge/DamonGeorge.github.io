$(function () {
    initTags();
});


function initTags() {
    var tagsMapping = {};
    var activeTags = [];

    projects = $(".projectContainer");
    projects.each(function (i, el) {
        tags = $(el).find(".projectHeader li");
        tags.each(function (j, tagEl) {
            tag = tagEl.textContent;
            if (tag in tags) {
                tagsMapping[tag].push(i);
            } else {
                tagsMapping[tag] = [i];
            }
        })
    });

    console.log(tagsMapping)

    tagsList = $(".projectFilteringContainer ul");

    for (var t in tagsMapping) {
        tagsList.append("<li>" + t + "<i class='material-icons'>close</i></li>");
    }

    tagsList.click(function (event) {
        target = $(event.target);
        if (target.is("li")) {
            clickedTag = target[0].childNodes[0].textContent;
            if (target.hasClass("active")) {
                activeTags.splice(activeTags.indexOf(clickedTag), 1);
            } else {
                activeTags.push(clickedTag);
            }
            target.toggleClass("active");
            refilter();
            highlightTags();
        }
    });

    var refilter = function () {
        if (activeTags.length) {
            projects.each(function (i, el) {
                $(el).addClass("hidden");
            });

            activeTags.forEach(function (t) {
                projIdxs = tagsMapping[t];
                projIdxs.forEach(function (i) {
                    $(projects[i]).removeClass("hidden");
                    highlightTags($(projects[i]));
                });
            });
        } else {
            projects.each(function (i, el) {
                $(el).removeClass("hidden");
            });
        }
    };

    var highlightTags = function (projectContainer) {
        projects.each(function (i, el) {
            $(el).find(".projectHeader li").each(function (i, tagEl) {
                t = tagEl.textContent;
                if (activeTags.includes(t)) {
                    $(tagEl).addClass("active");
                } else {
                    $(tagEl).removeClass("active");
                }
            })
        });
    };
}