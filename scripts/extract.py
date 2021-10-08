import struct
import sys
import json
import glob
import os 
import markdown
from datetime import datetime

from pathlib import Path

MDREADER = markdown.Markdown(extensions = ['meta'])
GLOBAL_MANIFEST = "./public/shares/manifest.json"

tms = datetime.now().isoformat()

class BSK:
    def __init__(self, path):
        self.path = path
    
    def read(self, f):
        def rlong() : 
            return int.from_bytes(f.read(8), "little")

        def rint() :
            return int.from_bytes(f.read(4), "little")

        def rstr():
            return f.read(rlong()).decode("ascii", "ignore")

        def to_msep(sep):
            found = 0
            b = f.read(1)
            while b:
                if b.decode("ascii", "ignore") == sep[found]:
                    found += 1
                    if found == len(sep):
                        break
                else:
                    found = 0
                b = f.read(1)

        def get_script():
            rev = rint()
            numcontrols = rint()
            for i in range(numcontrols):
                cname = rstr()
                if cname == "code": 
                    rev = rint()
                    return rstr()
                to_msep("controlseparator")
        
        output = json.loads(rstr())

        rev = rint()
        output["rev"] = rev

        if rev != 420:
            print("rev number should be 420")
            sys.exit(3)

        scriptNodes = list(filter(lambda m: m["type"] == "script", output["modules"]))
        modulesCount = rint()

        for i in range(modulesCount):
            mName = rstr()
            for sn in scriptNodes:
                if sn["name"] == mName:
                    sn["script"] = get_script()
            to_msep("ryanchallinor")

        return output

    def get_json(self): 
        content = ""
        with open(self.path, "rb") as f:
            content = self.read(f)
        return content
            
class README:

    def __init__(self, path):
        self.path = path
    
    def get_json(self):
        manifest_raw = Path(self.path).read_text()
        html = MDREADER.convert(manifest_raw)

        return [html, MDREADER.Meta]


if len(sys.argv) < 2:
    print("missing project folder argument")
    sys.exit(1)

project = sys.argv[1]
bsk_files = glob.glob(f"./public/shares/{project}/*.bsk")

if len(bsk_files) == 0:
    print(f"ERROR: Missing bsk file in {project}")
    sys.exit(2)
elif len(bsk_files) > 1:
    print(f"ERROR: No support for multiple BSK files in {project}")
    sys.exit(2)

md = f"./public/shares/{project}/README.md"

if not os.path.isfile(md):
    print(f"ERROR: Missing README.md file in {project}")
    sys.exit(2)

bsk = BSK(bsk_files[0]).get_json()
[html, meta] = README(md).get_json()

audio_files = glob.glob(f"./public/shares/{project}/*.mp3")

out = meta.copy()

out["bsk_content"] = bsk
out["bsk_path"] = os.path.basename(bsk_files[0])
out["html"] = html
out["publish"] = tms
out["rev"] = 1
out["audio_samples"] = list(map(lambda x: os.path.basename(x), audio_files))

Path(f"./public/shares/{project}/__manifest.json").write_text(json.dumps(out, indent=4, sort_keys=True))

manifest = json.loads(Path(GLOBAL_MANIFEST).read_text())
manifest[project] = meta.copy()
manifest[project]["id"] = project
manifest[project]["publish"] = tms

Path(GLOBAL_MANIFEST).write_text(json.dumps(manifest))