// ============================================================================
// PROJECTS CONTENT
// --------------------------------------------------------------------------
// projectOrder controls what shows up where. Whichever key is listed FIRST
// becomes the big featured card at the top of the Projects tab. Every key
// after that becomes a collapsible row underneath, in the order listed.
//
// To move a project (e.g. resume/application wants a different one front
// and center), just reorder the keys in projectOrder — never touch the
// project content itself in projectsById.
//
// Rules for which fields get used, depending on a project's slot:
//   FEATURED (1st key in projectOrder):
//     - photos: ALL entries are shown, as a carousel.
//     - video: shown if set. Set to null (or delete it) to hide the video
//       column entirely — the layout collapses to just the photo carousel.
//     - repoUrl / liveUrl: each rendered as its own button under the title.
//       Leave either as "#" (or blank) to hide that specific button.
//   EVERY OTHER PROJECT (2nd key onward):
//     - photos: only photos[0] is used, as a single thumbnail.
//     - video: ignored even if set.
//     - link: liveUrl is used if set; otherwise repoUrl is used; if neither
//       is set (both "#" or blank), no link is shown.
// ============================================================================

window.SITE_CONTENT = window.SITE_CONTENT || {};

SITE_CONTENT.projectOrder = ["projectOne", "projectTwo", "projectThree", "projectFour", "projectFive", "projectSix"];

SITE_CONTENT.projectsById = {
  projectOne: {
    name: "[Project One Name]",
    description: "[One or two sentences: what this project does, the problem it solves, and any interesting technical detail worth highlighting — this is your best project, so give it a little more room to breathe than the others.]",
    photos: [
      { src: "project1-photo1.jpg", label: "Photo 1 — replace with project1-photo1.jpg" },
      { src: "project1-photo2.jpg", label: "Photo 2 — replace with project1-photo2.jpg" },
      { src: "project1-photo3.jpg", label: "Photo 3 — replace with project1-photo3.jpg" }
    ],
    video: null,
    repoUrl: "https://github.com/MIKRW/portfolio_site",
    liveUrl: "#"
  },
  projectTwo: {
    name: "[Project Two Name]",
    description: "[Short one-sentence description of this project.]",
    photos: [{ src: "project2.jpg", label: "Photo — replace with project2.jpg" }],
    video: null,
    repoUrl: "#",
    liveUrl: "#"
  },
  projectThree: {
    name: "[Project Three Name]",
    description: "[Short one-sentence description of this project.]",
    photos: [{ src: "project3.jpg", label: "Photo — replace with project3.jpg" }],
    video: null,
    repoUrl: "#",
    liveUrl: "#"
  },
  projectFour: {
    name: "[Project Four Name]",
    description: "[Short one-sentence description of this project.]",
    photos: [{ src: "project4.jpg", label: "Photo — replace with project4.jpg" }],
    video: null,
    repoUrl: "#",
    liveUrl: "#"
  },
  projectFive: {
    name: "[Project Five Name]",
    description: "[Short one-sentence description of this project.]",
    photos: [{ src: "project5.jpg", label: "Photo — replace with project5.jpg" }],
    video: null,
    repoUrl: "#",
    liveUrl: "#"
  },
  projectSix: {
    name: "[Project Six Name]",
    description: "[Short one-sentence description of this project.]",
    photos: [{ src: "project6.jpg", label: "Photo — replace with project6.jpg" }],
    video: null,
    repoUrl: "#",
    liveUrl: "#"
  }
};
