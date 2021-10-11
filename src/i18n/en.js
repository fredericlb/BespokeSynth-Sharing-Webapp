export default {
  Patch: {
    viz: "viz",
    audio_samples: "audio_samples",
    description: "description",
    no_audio_samples: "No audio samples",
    no_description: "No description",
    back: "Patch list",
  },

  PatchList: {
    no_patches: "No patches found",
  },

  About: {
    title: "About",
    description:
      'Bespoke/Community is a place for Bespoke users to publicly share their favorite patches. It is currently a work in progress and while it should work it’s still missing some common features. <a href="https://github.com/BespokeSynth/BespokeSynth">Bespoke</a> and <a href="https://github.com/fredericlb/BespokeSynth-Sharing-Webapp">Bespoke/Community</a> are open source softwares.',
    upload_title: "upload",
    upload:
      'In this first version the process is fully manual. You have to do a pull request on <a href="https://github.com/fredericlb/BespokeSynth-Community-Sharing-Repo">this repository</a>, which contains every patches listed by Bespoke/Community. Instructions are included in the README of the repository. If all these words does not make sense to you, you can contact me (@phr__) on <a href="https://discord.gg/YdTMkvvpZZ">Bespoke’s Discord</a>. ',
  },

  Error: {
    title: "ERROR",
    content: "Something bad happened :(",
  },

  Header: {
    search: "search...",
    tags: "tags...",
    go: "go",
  },

  PatchItem: {
    author: "author",
    date: "date",
    revision: "revision",
    download: "Download",
  },

  ScriptsModal: {
    title: "Scripts review",
    intro: `This patch contains Python scripts. Since Python is not sandboxed when
    running Bespoke, running these scripts could do potentially harm your
    computer. Please review all these scripts before download, and if you
    are not Python saavy please ask someone on the Discord community.`,
    cancel: "Cancel",
    download: "Download",
  },

  Footer: {
    text: "2021 - Bespoke/Community is an open source project (MIT licence)",
  },
};
