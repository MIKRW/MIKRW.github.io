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
//     - embed: optional { src, title } — embeds a live page (e.g. a game) in
//       an iframe under the description, replacing the photos/video layout.
//   EVERY OTHER PROJECT (2nd key onward):
//     - laid out like the featured project: title, description, buttons.
//     - video: optional { src } — shown on a card under the buttons.
//     - photos: only photos[0] is used, as a single image under that.
//     - repoUrl / liveUrl: same "View Repo" / "View Site" buttons as the
//       featured project; "#" or blank hides that button.
// ============================================================================

window.SITE_CONTENT = window.SITE_CONTENT || {};

SITE_CONTENT.projectOrder = ["projectOne", "projectTwo", "projectThree", "projectFour", "projectFive", "projectSix"];

SITE_CONTENT.projectsById = {
  projectOne: {
    name: "Escape the Terrarium",
    description: "A short browser-based game based on capture-the-flag. Help a chameleon break out of its terrarium by solving puzzles to uncover the hidden flag.",
    photos: [],
    video: null,
    embed: { src: "https://mikrw.github.io/chameleon_game/?theme=light", title: "Escape the Terrarium" },
    repoUrl: "https://github.com/MIKRW/chameleon_game",
    liveUrl: "https://mikrw.github.io/chameleon_game/"
  },
  projectTwo: {
    name: "Name That Bird",
    description: "First attempt at creating a prototype app using Google Firebase during an Innovation Sprint with Google Developer Group (La Trobe University). The theme was \"Build AI for a Better World\". You can see my video demonstration below or view more information in the GitHub repo.",
    photos: [],
    // TEMP: points at the original 501 MB export, which only works locally —
    // GitHub rejects files over 100 MB. Swap for a compressed copy (or a
    // hosted link) before pushing.
    video: { src: "Name%20that%20Bird%20.mp4" },
    repoUrl: "https://github.com/MIKRW/GDG_InnovationSprint_2025",
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
