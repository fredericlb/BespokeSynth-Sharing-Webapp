import struct
import sys
import json
import glob
import os 
from datetime import datetime

from pathlib import Path

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
                elif b.decode("ascii", "ignore") == sep[0]:
                    found = 1
                else:
                    found = 0
                b = f.read(1)

        def get_script():
            script_rev = rint()
            k = 0
            if script_rev >= 2:
                extra_outputs = rint()
            if self.rev >= 422:
                save_state_rev = rint()
            numcontrols = rint()
            for i in range(numcontrols):
                cname = rstr()
                k += 1
                if k == 6:
                    sys.exit(0)
                if cname == "code": 
                    code_rev = rint()
                    data = rstr()
                    return data
                to_msep("controlseparator")
        
        output = json.loads(rstr())

        self.rev = rint()
        output["self.rev"] = self.rev
        if self.rev < 420 or self.rev > 422:
            print("rev number should be 420<>422 : " + str(self.rev) )
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



bskfile = sys.argv[1]

bsk = BSK(bskfile).get_json()

print(json.dumps(bsk))
