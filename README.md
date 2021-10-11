# Description

This project is a frontend to list and download Bespoke patches. It can be used by anyone who would like a place to share its Bespoke patches. It features :

- Search and tag filtering
- Graph display of the patch content
- Showing scripts and comment nodes content

It does not have any user account or database, but it requires a link to a JSON file listing all projects (a script generating it is available). An example is available below. 

Uploading a patch from the UI is not supported yet and a PR based submission is used on the « official » instance. 

# Install and run

$ npm install

$ npm run


# Configuration

Configuration is in the `config.ts` file. For now there are two options : 

- `repo` is the url to the folder containing the manifest.json file
- `basePath` has no use if you’re serving the webapp from root (in that case set it to empty string), but if you are serving it from a subdomain it should be written here

# JSON files

You can find examples of a running folder published on GitHub pages here : https://github.com/fredericlb/BespokeSynth-Community-Sharing-Repo . 

Scripts for JSON production are also available there. 
