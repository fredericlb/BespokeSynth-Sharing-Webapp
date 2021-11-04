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
      'Bespoke/patches is a place for Bespoke users to publicly share their favorite patches. It is currently a work in progress and while it should work it’s still missing some common features. <a href="https://github.com/BespokeSynth/BespokeSynth">Bespoke</a> and <a href="https://github.com/fredericlb/BespokeSynth-Sharing-Webapp">Bespoke/Community</a> are open source softwares.',
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
    privacy1: "We use a self hosted instance of",
    privacy2: " to collect anonymous metrics",
    disable: "disable",
    enable: "enable",
  },

  Upload: {
    retry: "Retry",
    button: "upload",
    name: "upload",
    metadata: "Metadata",
    patchTitle: "Title *",
    patchAuthor: "Author name *",
    patchMail: "Author mail *",
    patchMailDescription:
      "A confirmation link will be sent prior to patch upload",
    patchTags: "Tags (one word each, separated by comma)",
    patchSummary: "A short summary (240 chars max) *",
    attachments: "Attachments",
    description: "Description",
    descriptionDescription:
      "A long description (optional) -- You can use Markdown here",
    send: "Upload",
    attachmentsDescription:
      "You must add only one bsk file, and optionally multiple audio samples (mp3) + one image for cover",
    quota: "Quota (max size for all files is 70mb) :",
    dropInstruction: "Drop the files here ...",
    noFiles: "No file added",
    dragInstruction: "Drag 'n' drop some files here, or click to select files",
    waitingForMail: "[1/2] Waiting for you to click on the mail validation",
    sendingPatch: "[2/2] Sending patch, please wait",
    error: "Something bad happened, you can try to submit your patch again",
    finished:
      "Patch successfully sent, you will receive an email once its been validated",
  },

  Form: {
    required: "This field is mandatory",
    minLength: "This field must contains at least 3 characters",
    mail: "Must be a valid mail",
    tags: "Must be one word, separated with commas (max 5)",
    maxLength: "The field should be maximum {{len}} characters",
  },

  Attachments: {
    noBSK: "Missing BSK file",
    tooMuchBSKs: "Only one BSK file is allowed",
    tooMuchImages: "Only one image file is allowed",
    imageSize: "Max image size is 1mb",
    quotaExceeded: "Max files size is 70mb",
  },

  TokenValidation: {
    missing: "Missing validation token",
    error: "Token validation failed",
    success: "Your token has been validated, patch upload should start soon",
  },
};
