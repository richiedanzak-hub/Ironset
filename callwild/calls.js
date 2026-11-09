/* Call of the Wild — the lessons, and what each call is scored against.

   Everything a caller reads (what the call is, when to use it, how to make it,
   what goes wrong) and everything the analyzer measures against lives here,
   so improving a lesson or a target is an edit to one entry.

   Every call listed has a real recording behind it. A call with no recording
   is not listed at all — the first hunters to try it were right that a blank
   sound board teaches nothing.

   Two kinds of targets:
   - Hand-set ones (`spec.score`) for calls that are a caller's craft more than
     an animal's sound — the basic quack, the greeting call, a goose's honk —
     drawn from published calling instruction.
   - Learned ones (`learn`) for calls that copy an animal closely: tools/learn.cjs
     measures the call's own reference recording (notes, speed, length, pitch
     shape) and writes the targets and the target picture into the LEARNED
     block below.

   Scoring rows are [part, weight, settings]; the parts are defined in
   analysis.js. `ghost` is the target picture: {t: start s, d: length s,
   s: pitch in half-steps from the first note, v: loudness 0-1, path: pitch
   shape inside the note as [fraction, half-steps]}. */
(function (root) {
  "use strict";

  /* LEARNED:begin — written by tools/learn.cjs from the reference clips; do not edit by hand */
  var LEARNED = {"duck-black":{"score":[["count",0.8,{"range":[3,9]}],["pace",1,{"range":[2.4,4.6]}],["length",0.8,{"range":[0.14,0.38]}]],"ghost":[{"t":0,"d":0.27,"s":0,"v":1},{"t":0.4,"d":0.24,"s":-1.5,"v":1},{"t":0.78,"d":0.14,"s":-2.8,"v":1},{"t":0.93,"d":0.17,"s":-3.5,"v":1},{"t":1.21,"d":0.29,"s":21.9,"v":1}],"measured":{"n":5,"rate":3.32,"cv":0.38,"medDur":0.24,"pitch":-3.4,"clip":"blackduck-hen"}},"duck-mottled":{"score":[["count",0.5,{"range":[1,5]}],["length",1,{"range":[0.2,0.52]}],["pauses",0.6,{"range":[0.24,1.18],"single":true}],["crisp",0.8,{"max":0.07}]],"ghost":[{"t":0,"d":0.37,"s":0,"v":1},{"t":0.81,"d":0.32,"s":0.4,"v":1},{"t":1.67,"d":0.31,"s":0.3,"v":1},{"t":2.61,"d":0.34,"s":0.1,"v":1}],"measured":{"n":4,"rate":1.15,"cv":0.08,"medDur":0.33,"pitch":-0.1,"clip":"mottled-hen"}},"duck-gadwall":{"score":[["count",0.8,{"range":[7,19]}],["pace",1,{"range":[2.9,5.7]}],["length",0.8,{"range":[0.08,0.22]}]],"ghost":[{"t":0,"d":0.15,"s":0,"v":1},{"t":0.17,"d":0.06,"s":8.2,"v":1},{"t":0.24,"d":0.11,"s":8,"v":1},{"t":0.36,"d":0.59,"s":2.6,"v":1},{"t":0.96,"d":0.2,"s":7.3,"v":1},{"t":1.17,"d":0.16,"s":1.5,"v":1},{"t":1.48,"d":0.08,"s":1.6,"v":1},{"t":1.94,"d":0.22,"s":2.1,"v":1},{"t":2.17,"d":0.13,"s":-2,"v":1},{"t":2.35,"d":0.06,"s":4.6,"v":1},{"t":2.52,"d":0.15,"s":9.2,"v":1},{"t":2.69,"d":0.12,"s":3.6,"v":1}],"measured":{"n":12,"rate":4.1,"cv":0.64,"medDur":0.14,"pitch":-4.4,"clip":"gadwall-calls"}},"wigeon-whistle":{"score":[["count",0.8,{"range":[3,24]}],["pace",1,{"range":[2.8,5.5]}],["length",0.8,{"range":[0.11,0.29]}]],"ghost":[{"t":0,"d":0.05,"s":0,"v":1},{"t":0.14,"d":0.13,"s":1.2,"v":1},{"t":0.44,"d":0.13,"s":-0.6,"v":1},{"t":0.62,"d":0.07,"s":-2.2,"v":1},{"t":0.75,"d":0.21,"s":-2.1,"v":1},{"t":1.06,"d":0.12,"s":-4.4,"v":1},{"t":1.33,"d":0.15,"s":-3.1,"v":1},{"t":1.67,"d":0.19,"s":-2,"v":1},{"t":1.94,"d":0.19,"s":0.2,"v":1},{"t":2.13,"d":0.22,"s":0.1,"v":1},{"t":2.42,"d":0.21,"s":-2.5,"v":1},{"t":2.73,"d":0.07,"s":0.3,"v":1},{"t":2.94,"d":0.46,"s":-2.4,"v":1},{"t":3.42,"d":0.18,"s":-3.6,"v":1},{"t":3.81,"d":0.18,"s":-2.9,"v":1},{"t":4,"d":0.19,"s":0,"v":1},{"t":4.2,"d":0.13,"s":-1.7,"v":1},{"t":4.34,"d":0.21,"s":-3,"v":1},{"t":4.57,"d":0.22,"s":-0.1,"v":1},{"t":4.81,"d":0.22,"s":-1.4,"v":1}],"measured":{"n":20,"rate":3.95,"cv":0.36,"medDur":0.18,"pitch":-0.8,"clip":"wigeon-whistles"}},"teal-gw":{"score":[["count",0.8,{"range":[6,16]}],["pace",1,{"range":[1.5,2.9]}],["length",0.8,{"range":[0.12,0.31]}]],"ghost":[{"t":0,"d":0.1,"s":0,"v":1},{"t":0.11,"d":0.16,"s":4.9,"v":1},{"t":0.49,"d":0.22,"s":1.8,"v":1},{"t":1.09,"d":0.12,"s":0.3,"v":1},{"t":1.57,"d":0.2,"s":1.8,"v":1},{"t":2.11,"d":0.33,"s":6.2,"v":1},{"t":2.59,"d":0.25,"s":3.5,"v":1},{"t":3.1,"d":0.23,"s":4.9,"v":1},{"t":3.71,"d":0.12,"s":0.6,"v":1},{"t":4.26,"d":0.19,"s":3,"v":1}],"measured":{"n":10,"rate":2.11,"cv":0.32,"medDur":0.19,"pitch":1.6,"clip":"gwteal-peeps"}},"teal-bw":{"score":[["count",0.5,{"range":[1,13]}],["length",1,{"range":[0.05,0.14]}],["pauses",0.6,{"range":[0.15,0.72],"single":true}]],"ghost":[{"t":0,"d":0.07,"s":0,"v":1},{"t":0.77,"d":0.1,"s":-1.1,"v":1},{"t":2.46,"d":0.05,"s":1.7,"v":1},{"t":2.52,"d":0.06,"s":-5,"v":1},{"t":2.59,"d":0.06,"s":-1.4,"v":1},{"t":2.67,"d":0.12,"s":-0.9,"v":1},{"t":2.81,"d":0.26,"s":0.4,"v":1},{"t":3.39,"d":0.14,"s":5.6,"v":1},{"t":4.06,"d":0.15,"s":5.3,"v":1},{"t":4.66,"d":0.07,"s":4.2,"v":1},{"t":4.89,"d":0.13,"s":5.3,"v":1},{"t":5.64,"d":0.09,"s":3.7,"v":1}],"measured":{"n":12,"rate":1.95,"cv":0.94,"medDur":0.09,"pitch":7.3,"clip":"bwteal-peeps"}},"teal-bwhen":{"score":[["count",0.8,{"range":[4,12]}],["pace",1,{"range":[3.1,6]}],["rhythm",1,{"kind":"even","cv":0.47,"drift":0.35}],["length",0.8,{"range":[0.08,0.22]}],["pitch",0.8,{"dir":"down","range":[1.1,8.7],"soft":1}]],"ghost":[{"t":0,"d":0.32,"s":0,"v":1},{"t":0.37,"d":0.14,"s":0.4,"v":1},{"t":0.57,"d":0.18,"s":-1,"v":1},{"t":0.77,"d":0.16,"s":-0.8,"v":1},{"t":0.98,"d":0.13,"s":-2,"v":1},{"t":1.18,"d":0.13,"s":-0.3,"v":1},{"t":1.39,"d":0.05,"s":-4.9,"v":1}],"measured":{"n":7,"rate":4.32,"cv":0.29,"medDur":0.14,"pitch":-3.1,"clip":"bwteal-hen"}},"woodduck-squeal":{"score":[["count",0.8,{"range":[4,10]}],["pace",1,{"range":[1.2,2.3]}],["rhythm",1,{"kind":"even","cv":0.23,"drift":0.35}],["length",0.8,{"range":[0.23,0.61]}]],"ghost":[{"t":0,"d":0.27,"s":0,"v":1},{"t":0.48,"d":0.36,"s":-0.5,"v":1},{"t":1.06,"d":0.43,"s":-0.1,"v":1},{"t":1.68,"d":0.41,"s":-2.9,"v":1},{"t":2.37,"d":0.42,"s":-0.4,"v":1},{"t":3.05,"d":0.33,"s":-2.1,"v":1}],"measured":{"n":6,"rate":1.64,"cv":0.14,"medDur":0.38,"pitch":-1.9,"clip":"woodduck-squeals"}},"divers-scaup":{"score":[["count",0.8,{"range":[5,13]}],["pace",1,{"range":[1.7,3.3]}],["rhythm",1,{"kind":"even","cv":0.24,"drift":0.35}],["length",0.8,{"range":[0.12,0.33]}]],"ghost":[{"t":0,"d":0.2,"s":0,"v":1},{"t":0.3,"d":0.23,"s":-0.3,"v":1},{"t":0.69,"d":0.18,"s":-0.5,"v":1},{"t":1.09,"d":0.21,"s":-1,"v":1},{"t":1.58,"d":0.2,"s":-0.6,"v":1},{"t":2.03,"d":0.23,"s":-1.3,"v":1},{"t":2.46,"d":0.24,"s":-1.4,"v":1},{"t":2.92,"d":0.21,"s":-1.4,"v":1}],"measured":{"n":8,"rate":2.4,"cv":0.15,"medDur":0.21,"pitch":-1.5,"clip":"scaup-growls"}},"divers-ringneck":{"score":[["count",0.8,{"range":[7,18]}],["pace",1,{"range":[2,3.8]}],["rhythm",1,{"kind":"even","cv":0.45,"drift":0.35}],["length",0.8,{"range":[0.09,0.24]}]],"ghost":[{"t":0,"d":0.13,"s":0,"v":1},{"t":0.36,"d":0.13,"s":-0.2,"v":1},{"t":0.7,"d":0.13,"s":-0.5,"v":1},{"t":1.03,"d":0.16,"s":0.3,"v":1},{"t":1.39,"d":0.15,"s":0.1,"v":1},{"t":1.74,"d":0.15,"s":-0.2,"v":1},{"t":2.08,"d":0.14,"s":-0.6,"v":1},{"t":2.41,"d":0.16,"s":0.3,"v":1},{"t":2.77,"d":0.17,"s":-0.1,"v":1},{"t":2.98,"d":0.36,"s":-2.4,"v":1},{"t":3.6,"d":0.11,"s":-0.3,"v":1}],"measured":{"n":11,"rate":2.78,"cv":0.28,"medDur":0.15,"pitch":0.2,"clip":"ringneck-hen"}},"divers-redhead":{"score":[["count",0.5,{"range":[1,8]}],["length",1,{"range":[0.18,0.48]}],["pauses",0.6,{"range":[0.02,0.12],"single":true}]],"ghost":[{"t":0,"d":0.3,"s":0,"v":1},{"t":0.32,"d":0.33,"s":1.2,"v":1},{"t":0.7,"d":0.16,"s":0,"v":1},{"t":0.93,"d":0.11,"s":1.7,"v":1},{"t":1.05,"d":0.32,"s":0.5,"v":1},{"t":1.42,"d":0.09,"s":-5,"v":1},{"t":2.04,"d":0.35,"s":1.6,"v":1}],"measured":{"n":7,"rate":2.95,"cv":0.5,"medDur":0.3,"pitch":0.5,"clip":"redhead-meows"}},"goose-murmur":{"score":[["count",0.8,{"range":[6,40]}],["pace",1,{"range":[1.6,3.2]}],["length",0.8,{"range":[0.15,0.41]}]],"ghost":[{"t":0,"d":0.37,"s":0,"v":1},{"t":0.59,"d":0.25,"s":0,"v":1},{"t":1.05,"d":0.08,"s":-26.8,"v":1},{"t":1.35,"d":0.07,"s":2.9,"v":1},{"t":1.61,"d":0.39,"s":-11.1,"v":1},{"t":2.11,"d":0.34,"s":-11.8,"v":1},{"t":2.64,"d":0.1,"s":3.6,"v":1},{"t":3.4,"d":0.4,"s":-35.2,"v":1},{"t":3.96,"d":0.31,"s":-11.1,"v":1},{"t":4.28,"d":0.26,"s":-11.1,"v":1},{"t":4.56,"d":0.25,"s":2.2,"v":1},{"t":4.82,"d":0.13,"s":3.2,"v":1}],"measured":{"n":12,"rate":2.28,"cv":0.38,"medDur":0.26,"pitch":2.1,"clip":"goose-murmur"}},"turkey-tree":{"score":[["count",0.8,{"range":[13,33]}],["pace",1,{"range":[2.2,4.2]}],["length",0.8,{"range":[0.05,0.14]}]],"ghost":[{"t":0,"d":0.04,"s":0,"v":1},{"t":0.83,"d":0.04,"s":0,"v":1},{"t":1.39,"d":0.18,"s":13.3,"v":1},{"t":1.66,"d":0.19,"s":13.2,"v":1},{"t":1.92,"d":0.33,"s":-6.2,"v":1},{"t":2.27,"d":0.11,"s":-11.9,"v":1},{"t":2.59,"d":0.08,"s":-11.7,"v":1},{"t":2.91,"d":0.15,"s":-7.8,"v":1},{"t":3.09,"d":0.05,"s":8.5,"v":1},{"t":3.33,"d":0.05,"s":-12.3,"v":1},{"t":3.7,"d":0.05,"s":-12.4,"v":1},{"t":4.1,"d":0.04,"s":-10.5,"v":1},{"t":4.25,"d":0.09,"s":-9.7,"v":1},{"t":4.38,"d":0.1,"s":-8.2,"v":1},{"t":4.53,"d":0.04,"s":13.8,"v":1},{"t":4.78,"d":0.05,"s":0,"v":1},{"t":4.91,"d":0.46,"s":-6.8,"v":1},{"t":5.4,"d":0.04,"s":-14.2,"v":1},{"t":5.46,"d":0.41,"s":-6.4,"v":1},{"t":5.88,"d":0.6,"s":-7.2,"v":1},{"t":6.64,"d":0.32,"s":-8,"v":1}],"measured":{"n":21,"rate":3.01,"cv":0.62,"medDur":0.09,"pitch":-3.6,"clip":"turkey-tree"}},"turkey-keekee":{"score":[["count",0.8,{"range":[5,13]}],["pace",1,{"range":[3,5.7]}],["length",0.8,{"range":[0.15,0.41]}]],"ghost":[{"t":0,"d":0.39,"s":0,"v":1},{"t":0.46,"d":0.24,"s":-2.4,"v":1},{"t":0.71,"d":0.08,"s":-2.1,"v":1},{"t":0.8,"d":0.2,"s":-1.9,"v":1},{"t":1.01,"d":0.28,"s":-1.7,"v":1},{"t":1.3,"d":0.27,"s":-1.2,"v":1},{"t":1.59,"d":0.09,"s":-1,"v":1},{"t":1.69,"d":0.35,"s":-0.7,"v":1}],"measured":{"n":8,"rate":4.15,"cv":0.52,"medDur":0.26,"pitch":1.8,"clip":"turkey-keekee"}},"turkey-purr":{"score":[["count",0.5,{"range":[1,4]}],["length",1,{"range":[0.8,2.12]}],["pauses",0.6,{"range":[0.31,1.53],"single":true}],["rolling",1.2,{"min":0.1}]],"ghost":[{"t":0,"d":0.66,"s":0,"v":1,"roll":true},{"t":1.9,"d":2.51,"s":1.2,"v":1,"roll":true},{"t":4.56,"d":1.33,"s":1.4,"v":1,"roll":true}],"measured":{"n":3,"rate":0.44,"cv":0.24,"medDur":1.33,"pitch":1.4,"clip":"turkey-purr"}},"turkey-cluckpurr":{"score":[["count",0.5,{"range":[3,30]}],["length",1,{"range":[0.07,0.18]}]],"ghost":[{"t":0,"d":0.05,"s":0,"v":1},{"t":0.4,"d":0.06,"s":-10.7,"v":1},{"t":0.53,"d":0.1,"s":-8.5,"v":1},{"t":1.11,"d":0.07,"s":-5.6,"v":1},{"t":1.49,"d":0.32,"s":-20.2,"v":1},{"t":1.88,"d":0.1,"s":13.3,"v":1},{"t":2.08,"d":0.1,"s":13.2,"v":1},{"t":2.21,"d":0.1,"s":0.5,"v":1},{"t":2.33,"d":0.23,"s":-8.8,"v":1},{"t":2.57,"d":0.28,"s":0.2,"v":1},{"t":2.89,"d":0.09,"s":0,"v":1},{"t":2.99,"d":0.28,"s":0.2,"v":1},{"t":3.28,"d":0.17,"s":0,"v":1},{"t":3.58,"d":0.47,"s":0,"v":1},{"t":4.28,"d":0.07,"s":13.4,"v":1},{"t":4.48,"d":0.12,"s":-10.8,"v":1},{"t":4.63,"d":0.32,"s":2.4,"v":1},{"t":5.06,"d":0.13,"s":1.1,"v":1},{"t":5.23,"d":0.08,"s":0.5,"v":1},{"t":5.35,"d":0.11,"s":-5,"v":1},{"t":5.49,"d":0.22,"s":-6.8,"v":1},{"t":5.72,"d":0.14,"s":0.3,"v":1},{"t":5.89,"d":0.7,"s":-7,"v":1},{"t":6.85,"d":0.5,"s":-6,"v":1},{"t":7.48,"d":0.09,"s":13.5,"v":1},{"t":7.66,"d":0.12,"s":-10.1,"v":1}],"measured":{"n":26,"rate":3.27,"cv":0.7,"medDur":0.12,"pitch":-0.3,"clip":"turkey-cluckpurr"}},"turkey-gobble":{"score":[["count",0.5,{"range":[1,3]}],["holdLen",1,{"range":[0.6,1.5]}],["rolling",1,{"min":0.08}]],"ghost":[{"t":0,"d":0.97,"s":0,"v":1,"roll":true}],"measured":{"n":1,"rate":0,"cv":0,"medDur":0.97,"pitch":0,"clip":"turkey-gobble"}},"elk-location":{"score":[["count",0.5,{"range":[1,3]}],["holdLen",1,{"range":[1.4,3.8]}],["riseFall",1.4,{"climb":6,"drop":2}]],"ghost":[{"t":0,"d":2.4,"s":0,"v":1,"path":[[0.01,-8.6],[0.1,-5.2],[0.19,-1.6],[0.28,0.4],[0.37,0.3],[0.46,0.2],[0.55,0.4],[0.65,0.1],[0.74,-0.3],[0.83,-0.3],[0.92,-0.4]]}],"measured":{"n":1,"rate":0,"cv":0,"medDur":2.4,"pitch":0,"clip":"elk-location"}},"elk-chuckle":{"score":[["count",0.8,{"range":[7,18]}],["pace",1,{"range":[2,3.9]}],["length",0.8,{"range":[0.03,0.09]}]],"ghost":[{"t":0,"d":0.05,"s":0,"v":1},{"t":0.37,"d":0.09,"s":-1.1,"v":1},{"t":0.59,"d":0.1,"s":-8.6,"v":1},{"t":0.88,"d":0.06,"s":-22.6,"v":1},{"t":1.24,"d":0.05,"s":-1.7,"v":1},{"t":1.31,"d":0.11,"s":1,"v":1},{"t":1.7,"d":0.04,"s":0.3,"v":1},{"t":1.97,"d":0.06,"s":-0.4,"v":1},{"t":2.38,"d":0.04,"s":0,"v":1},{"t":3.11,"d":0.07,"s":-0.9,"v":1},{"t":3.57,"d":0.03,"s":1.5,"v":1}],"measured":{"n":11,"rate":2.81,"cv":0.48,"medDur":0.06,"pitch":2,"clip":"elk-chuckle"}},"elk-cow":{"score":[["count",0.5,{"range":[1,4]}],["holdLen",1,{"range":[0.6,1.7]}]],"ghost":[{"t":0,"d":1.06,"s":0,"v":1},{"t":2.58,"d":0.16,"s":1.4,"v":1},{"t":3.22,"d":0.2,"s":1,"v":1}],"measured":{"n":3,"rate":0.62,"cv":0.85,"medDur":0.2,"pitch":1,"clip":"elk-cow-mew"}},"elk-calf":{"score":[["count",0.5,{"range":[1,6]}],["holdLen",1,{"range":[0.9,2.4]}],["breakDown",1,{"drop":1,"label":"Slides down"}]],"ghost":[{"t":0,"d":0.71,"s":0,"v":1,"path":[[0.02,12.7],[0.1,12.4],[0.19,11.9],[0.27,9.3],[0.36,6.3],[0.44,0.5],[0.53,-0.3],[0.61,-0.8],[0.7,-1.8],[0.78,-2.2],[0.87,-2.6],[0.95,-2.8]]},{"t":0.72,"d":1.16,"s":-1.1,"v":1,"path":[[0.01,-1.5],[0.1,-0.2],[0.18,0],[0.27,-0.1],[0.36,0],[0.44,0.3],[0.53,0.6],[0.62,0.3],[0.7,0.3],[0.79,-0.5],[0.88,-4.2]]},{"t":3.24,"d":0.06,"s":-2.5,"v":1},{"t":3.32,"d":0.53,"s":0,"v":1,"path":[[0.1,11.8],[0.17,12.1],[0.25,12],[0.36,8],[0.44,6.7],[0.55,0.3],[0.63,-0.8],[0.71,-2.1],[0.78,-2.5],[0.86,-2.9],[0.94,-3.1]]},{"t":3.86,"d":1.52,"s":-0.8,"v":1,"path":[[0.01,-1.3],[0.1,0.7],[0.19,5.7],[0.28,8.6],[0.38,6.1],[0.47,0.1],[0.56,-0.6],[0.65,0.8],[0.75,-0.4],[0.84,-0.7],[0.93,-6.3]]}],"measured":{"n":5,"rate":1.04,"cv":1.11,"medDur":0.71,"pitch":-0.4,"clip":"elk-calf-mew"}},"deer-fawn":{"score":[["count",0.5,{"range":[1,4]}],["holdLen",1,{"range":[0.8,2.1]}],["breakDown",1,{"drop":1,"label":"Falls"}]],"ghost":[{"t":0,"d":1.31,"s":0,"v":1,"path":[[0.02,1],[0.09,1.4],[0.17,1.5],[0.25,1.2],[0.32,0.8],[0.4,0.3],[0.47,-0.1],[0.55,-0.5],[0.63,-0.9],[0.7,-1.4],[0.78,-2.3],[0.86,-3.5]]}],"measured":{"n":1,"rate":0,"cv":0,"medDur":1.31,"pitch":0,"clip":"deer-fawn"}},"deer-blow":{"score":[["count",0.5,{"range":[1,5]}],["length",1,{"range":[0.37,0.98]}],["pauses",0.6,{"range":[1.41,6.89],"single":true}]],"ghost":[{"t":0,"d":0.62,"s":0,"v":1},{"t":4.49,"d":0.65,"s":-0.2,"v":1},{"t":7.53,"d":0.56,"s":-0.9,"v":1}],"measured":{"n":3,"rate":0.27,"cv":0.27,"medDur":0.62,"pitch":-0.9,"clip":"deer-blow"}},"moose-cow":{"score":[["count",0.5,{"range":[1,3]}],["holdLen",1,{"range":[2.6,6.9]}]],"ghost":[{"t":0,"d":1.17,"s":0,"v":1},{"t":1.18,"d":2.31,"s":-1.6,"v":1},{"t":5.22,"d":4.29,"s":-1.9,"v":1}],"measured":{"n":3,"rate":0.38,"cv":0.77,"medDur":2.31,"pitch":-1.9,"clip":"moose-cow"}},"quail-bobwhite":{"score":[["count",0.5,{"range":[2,12]}],["length",1,{"range":[0.11,0.28]}]],"ghost":[{"t":0,"d":0.31,"s":0,"v":1},{"t":0.64,"d":0.08,"s":-0.5,"v":1},{"t":0.73,"d":0.25,"s":3,"v":1},{"t":1.44,"d":0.04,"s":15,"v":1},{"t":1.89,"d":0.18,"s":15.2,"v":1},{"t":2.2,"d":0.21,"s":6.5,"v":1},{"t":2.42,"d":0.14,"s":6.9,"v":1},{"t":2.59,"d":0.36,"s":5,"v":1},{"t":3.29,"d":0.06,"s":10.3,"v":1}],"measured":{"n":9,"rate":2.43,"cv":0.61,"medDur":0.18,"pitch":9.2,"clip":"quail-bobwhite"}},"quail-covey":{"score":[["count",0.5,{"range":[1,10]}],["length",1,{"range":[0.46,1.22]}]],"ghost":[{"t":0,"d":0.73,"s":0,"v":1},{"t":1.44,"d":0.74,"s":-0.5,"v":1},{"t":2.91,"d":0.78,"s":-0.5,"v":1},{"t":4.37,"d":0.76,"s":-0.6,"v":1},{"t":5.8,"d":0.79,"s":-0.7,"v":1},{"t":7.2,"d":0.77,"s":-0.6,"v":1}],"measured":{"n":6,"rate":0.69,"cv":0.02,"medDur":0.76,"pitch":-0.4,"clip":"quail-covey"}},"dove-coo":{"score":[["count",0.8,{"range":[3,9]}],["pace",1,{"range":[0.8,1.4]}],["length",0.8,{"range":[0.4,1.07]}]],"ghost":[{"t":0,"d":0.63,"s":0,"v":1},{"t":0.64,"d":0.71,"s":5.2,"v":1},{"t":1.66,"d":0.82,"s":0.8,"v":1},{"t":2.86,"d":0.54,"s":0.6,"v":1},{"t":3.84,"d":0.67,"s":0.8,"v":1}],"measured":{"n":5,"rate":1.04,"cv":0.24,"medDur":0.67,"pitch":0.5,"clip":"dove-coo"}},"pred-lone":{"score":[["count",0.5,{"range":[1,4]}],["holdLen",1,{"range":[0.9,2.3]}],["riseFall",1.2,{"climb":3,"drop":2}]],"ghost":[{"t":0,"d":1.45,"s":0,"v":1,"path":[[0.01,-1.7],[0.11,-0.4],[0.2,-0.2],[0.31,0.1],[0.42,-11.6],[0.51,7.5],[0.59,7.3],[0.67,7.3],[0.76,-11.6],[0.84,7],[0.92,-0.5]]},{"t":3.53,"d":0.36,"s":-0.7,"v":1,"path":[[0.03,0.7],[0.09,0.5],[0.14,0.3],[0.2,0.7],[0.25,0.5],[0.31,0.5],[0.36,0],[0.42,0],[0.48,-0.1],[0.53,-0.1],[0.59,0],[0.64,0],[0.7,0],[0.75,-0.1],[0.81,-0.1],[0.86,-0.1],[0.92,-0.1]]},{"t":4.53,"d":0.45,"s":-1.5,"v":1,"path":[[0.02,-0.3],[0.11,0.1],[0.2,-0.2],[0.29,0.1],[0.38,0],[0.47,0.1],[0.56,-0.1],[0.69,-12],[0.78,0.1],[0.87,0.1],[0.96,0]]}],"measured":{"n":3,"rate":0.44,"cv":0.79,"medDur":0.45,"pitch":-1.5,"clip":"coyote-lone"}},"fox-red":{"score":[["count",0.8,{"range":[4,12]}],["pace",1,{"range":[0.5,1]}],["length",0.8,{"range":[0.66,1.76]}]],"ghost":[{"t":0,"d":0.28,"s":0,"v":1},{"t":0.3,"d":1.1,"s":18.8,"v":1},{"t":1.74,"d":0.61,"s":18.1,"v":1},{"t":3.43,"d":1.18,"s":17.9,"v":1},{"t":4.62,"d":1.21,"s":17.5,"v":1},{"t":7.11,"d":1.39,"s":0,"v":1},{"t":8.51,"d":0.51,"s":0,"v":1}],"measured":{"n":7,"rate":0.71,"cv":0.5,"medDur":1.1,"pitch":-1.4,"clip":"fox-red"}},"fox-gray":{"score":[["count",0.5,{"range":[1,5]}],["length",1,{"range":[0.16,0.42]}],["pauses",0.6,{"range":[0.84,4.09],"single":true}]],"ghost":[{"t":0,"d":0.32,"s":0,"v":1},{"t":2.07,"d":0.31,"s":-0.4,"v":1},{"t":4.23,"d":0.21,"s":0.9,"v":1},{"t":6.48,"d":0.22,"s":1,"v":1}],"measured":{"n":4,"rate":0.46,"cv":0.04,"medDur":0.26,"pitch":1.2,"clip":"fox-gray"}},"loc-horned":{"score":[["count",0.8,{"range":[7,18]}],["pace",1,{"range":[2.1,4]}],["length",0.8,{"range":[0.06,0.15]}]],"ghost":[{"t":0,"d":0.35,"s":0,"v":1},{"t":0.52,"d":0.06,"s":0.9,"v":1},{"t":0.86,"d":0.07,"s":1.5,"v":1},{"t":1.05,"d":0.07,"s":1,"v":1},{"t":1.16,"d":0.05,"s":0.2,"v":1},{"t":1.33,"d":0.34,"s":0,"v":1},{"t":1.72,"d":0.3,"s":2.4,"v":1},{"t":2.09,"d":0.4,"s":0.5,"v":1},{"t":2.61,"d":0.1,"s":0.7,"v":1},{"t":2.75,"d":0.26,"s":0,"v":1},{"t":3.48,"d":0.1,"s":-1,"v":1}],"measured":{"n":11,"rate":2.87,"cv":0.57,"medDur":0.1,"pitch":-1.2,"clip":"horned-owl"}}};
  var VOICE = {"duck-quack":[["level",1.2,{"f0":0,"cent":2095}],["tone",1.2,{"pure":0.39,"lo":0,"hi":0.64,"flat":0.006}]],"duck-greeting":[["level",1.2,{"f0":0,"cent":1097}],["tone",1.2,{"pure":0.4,"lo":0,"hi":0.65,"flat":0.02}]],"duck-lonesome":[["level",1.2,{"f0":0,"cent":1577}],["tone",1.2,{"pure":0.29,"lo":0,"hi":0.54,"flat":0.054}]],"duck-feeding":[["level",1.2,{"f0":0,"cent":1716}],["tone",1.2,{"pure":0.2,"lo":0,"hi":0.45,"flat":0.077}]],"duck-drake":[["level",1.2,{"f0":0,"cent":1781}],["tone",1.2,{"pure":0.34,"lo":0,"hi":0.59,"flat":0.005}]],"duck-black":[["level",1.2,{"f0":475,"cent":1501}],["tone",1.2,{"pure":0.38,"lo":0,"hi":0.63,"flat":0.015}]],"duck-mottled":[["level",1.2,{"f0":0,"cent":2120}],["tone",1.2,{"pure":0.28,"lo":0,"hi":0.53,"flat":0.005}]],"duck-gadwall":[["level",1.2,{"f0":0,"cent":2436}],["tone",1.2,{"pure":0.41,"lo":0,"hi":0.66,"flat":0.061}]],"duck-pintail":[["level",1.2,{"f0":1654,"cent":1619}],["tone",1.2,{"pure":0.8,"lo":0.55,"hi":1,"flat":0.008}]],"wigeon-whistle":[["level",1.2,{"f0":2091,"cent":2144}],["tone",1.2,{"pure":0.61,"lo":0.36,"hi":1,"flat":0.019}]],"teal-gw":[["level",1.2,{"f0":0,"cent":2292}],["tone",1.2,{"pure":0.21,"lo":0,"hi":0.46,"flat":0.086}]],"teal-bw":[["level",1.2,{"f0":0,"cent":1760}],["tone",1.2,{"pure":0.22,"lo":0,"hi":0.47,"flat":0.196}]],"teal-bwhen":[["level",1.2,{"f0":0,"cent":2456}],["tone",1.2,{"pure":0.27,"lo":0,"hi":0.52,"flat":0.109}]],"woodduck-squeal":[["level",1.2,{"f0":1390,"cent":1771}],["tone",1.2,{"pure":0.65,"lo":0.4,"hi":1,"flat":0.013}]],"divers-scaup":[["level",1.2,{"f0":1770,"cent":1749}],["tone",1.2,{"pure":0.38,"lo":0,"hi":0.63,"flat":0.006}]],"divers-ringneck":[["level",1.2,{"f0":0,"cent":1650}],["tone",1.2,{"pure":0.44,"lo":0,"hi":0.69,"flat":0.009}]],"divers-redhead":[["level",1.2,{"f0":1806,"cent":1764}],["tone",1.2,{"pure":0.81,"lo":0.56,"hi":1,"flat":0.002}]],"goose-honk":[["level",1.2,{"f0":0,"cent":1234}],["tone",1.2,{"pure":0.39,"lo":0,"hi":0.64,"flat":0.006}]],"goose-cluck":[["level",1.2,{"f0":0,"cent":2347}],["tone",1.2,{"pure":0.62,"lo":0.37,"hi":1,"flat":0.003}]],"goose-double":[["level",1.2,{"f0":0,"cent":1716}],["tone",1.2,{"pure":0.31,"lo":0,"hi":0.56,"flat":0.054}]],"goose-murmur":[["level",1.2,{"f0":0,"cent":1248}],["tone",1.2,{"pure":0.43,"lo":0,"hi":0.68,"flat":0.006}]],"turkey-yelp":[["level",1.2,{"f0":963,"cent":1278}],["tone",1.2,{"pure":0.56,"lo":0.31,"hi":0.81,"flat":0.003}]],"turkey-tree":[["level",1.2,{"f0":1491,"cent":1513}],["tone",1.2,{"pure":0.44,"lo":0,"hi":0.69,"flat":0}]],"turkey-keekee":[["level",1.2,{"f0":1550,"cent":1718}],["tone",1.2,{"pure":0.71,"lo":0.46,"hi":1,"flat":0.001}]],"turkey-cluck":[["level",1.2,{"f0":896,"cent":847}],["tone",1.2,{"pure":0.74,"lo":0.49,"hi":1,"flat":0.001}]],"turkey-purr":[["level",1.2,{"f0":716,"cent":2812}],["tone",1.2,{"pure":0.52,"lo":0.27,"hi":0.77,"flat":0.032}]],"turkey-cluckpurr":[["level",1.2,{"f0":885,"cent":2014}],["tone",1.2,{"pure":0.47,"lo":0.22,"hi":0.72,"flat":0.02}]],"turkey-cutt":[["level",1.2,{"f0":724,"cent":1126}],["tone",1.2,{"pure":0.52,"lo":0.27,"hi":0.77,"flat":0.022}]],"turkey-gobble":[["level",1.2,{"f0":920,"cent":1127}],["tone",1.2,{"pure":0.57,"lo":0.32,"hi":0.82,"flat":0.023}]],"elk-location":[["level",1.2,{"f0":1902,"cent":1834}],["tone",1.2,{"pure":0.67,"lo":0.42,"hi":1,"flat":0.001}]],"elk-bugle":[["level",1.2,{"f0":1944,"cent":1860}],["tone",1.2,{"pure":0.87,"lo":0.62,"hi":1,"flat":0.001}]],"elk-chuckle":[["level",1.2,{"f0":602,"cent":684}],["tone",1.2,{"pure":0.8,"lo":0.55,"hi":1,"flat":0.003}]],"elk-cow":[["level",1.2,{"f0":1251,"cent":1258}],["tone",1.2,{"pure":0.89,"lo":0.64,"hi":1,"flat":0.002}]],"elk-calf":[["level",1.2,{"f0":756,"cent":1607}],["tone",1.2,{"pure":0.58,"lo":0.33,"hi":0.83,"flat":0.002}]],"deer-fawn":[["level",1.2,{"f0":635,"cent":2735}],["tone",1.2,{"pure":0.51,"lo":0.26,"hi":0.76,"flat":0.01}]],"deer-blow":[["level",1.2,{"f0":0,"cent":1221}],["tone",1.2,{"pure":0.46,"lo":0.21,"hi":0.71}]],"moose-cow":[["level",1.2,{"f0":216,"cent":1443}],["tone",1.2,{"pure":0.37,"lo":0,"hi":0.62,"flat":0.037}]],"quail-bobwhite":[["level",1.2,{"f0":2385,"cent":2547}],["tone",1.2,{"pure":0.83,"lo":0.58,"hi":1,"flat":0.007}]],"quail-covey":[["level",1.2,{"f0":1968,"cent":1940}],["tone",1.2,{"pure":0.64,"lo":0.39,"hi":1,"flat":0.001}]],"dove-coo":[["level",1.2,{"f0":499,"cent":499}],["tone",1.2,{"pure":1,"lo":0.75,"hi":1,"flat":0}]],"pred-lone":[["level",1.2,{"f0":560,"cent":786}],["tone",1.2,{"pure":0.84,"lo":0.59,"hi":1,"flat":0.001}]],"pred-howl":[["level",1.2,{"f0":719,"cent":1398}],["tone",1.2,{"pure":0.67,"lo":0.42,"hi":1,"flat":0.003}]],"fox-red":[["level",1.2,{"f0":0,"cent":1270}],["tone",1.2,{"pure":0.49,"lo":0.24,"hi":0.74,"flat":0.002}]],"fox-gray":[["level",1.2,{"f0":947,"cent":1121}],["tone",1.2,{"pure":0.5,"lo":0.25,"hi":0.75,"flat":0.006}]],"loc-owl":[["level",1.2,{"f0":528,"cent":525}],["tone",1.2,{"pure":0.87,"lo":0.62,"hi":1,"flat":0.001}]],"loc-horned":[["level",1.2,{"f0":319,"cent":343}],["tone",1.2,{"pure":0.95,"lo":0.7,"hi":1,"flat":0}]],"loc-crow":[["level",1.2,{"f0":0,"cent":1789}],["tone",1.2,{"pure":0.37,"lo":0,"hi":0.62,"flat":0.046}]]};
  var NEAR = {"duck-quack":["duck-greeting","duck-lonesome","duck-feeding","duck-drake","duck-black","duck-mottled","duck-gadwall","duck-pintail","wigeon-whistle","teal-gw","teal-bwhen","woodduck-squeal","divers-scaup","divers-ringneck","goose-honk","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-keekee","turkey-cutt","turkey-gobble","quail-covey","fox-gray","loc-crow"],"duck-greeting":["duck-quack","duck-lonesome","duck-drake","duck-black","duck-mottled","wigeon-whistle","teal-bw","woodduck-squeal","divers-scaup","goose-double","goose-murmur","turkey-yelp","turkey-keekee","turkey-purr","turkey-cutt","turkey-gobble","deer-blow","quail-covey","pred-lone","pred-howl","fox-gray","loc-crow"],"duck-lonesome":["duck-quack","duck-greeting","duck-drake","duck-black","duck-mottled","teal-bw","teal-bwhen","divers-scaup","goose-honk","goose-double","turkey-keekee","deer-blow","moose-cow","quail-covey","fox-red","fox-gray","loc-crow"],"duck-feeding":["duck-quack","duck-gadwall","turkey-tree","turkey-purr","turkey-cluckpurr","turkey-cutt"],"duck-drake":["duck-quack","duck-greeting","duck-lonesome","duck-black","duck-mottled","duck-pintail","teal-gw","teal-bwhen","woodduck-squeal","divers-scaup","divers-ringneck","goose-honk","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-keekee","turkey-cutt","turkey-gobble","quail-covey","pred-howl","fox-gray","loc-crow"],"duck-black":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-mottled","teal-gw","teal-bw","teal-bwhen","goose-honk","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-keekee","turkey-cluck","turkey-purr","turkey-cluckpurr","turkey-cutt","turkey-gobble","elk-chuckle","elk-calf","deer-blow","moose-cow","quail-covey","pred-howl","fox-gray","loc-crow"],"duck-mottled":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-black","woodduck-squeal","divers-scaup","goose-honk","goose-double","turkey-gobble","elk-location","deer-blow","quail-covey","fox-red","fox-gray","loc-crow"],"duck-gadwall":["duck-quack","duck-feeding","wigeon-whistle","teal-gw","teal-bw","teal-bwhen","divers-scaup","divers-ringneck","divers-redhead","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-tree","turkey-keekee","quail-bobwhite","quail-covey","pred-howl"],"duck-pintail":["duck-quack","duck-drake","woodduck-squeal","divers-scaup","divers-redhead","turkey-yelp","turkey-keekee","turkey-cluck","turkey-cluckpurr","turkey-cutt","elk-location","elk-cow","elk-calf","deer-blow","quail-bobwhite","quail-covey","pred-howl","fox-red","fox-gray"],"wigeon-whistle":["duck-quack","duck-greeting","duck-gadwall","teal-bwhen","divers-scaup","divers-redhead","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-tree","turkey-keekee","turkey-cluck","turkey-cluckpurr","elk-location","elk-bugle","moose-cow","quail-bobwhite","quail-covey","pred-lone","loc-horned"],"teal-gw":["duck-quack","duck-drake","duck-black","duck-gadwall","teal-bw","divers-scaup","divers-ringneck","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-cluckpurr","quail-covey","loc-crow"],"teal-bw":["duck-greeting","duck-lonesome","duck-black","duck-gadwall","teal-gw","teal-bwhen","divers-scaup","divers-ringneck","goose-double","turkey-yelp","turkey-cutt"],"teal-bwhen":["duck-quack","duck-lonesome","duck-drake","duck-black","duck-gadwall","wigeon-whistle","teal-bw","divers-scaup","divers-ringneck","goose-double","goose-murmur","turkey-yelp","turkey-purr","turkey-cluckpurr"],"woodduck-squeal":["duck-quack","duck-greeting","duck-drake","duck-mottled","duck-pintail","divers-scaup","divers-ringneck","divers-redhead","goose-honk","goose-double","goose-murmur","turkey-yelp","elk-location","elk-calf","deer-blow","quail-covey","pred-howl","fox-gray","loc-crow"],"divers-scaup":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-mottled","duck-gadwall","duck-pintail","wigeon-whistle","teal-gw","teal-bw","teal-bwhen","woodduck-squeal","divers-ringneck","goose-double","goose-murmur","turkey-yelp","turkey-keekee","turkey-cluckpurr","quail-covey","pred-howl","loc-crow"],"divers-ringneck":["duck-quack","duck-drake","duck-gadwall","teal-gw","teal-bw","teal-bwhen","woodduck-squeal","divers-scaup","divers-redhead","goose-double","goose-murmur","turkey-yelp","turkey-keekee","turkey-cluckpurr","turkey-cutt","elk-location","elk-bugle","elk-chuckle","quail-bobwhite","quail-covey","pred-howl","loc-crow"],"divers-redhead":["duck-gadwall","duck-pintail","wigeon-whistle","woodduck-squeal","divers-ringneck","goose-cluck","goose-murmur","turkey-yelp","turkey-keekee","turkey-cluck","elk-location","elk-chuckle","elk-calf","quail-bobwhite","quail-covey","pred-howl"],"goose-honk":["duck-quack","duck-lonesome","duck-drake","duck-black","duck-mottled","woodduck-squeal","goose-double","goose-murmur","turkey-purr","elk-calf","deer-blow","quail-covey","pred-howl","fox-red","fox-gray","loc-crow"],"goose-cluck":["duck-quack","duck-drake","duck-black","duck-gadwall","wigeon-whistle","teal-gw","divers-redhead","goose-double","goose-murmur","turkey-yelp","turkey-tree","turkey-keekee","turkey-cluckpurr","elk-calf","quail-bobwhite","quail-covey","pred-howl"],"goose-double":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-black","duck-mottled","duck-gadwall","wigeon-whistle","teal-gw","teal-bw","teal-bwhen","woodduck-squeal","divers-scaup","divers-ringneck","goose-honk","goose-cluck","goose-murmur","turkey-yelp","turkey-cluck","turkey-purr","turkey-cluckpurr","turkey-cutt","elk-location","quail-covey","pred-howl","loc-crow"],"goose-murmur":["duck-quack","duck-greeting","duck-drake","duck-black","duck-gadwall","wigeon-whistle","teal-gw","teal-bwhen","woodduck-squeal","divers-scaup","divers-ringneck","divers-redhead","goose-honk","goose-cluck","goose-double","turkey-yelp","turkey-tree","turkey-keekee","turkey-cluckpurr","turkey-cutt","elk-bugle","elk-chuckle","quail-covey","pred-howl","loc-crow"],"turkey-yelp":["duck-quack","duck-greeting","duck-drake","duck-black","duck-gadwall","duck-pintail","wigeon-whistle","teal-gw","teal-bw","teal-bwhen","woodduck-squeal","divers-scaup","divers-ringneck","divers-redhead","goose-cluck","goose-double","goose-murmur","turkey-keekee","turkey-cluck","turkey-purr","turkey-cluckpurr","turkey-cutt","elk-location","elk-bugle","quail-bobwhite","quail-covey","pred-lone","pred-howl","loc-crow"],"turkey-tree":["duck-feeding","duck-gadwall","wigeon-whistle","goose-cluck","goose-murmur","turkey-purr","turkey-cluckpurr","elk-bugle","elk-chuckle","quail-covey","pred-howl"],"turkey-keekee":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-black","duck-gadwall","duck-pintail","wigeon-whistle","divers-scaup","divers-ringneck","divers-redhead","goose-cluck","goose-murmur","turkey-yelp","turkey-cluck","turkey-purr","turkey-cutt","turkey-gobble","elk-location","elk-bugle","elk-chuckle","elk-calf","quail-bobwhite","pred-lone","pred-howl"],"turkey-cluck":["duck-black","duck-pintail","wigeon-whistle","divers-redhead","goose-double","turkey-yelp","turkey-keekee","turkey-purr","turkey-cluckpurr","turkey-cutt","turkey-gobble","elk-chuckle","elk-cow","deer-blow","quail-bobwhite","quail-covey","pred-lone","pred-howl","fox-gray"],"turkey-purr":["duck-greeting","duck-feeding","duck-black","teal-bwhen","goose-honk","goose-double","turkey-yelp","turkey-tree","turkey-keekee","turkey-cluck","turkey-cutt","turkey-gobble","elk-location","elk-bugle","elk-calf","deer-fawn","quail-covey","pred-lone","pred-howl","fox-red","fox-gray","loc-horned"],"turkey-cluckpurr":["duck-feeding","duck-black","duck-pintail","wigeon-whistle","teal-gw","teal-bwhen","divers-scaup","divers-ringneck","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-tree","turkey-cluck","turkey-cutt","turkey-gobble","elk-chuckle","quail-covey","pred-howl","fox-gray"],"turkey-cutt":["duck-quack","duck-greeting","duck-feeding","duck-drake","duck-black","duck-pintail","teal-bw","divers-ringneck","goose-double","goose-murmur","turkey-yelp","turkey-keekee","turkey-cluck","turkey-purr","turkey-cluckpurr","elk-location","elk-chuckle","elk-calf","moose-cow","pred-lone","pred-howl"],"turkey-gobble":["duck-quack","duck-greeting","duck-drake","duck-black","duck-mottled","turkey-keekee","turkey-cluck","turkey-purr","turkey-cluckpurr","elk-cow","elk-calf","deer-fawn","deer-blow","quail-bobwhite","quail-covey","pred-lone","pred-howl","fox-gray","loc-owl"],"elk-location":["duck-mottled","duck-pintail","wigeon-whistle","woodduck-squeal","divers-ringneck","divers-redhead","goose-double","turkey-yelp","turkey-keekee","turkey-purr","turkey-cutt","elk-bugle","elk-cow","elk-calf","deer-blow","quail-bobwhite","dove-coo","pred-howl","fox-red","fox-gray"],"elk-bugle":["wigeon-whistle","divers-ringneck","goose-murmur","turkey-yelp","turkey-tree","turkey-keekee","turkey-purr","elk-location","elk-calf","quail-bobwhite","quail-covey","pred-howl"],"elk-chuckle":["duck-black","divers-ringneck","divers-redhead","goose-murmur","turkey-tree","turkey-keekee","turkey-cluck","turkey-cluckpurr","turkey-cutt","quail-bobwhite","pred-lone","pred-howl","loc-horned"],"elk-cow":["duck-pintail","turkey-cluck","turkey-gobble","elk-location","elk-calf","deer-fawn","deer-blow","quail-covey","dove-coo","fox-gray"],"elk-calf":["duck-black","duck-pintail","woodduck-squeal","divers-redhead","goose-honk","goose-cluck","turkey-keekee","turkey-purr","turkey-cutt","turkey-gobble","elk-location","elk-bugle","elk-cow","deer-fawn","deer-blow","pred-lone","pred-howl","fox-gray"],"deer-fawn":["turkey-purr","turkey-gobble","elk-cow","elk-calf","deer-blow","quail-covey","pred-howl","fox-gray"],"deer-blow":["duck-greeting","duck-lonesome","duck-black","duck-mottled","duck-pintail","woodduck-squeal","goose-honk","turkey-cluck","turkey-gobble","elk-location","elk-cow","elk-calf","deer-fawn","quail-covey","pred-howl","fox-gray"],"moose-cow":["duck-lonesome","duck-black","wigeon-whistle","turkey-cutt","fox-red"],"quail-bobwhite":["duck-gadwall","duck-pintail","wigeon-whistle","divers-ringneck","divers-redhead","goose-cluck","turkey-yelp","turkey-keekee","turkey-cluck","turkey-gobble","elk-location","elk-bugle","elk-chuckle","quail-covey","pred-howl","fox-gray","loc-horned"],"quail-covey":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-black","duck-mottled","duck-gadwall","duck-pintail","wigeon-whistle","teal-gw","woodduck-squeal","divers-scaup","divers-ringneck","divers-redhead","goose-honk","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-tree","turkey-cluck","turkey-purr","turkey-cluckpurr","turkey-gobble","elk-bugle","elk-cow","deer-fawn","deer-blow","quail-bobwhite","pred-lone","pred-howl","fox-red","fox-gray","loc-crow"],"dove-coo":["elk-location","elk-cow","pred-lone","pred-howl"],"pred-lone":["duck-greeting","wigeon-whistle","turkey-yelp","turkey-keekee","turkey-cluck","turkey-purr","turkey-cutt","turkey-gobble","elk-chuckle","elk-calf","quail-covey","dove-coo","pred-howl","fox-gray","loc-horned"],"pred-howl":["duck-greeting","duck-drake","duck-black","duck-gadwall","duck-pintail","woodduck-squeal","divers-scaup","divers-ringneck","divers-redhead","goose-honk","goose-cluck","goose-double","goose-murmur","turkey-yelp","turkey-tree","turkey-keekee","turkey-cluck","turkey-purr","turkey-cluckpurr","turkey-cutt","turkey-gobble","elk-location","elk-bugle","elk-chuckle","elk-calf","deer-fawn","deer-blow","quail-bobwhite","quail-covey","dove-coo","pred-lone","fox-red","fox-gray","loc-owl","loc-horned","loc-crow"],"fox-red":["duck-lonesome","duck-mottled","duck-pintail","goose-honk","turkey-purr","elk-location","moose-cow","quail-covey","pred-howl"],"fox-gray":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-black","duck-mottled","duck-pintail","woodduck-squeal","goose-honk","turkey-cluck","turkey-purr","turkey-cluckpurr","turkey-gobble","elk-location","elk-cow","elk-calf","deer-fawn","deer-blow","quail-bobwhite","quail-covey","pred-lone","pred-howl"],"loc-owl":["turkey-gobble","pred-howl"],"loc-horned":["wigeon-whistle","turkey-purr","elk-chuckle","quail-bobwhite","pred-lone","pred-howl"],"loc-crow":["duck-quack","duck-greeting","duck-lonesome","duck-drake","duck-black","duck-mottled","teal-gw","woodduck-squeal","divers-scaup","divers-ringneck","goose-honk","goose-double","goose-murmur","turkey-yelp","quail-covey","pred-howl"]};
  /* LEARNED:end */

  /* A run of notes: n of them, `ioi` apart, each `dur` long, the pitch sliding
     `drop` half-steps from first to last and the volume fading by `fade` (0-1). */
  function run(n, ioi, dur, drop, fade, extra) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var k = n > 1 ? i / (n - 1) : 0;
      var q = { t: i * ioi, d: dur, s: -drop * k, v: 1 - (fade || 0) * k };
      if (extra) extra(q, i);
      out.push(q);
    }
    return out;
  }
  function at(times, dur, extra) {
    return times.map(function (t, i) { var q = { t: t, d: typeof dur === "function" ? dur(i) : dur, s: 0, v: 1 }; if (extra) extra(q, i); return q; });
  }

  var groups = [
    { id: "waterfowl", name: "Waterfowl" },
    { id: "turkey", name: "Wild turkey" },
    { id: "biggame", name: "Big game" },
    { id: "upland", name: "Upland birds & doves" },
    { id: "predators", name: "Predators & locators" }
  ];

  var species = [
    {
      id: "duck", group: "waterfowl", icon: "duck", name: "Mallards & puddle ducks", tone: 620,
      tag: "Hen and drake mallard, black duck, mottled duck, gadwall",
      gear: "A hen mallard call. Single-reed calls are louder and have more range but are harder to control; double-reed calls are easier to learn and harder to squeal. Start on a double reed.",
      intro: "Nearly every duck call you will ever blow is a hen mallard's quack, strung together different ways. Get one clean quack, then build. Black ducks, mottled ducks and gadwall answer the same calling, with their own accent.",
      calls: ["duck-quack", "duck-greeting", "duck-lonesome", "duck-feeding", "duck-drake", "duck-black", "duck-mottled", "duck-gadwall"]
    },
    {
      id: "whistlers", group: "waterfowl", icon: "duck", name: "Pintail & wigeon", tone: 1800,
      tag: "Drake whistles",
      gear: "A pintail or wigeon whistle — or a six-in-one whistle that does pintail, wigeon and teal.",
      intro: "Drake pintails and wigeon talk in whistles, not quacks. A few soft whistles mixed with hen calls sound like a relaxed, mixed flock.",
      calls: ["duck-pintail", "wigeon-whistle"]
    },
    {
      id: "teal", group: "waterfowl", icon: "duck", name: "Teal", tone: 2600,
      tag: "Green-wing and blue-wing",
      gear: "A teal whistle (or a six-in-one) for the drakes' peeps; your hen mallard call, pinched high and run fast, for the hens.",
      intro: "Teal are small, fast and talkative. Drakes peep and whistle; hens give quick, high quacks.",
      calls: ["teal-gw", "teal-bw", "teal-bwhen"]
    },
    {
      id: "woodduck", group: "waterfowl", icon: "duck", name: "Wood duck", tone: 1400,
      tag: "The hen's squeal",
      gear: "A wood duck call (a squealer).",
      intro: "Wood ducks don't quack like mallards. The hen's rising squeal is the sound to learn — a flushing wood duck screams it.",
      calls: ["woodduck-squeal"]
    },
    {
      id: "divers", group: "waterfowl", icon: "duck", name: "Diving ducks", tone: 500,
      tag: "Redhead, scaup, ringneck",
      gear: "A diver call (a growler). It makes the rolling 'brrrp' purrs of diving ducks.",
      intro: "Divers sound nothing like mallards: hens purr and growl, and drake redheads meow. Calling divers is mostly short, rolling notes over a big spread.",
      calls: ["divers-scaup", "divers-ringneck", "divers-redhead"]
    },
    {
      id: "goose", group: "waterfowl", icon: "goose", name: "Canada geese", tone: 420,
      tag: "Honk, cluck, double cluck, feeding murmur",
      gear: "A short-reed goose call. It takes two hands: one around the barrel's end to make back-pressure, which is what makes the reed break.",
      intro: "Everything comes from the honk — a low note that breaks over into a high one. A cluck is a short honk; a double cluck is a fast pair; feeding murmur is the low chatter of a happy flock.",
      calls: ["goose-honk", "goose-cluck", "goose-double", "goose-murmur"]
    },
    {
      id: "turkey", group: "turkey", icon: "turkey", name: "Wild turkey", tone: 900,
      tag: "Hen calls, soft calls, cutting, the gobble",
      gear: "A box call or a slate (pot) call is the easiest start. A mouth (diaphragm) call takes practice but leaves your hands free. Every lesson here works on any of them.",
      intro: "Rhythm matters more than tone with turkeys. A yelp with a natural beat beats a pretty yelp with a robotic one.",
      calls: ["turkey-yelp", "turkey-tree", "turkey-keekee", "turkey-cluck", "turkey-purr", "turkey-cluckpurr", "turkey-cutt", "turkey-gobble"]
    },
    {
      id: "elk", group: "biggame", icon: "elk", name: "Elk", tone: 700,
      tag: "Bugles, chuckles, cow and calf mews",
      gear: "A diaphragm call for the mouth, and a bugle tube for bugling. Open-reed cow calls (squeeze-style) are an easy way to start on mews.",
      intro: "Cow calls bring more elk than bugles do. Learn the mew first; save the bugle for when you have it right.",
      calls: ["elk-location", "elk-bugle", "elk-chuckle", "elk-cow", "elk-calf"]
    },
    {
      id: "deer", group: "biggame", icon: "deer", name: "Whitetail", tone: 500,
      tag: "Fawn bawl and the alarm blow",
      gear: "A bleat call (a can, or a tube with an adjustable reed) blown hard for the bawl.",
      intro: "Free recordings of real buck grunts and doe bleats are scarce; these two are the real thing. Deer calling is quiet and sparse — then a long wait.",
      calls: ["deer-fawn", "deer-blow"]
    },
    {
      id: "moose", group: "biggame", icon: "moose", name: "Moose", tone: 330,
      tag: "The cow's call",
      gear: "Your voice through cupped hands, or a birch-bark horn to aim and amplify it.",
      intro: "In the rut, bulls come to a cow's long, nasal moan — usually slowly, and sometimes from a long way off.",
      calls: ["moose-cow"]
    },
    {
      id: "quail", group: "upland", icon: "quail", name: "Bobwhite quail", tone: 1800,
      tag: "Bob-white whistle and covey call",
      gear: "A quail call or whistle — or just your lips.",
      intro: "Spring males whistle 'bob-WHITE'; fall coveys find each other at dawn with the 'koi-lee' covey call. Both are used to locate birds.",
      calls: ["quail-bobwhite", "quail-covey"]
    },
    {
      id: "dove", group: "upland", icon: "dove", name: "Mourning dove", tone: 500,
      tag: "The coo",
      gear: "Cupped hands, like an owl hoot, or a dove call.",
      intro: "Dove calling adds realism to a spread more than it pulls birds in. Soft and slow.",
      calls: ["dove-coo"]
    },
    {
      id: "predator", group: "predators", icon: "predator", name: "Predators", tone: 700,
      tag: "Coyote howls and fox barks",
      gear: "A howler for coyote vocals; your voice or an open-reed call for fox barks.",
      intro: "Predator vocals work best in breeding season, when territory matters. Call, then sit still and watch downwind.",
      calls: ["pred-lone", "pred-howl", "fox-red", "fox-gray"]
    },
    {
      id: "locator", group: "predators", icon: "locator", name: "Locators", tone: 420,
      tag: "Owls and crow — to make a gobbler sound off",
      gear: "Your own voice works for owls. A crow call is cheap and loud. All three are used to make turkeys gobble so you know where they are.",
      intro: "A locator is not meant to bring anything in. It is a loud, sudden sound that makes a tom shock-gobble and give himself away.",
      calls: ["loc-owl", "loc-horned", "loc-crow"]
    }
  ];

  var calls = {

    /* ===================== MALLARDS & PUDDLE DUCKS ===================== */

    "duck-quack": {
      species: "duck", section: "Hen mallard", name: "Basic quack", level: 1, say: "quit",
      what: "The single quack of a hen mallard. Every other duck call is built out of it.",
      when: "Any time. A few lonely quacks on a calm day, or mixed into your other calls.",
      steps: [
        "Hold the call like a cigar between your thumb and first finger. Cup your other hand loosely around the far end.",
        "Seal your lips around the mouthpiece. Keep your teeth off it.",
        "Push the air from your gut — the muscle you use to cough — not from your cheeks.",
        "Say “quit” or “hut” into the call: one short burst.",
        "Stop the air hard at the end of the word. That crisp stop is what makes it a duck and not a kazoo."
      ],
      mistakes: ["Puffing from the cheeks: the quack comes out thin and squeaky.", "Letting the air trail off, so the quack fades out instead of stopping.", "Blowing too hard: the reed locks up or squeals."],
      drill: "Blow five quacks with a one-second pause between each. Make all five sound the same.",
      listen: [{ clip: "mallard-hen-quacks", label: "Real hen mallard quacking" }],
      spec: { kind: "single", maxSec: 10, pitch: [150, 1800], hp: 150,
        score: [["count", 0.6, { range: [2, 12] }], ["length", 1, { range: [0.12, 0.35] }], ["crisp", 1.2, { max: 0.06 }], ["steady", 1, {}], ["pauses", 0.6, { range: [0.3, 2.0] }], ["consistent", 0.8, {}]] },
      ghost: at([0, 1.1, 2.2, 3.3], 0.22)
    },

    "duck-greeting": {
      species: "duck", section: "Hen mallard", name: "Greeting call", level: 2, say: "kanc",
      what: "Five to seven quacks that step down in pitch and volume at an even pace: KANC, KANC, kanc, kanc, kanc.",
      when: "When ducks first notice your spread, or are working at medium range. It says “come on over.”",
      steps: ["Start from a good basic quack — every note in this call is one.", "Blow the first note full and loud.", "Make each note after it a little lower and a little softer, like walking down stairs.", "Keep an even beat, about three notes a second.", "Stop after five to seven notes, then watch the birds."],
      mistakes: ["Rushing: the last notes pile on top of each other.", "Blowing every note at the same pitch, so the call never comes down.", "Not knowing when to stop — eight, nine, ten notes."],
      drill: "Tap your foot. One “kanc” per tap, five or six taps, each a step lower than the one before.",
      listen: [{ clip: "mallard-hen-series", label: "Real hen: the descending series a greeting call copies" }],
      spec: { kind: "series", maxSec: 10, pitch: [150, 1800], hp: 150, groupGap: 0.8,
        score: [["count", 1, { range: [5, 7] }], ["pace", 0.8, { range: [2.4, 4.5] }], ["rhythm", 1.2, { kind: "even", cv: 0.22 }], ["pitch", 1, { dir: "down", range: [1.5, 8], soft: 1 }], ["volume", 0.6, { dir: "down", min: 3 }], ["length", 0.6, { range: [0.08, 0.32] }], ["crisp", 0.7, { max: 0.07 }], ["steady", 0.6, {}]] },
      ghost: run(6, 0.32, 0.2, 5, 0.6)
    },

    "duck-lonesome": {
      species: "duck", section: "Hen mallard", name: "Lonesome hen", level: 2, say: "kaaanc",
      what: "Single, long, nasal quacks with long pauses between: a lone hen looking for company.",
      when: "Calm, bluebird days and wary late-season ducks that have heard every greeting call in the flyway.",
      steps: ["Blow one long, drawn-out quack — about half a second — with a nasal, pleading tone.", "Let it end on its own; don't chop it short.", "Wait one to three seconds.", "Do it again. Lazy and patient wins."],
      mistakes: ["Clipping the quacks short, so it sounds like a nervous basic quack.", "Not waiting long enough between quacks."],
      drill: "Three long quacks, counting “one-Mississippi, two-Mississippi” between each.",
      listen: [{ clip: "mallard-hen-lonesome", label: "Real hen: single quacks, long pauses" }],
      spec: { kind: "single", maxSec: 12, pitch: [150, 1800], hp: 150,
        score: [["count", 0.6, { range: [2, 6] }], ["length", 1.2, { range: [0.3, 0.8] }], ["pauses", 1.2, { range: [1.0, 3.5] }], ["steady", 0.6, {}], ["consistent", 0.6, {}]] },
      ghost: at([0, 2.1, 4.2], 0.5)
    },

    "duck-feeding": {
      species: "duck", section: "Hen mallard", name: "Feeding chatter", level: 4, say: "tikka",
      what: "A fast, rolling chatter — tikka-tikka-tikka — the sound of contented ducks feeding.",
      when: "For ducks that are close in and circling. Mix in a few quacks. Keep it soft, and don't run it forever.",
      steps: ["Start slow: say “tick-it” or “tuk-a” into the call, one at a time, without using your voice.", "Speed up until the syllables roll into each other: tikka-tikka-tikka.", "Keep the air steady and the beat even — a purr of notes, not a stutter.", "Run it for two to four seconds, then break it with a quack or two."],
      mistakes: ["Going for speed before the notes are clean. Slow and clean beats fast and mushy.", "Uneven bursts: chuckle, stop, chuckle — it should roll."],
      drill: "Say “tikka” ten times slowly, then ten times at double speed, then as fast as you can stay even. Do the same on the call.",
      listen: [{ clip: "mallard-feeding", label: "Real mallards feeding" }],
      spec: { kind: "series", maxSec: 8, pitch: [150, 2500], hp: 150, groupGap: 0.45, split: 4, minNote: 0.02,
        score: [["count", 0.6, { range: [10, 80] }], ["pace", 1.4, { range: [7, 14], soft: 2 }], ["rhythm", 1, { kind: "even", cv: 0.5, drift: 0.4 }], ["runLen", 1, { range: [1.5, 7] }], ["length", 0.6, { range: [0.025, 0.11] }], ["volume", 0.4, { dir: "even", max: 8 }]] },
      ghost: run(28, 0.09, 0.055, 0, 0)
    },

    "duck-drake": {
      species: "duck", section: "Drakes", tone: 380, name: "Drake “raeb”", level: 2, say: "raeb",
      what: "The drake mallard's soft, raspy “raeb, raeb.” Lower and buzzier than a hen.",
      when: "Close in, mixed with hen calls, for wary birds. A little drake talk adds realism to a spread.",
      steps: ["Use a drake call, or growl softly into your hen call.", "Unlike a hen quack, voice this one: say “raeb” with a low hum in your throat.", "Short and soft, about half a second apart, a few at a time."],
      mistakes: ["Too loud. Drakes talk quietly.", "Clean tone — a drake is raspy, not musical."],
      drill: "Four soft “raebs,” half a second apart, then silence.",
      listen: [{ clip: "mallard-drake", label: "Real drake mallard" }],
      spec: { kind: "single", maxSec: 8, pitch: [120, 1500], hp: 120,
        score: [["count", 0.6, { range: [2, 12] }], ["length", 1, { range: [0.08, 0.36] }], ["pauses", 1, { range: [0.25, 1.2] }], ["consistent", 0.6, {}]] },
      ghost: at([0, 0.7, 1.4, 2.1], 0.18)
    },

    "duck-black": {
      species: "duck", section: "Other puddle ducks", name: "Black duck hen", level: 2, say: "kanc",
      what: "A black duck hen's descending run of quacks — like a mallard hen's, a little lower and coarser.",
      when: "Black ducks answer mallard calling. On eastern marshes and in timber, a slightly lower, rougher version sounds right.",
      steps: ["Start from your greeting call.", "Drop the pitch a touch: push from lower in your chest and close your hand a little more.", "Four or five quacks, falling and fading, then stop."],
      mistakes: ["High, clean quacks — black ducks are coarser than mallards.", "Too many notes."],
      drill: "Blow a greeting call, then the same thing again a step lower and rougher.",
      listen: [{ clip: "blackduck-hen", label: "Real black duck hen" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [150, 1800], hp: 150, groupGap: 0.8 }
    },

    "duck-mottled": {
      species: "duck", section: "Other puddle ducks", name: "Mottled duck hen", level: 2, say: "kak",
      what: "A mottled duck hen's quacks — mallard-like, a little shorter and sharper.",
      when: "Gulf Coast marshes, where mottled ducks live year-round. Mallard calling works; keep it short.",
      steps: ["Use your hen mallard call.", "Blow short, sharp single quacks with a clean stop.", "A few at a time, with space between."],
      mistakes: ["Long, drawn-out quacks.", "Calling nonstop."],
      drill: "Four sharp quacks, a second apart.",
      listen: [{ clip: "mottled-hen", label: "Real mottled duck hen" }],
      learn: { kind: "single", extra: [["crisp", 0.8, { max: 0.07 }]] },
      spec: { kind: "single", maxSec: 8, pitch: [150, 1800], hp: 150 }
    },

    "duck-gadwall": {
      species: "duck", section: "Other puddle ducks", name: "Gadwall talk", level: 3, say: "kak-kak / nheck",
      what: "Gadwall chatter: the hen's quick, nasal “kak-kak” and the drake's short, low “nheck” burp.",
      when: "Big marshes and reservoirs where gadwall are using. Soft gadwall talk mixed with hen mallard calls is a confidence call.",
      steps: ["Hen: on a mallard call, short nasal quacks, quicker and more clipped than a mallard's.", "Drake: a short, low burp — say “nheck” into the call, or use a drake call.", "Mix a few of each, softly."],
      mistakes: ["Loud, long hail-style notes.", "Leaving out the drake: the burp is what says gadwall."],
      drill: "Kak-kak-kak, pause, nheck, nheck.",
      listen: [{ clip: "gadwall-calls", label: "Real gadwall calling" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [150, 3000], hp: 200, groupGap: 0.6 }
    },

    /* ========================= PINTAIL & WIGEON ======================== */

    "duck-pintail": {
      species: "whistlers", tone: 1800, name: "Pintail whistle", level: 3, say: "prrip",
      what: "The drake pintail's rolling whistle — “prrip, prrip” — high and trilled.",
      when: "Where pintails (and wigeon) are using. Mixed with a few hen quacks, it's a confidence call.",
      steps: ["Use a pintail or six-in-one whistle.", "Roll your tongue (or flutter your throat) while blowing a short burst: “prrrip.”", "Two or three whistles, a beat apart, then quiet."],
      mistakes: ["A straight, plain whistle with no roll.", "Overdoing it. A few whistles go a long way."],
      drill: "Practice the roll with no whistle: a rolled “prrr” on your tongue. Then add the whistle.",
      listen: [{ clip: "pintail-drake", label: "Real drake pintail" }],
      spec: { kind: "single", maxSec: 8, pitch: [500, 4000], hp: 400,
        score: [["count", 0.6, { range: [2, 8] }], ["length", 1, { range: [0.08, 0.4] }], ["pauses", 0.8, { range: [0.2, 1.5] }]] },
      ghost: at([0, 0.7, 1.4], 0.2)
    },

    "wigeon-whistle": {
      species: "whistlers", tone: 1600, name: "Wigeon whistle", level: 2, say: "whi-WHEE-whew",
      what: "The drake wigeon's whistle — “whi-WHEE-whew,” the middle note highest — run together when a flock talks.",
      when: "Wigeon flocks, often mixed with pintail and gadwall. Whistles carry and say “feeding birds here.”",
      steps: ["Use a wigeon whistle or a six-in-one.", "Three quick notes: a short one, a high stressed one, a falling one.", "A few in a row, then quiet."],
      mistakes: ["One long whistle — it needs the three-part shape.", "Blowing hard enough that it shrieks."],
      drill: "Whistle “whi-WHEE-whew” with your lips first, then on the call.",
      listen: [{ clip: "wigeon-whistles", label: "Real drake wigeon whistling" }],
      learn: { kind: "series", count: [3, 24], skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [400, 4000], hp: 300, groupGap: 0.6 }
    },

    /* =============================== TEAL ============================== */

    "teal-gw": {
      species: "teal", tone: 2800, name: "Green-wing teal peep", level: 2, say: "crick",
      what: "The drake green-winged teal's short, high “crick” whistle, repeated at a steady beat.",
      when: "Early season and wherever green-wings are working. A steady run of peeps sounds like a happy flock.",
      steps: ["Use a teal or six-in-one whistle.", "Short, sharp peeps — say “tit” into the whistle.", "Keep a steady rhythm, two or three a second."],
      mistakes: ["Long whistles instead of short peeps.", "Uneven, frantic bursts."],
      drill: "Ten short peeps to a steady beat.",
      listen: [{ clip: "gwteal-peeps", label: "Real drake green-winged teal" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [800, 5000], hp: 400, groupGap: 0.9 }
    },

    "teal-bw": {
      species: "teal", tone: 3000, name: "Blue-wing teal peep", level: 2, say: "pseep",
      what: "The drake blue-winged teal's thin, high “pseep,” a few at a time.",
      when: "September teal season. A few peeps between hen calls.",
      steps: ["Use a teal whistle.", "Blow a thin, high “pseep” — a little longer than a green-wing's crick.", "One or two, a beat apart, then wait."],
      mistakes: ["Too low: blue-wing peeps are thin and high.", "Overdoing it."],
      drill: "Three “pseeps,” a second apart.",
      listen: [{ clip: "bwteal-peeps", label: "Real drake blue-winged teal" }],
      learn: { kind: "single" },
      spec: { kind: "single", maxSec: 8, pitch: [800, 5000], hp: 400 }
    },

    "teal-bwhen": {
      species: "teal", tone: 900, name: "Blue-wing teal hen", level: 2, say: "kak",
      what: "The blue-winged teal hen's quick, high, descending run of quacks — a fast, small-duck greeting.",
      when: "Teal season: on a mallard call, run your greeting call faster and higher.",
      steps: ["Use your hen mallard call, pinched higher.", "Hit the first note, then rattle off quick, short, falling quacks.", "Five to seven notes in about a second and a half."],
      mistakes: ["Mallard-slow — teal are quick.", "Low, full quacks."],
      drill: "Your greeting call, twice as fast and a step higher.",
      listen: [{ clip: "bwteal-hen", label: "Real blue-winged teal hen" }],
      learn: { kind: "series" },
      spec: { kind: "series", maxSec: 8, pitch: [200, 2500], hp: 200, groupGap: 0.6 }
    },

    /* ============================ WOOD DUCK ============================ */

    "woodduck-squeal": {
      species: "woodduck", tone: 1400, name: "Hen squeal", level: 2, say: "oo-EEK",
      what: "The hen wood duck's squealing “oo-EEK,” several in a row when she flushes.",
      when: "Timber, creeks and beaver ponds at first light. Soft squeals pull woodies into a timber hole.",
      steps: ["Use a wood duck squealer call.", "Start low (“oo”) and slide sharply up into the squeal (“EEK”).", "Two to five squeals, then quiet."],
      mistakes: ["No rise: it has to sweep up.", "Calling too much — woodies are wary."],
      drill: "Say “oo-EEK” out loud with a sharp rise, then do it on the call.",
      listen: [{ clip: "woodduck-squeals", label: "Real hen wood duck flushing" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [300, 4500], hp: 300, groupGap: 0.9 }
    },

    /* =========================== DIVING DUCKS ========================== */

    "divers-scaup": {
      species: "divers", name: "Scaup growl", level: 2, say: "brrrp",
      what: "The hen scaup's rough, rolling “brrrp” — the classic diver growl.",
      when: "Bluebill water: open bays and big lakes. Short runs of growls over the decoys.",
      steps: ["Use a diver call (a growler), or roll your tongue on a duck call.", "Make a rough “brrrp” — a rolled R with air behind it.", "Short growls, a beat apart, three to eight in a run."],
      mistakes: ["A clean quack: divers growl, they don't quack.", "One endless growl."],
      drill: "Roll your Rs out loud: “brrrp, brrrp, brrrp.”",
      listen: [{ clip: "scaup-growls", label: "Real hen scaup" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [150, 2500], hp: 200, groupGap: 0.9 }
    },

    "divers-ringneck": {
      species: "divers", name: "Ringneck hen", level: 3, say: "kerp",
      what: "The ring-necked duck hen's growly “kerp,” run together at a steady clip.",
      when: "Timber ponds and marshes where ringnecks drop in. Same diver call as for scaup.",
      steps: ["Diver call or growler.", "Short, rough notes: “kerp-kerp-kerp,” about three a second.", "Keep each note the same."],
      mistakes: ["Too slow and spaced out.", "Smooth notes instead of rough ones."],
      drill: "Eight “kerps” to a steady beat.",
      listen: [{ clip: "ringneck-hen", label: "Real ring-necked duck hen" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [150, 2500], hp: 200, groupGap: 0.8 }
    },

    "divers-redhead": {
      species: "divers", tone: 2100, name: "Redhead drake meow", level: 3, say: "whee-ow",
      what: "The drake redhead's cat-like “whee-ow,” rising and then curling down.",
      when: "Big open water where redheads raft up, mixed with diver growls.",
      steps: ["Use a diver call or a redhead call.", "Blow a nasal, catty “whee-ow”: up, then curling down.", "A few, spaced out."],
      mistakes: ["A quack instead of a meow.", "Too fast."],
      drill: "Say “meow” through your nose, then on the call.",
      listen: [{ clip: "redhead-meows", label: "Real drake redhead" }],
      learn: { kind: "single" },
      spec: { kind: "single", maxSec: 8, pitch: [300, 4000], hp: 400 }
    },

    /* ============================== GEESE ============================== */

    "goose-honk": {
      species: "goose", name: "Honk", level: 1, say: "her-onk",
      what: "The Canada goose's basic two-part honk: a low “her” that breaks over into a high “onk.”",
      when: "To get geese's attention at a distance, and as the base of every other goose call.",
      steps: ["Wrap your hand around the end of the call so it makes back-pressure. On a short reed, that's what makes it break.", "Push air from your gut and say a low “her.”", "Let the pressure build until the reed snaps over into a high “onk.” Some callers think “ga-whit.”", "Add a little growl from your throat for gravel. Clean air alone sounds plastic.", "Cut each honk off clean."],
      mistakes: ["No break: one flat note. Close your hand more for back-pressure.", "Pushing more air instead of more pressure. Pressure makes it break, not volume.", "Notes that trail off instead of ending."],
      drill: "Five honks, slow, a second apart. Listen for the snap from low to high in every one.",
      listen: [{ clip: "goose-honks", label: "Real Canada goose honks" }],
      spec: { kind: "single", maxSec: 10, pitch: [150, 2500], hp: 150, split: 8,
        score: [["count", 0.5, { range: [2, 8] }], ["breakUp", 1.5, { jump: 4 }], ["length", 0.8, { range: [0.12, 0.6] }], ["crisp", 0.8, { max: 0.08 }], ["pauses", 0.6, { range: [0.25, 2] }]] },
      ghost: at([0, 1.0, 2.0], 0.32, function (q) { q.path = [[0, 0], [0.4, 0], [0.45, 9], [1, 9]]; })
    },

    "goose-cluck": {
      species: "goose", name: "Cluck", level: 2, say: "hut",
      what: "A short, fast honk — “hut” — often in quick runs. Excited geese cluck.",
      when: "When geese are working your spread. Clucks in rhythm sound like a happy flock.",
      steps: ["Start from your honk, then cut it to a fraction of the length: “hut.”", "Keep the break — even a short cluck snaps from low to high.", "String several together in a steady rhythm."],
      mistakes: ["Clucks so short the break disappears.", "Running them together into a mush."],
      drill: "Eight clucks in a steady beat, about four a second.",
      listen: [{ clip: "goose-clucks", label: "Real Canada geese: quick, short clucks" }],
      spec: { kind: "series", maxSec: 8, pitch: [150, 2500], hp: 150, groupGap: 0.6,
        score: [["count", 0.8, { range: [3, 20] }], ["length", 1, { range: [0.05, 0.2] }], ["pace", 1, { range: [2.5, 7] }], ["crisp", 0.8, { max: 0.06 }], ["breakUp", 0.8, { jump: 3, need: 0.25 }]] },
      ghost: run(8, 0.24, 0.1, 0, 0, function (q) { q.path = [[0, 0], [0.4, 0], [0.5, 5], [1, 5]]; })
    },

    "goose-double": {
      species: "goose", name: "Double cluck", level: 3, say: "ga-whit",
      what: "Quick pairs of notes — “ga-whit, ga-whit” — the rhythm of a happy, feeding flock.",
      when: "Geese close in and committed. It's the sound of geese on the ground feeding.",
      steps: ["Say “ga-whit” into the call: the “ga” low, the “whit” high and sharp.", "Keep the two halves tight together, then a short beat before the next pair.", "Run several pairs in a row — fast and rolling for a feeding flock, or a beat between pairs like the geese in the recording."],
      mistakes: ["Pairs that blur into single notes.", "Losing the rhythm as you speed up."],
      drill: "Say “ga-whit ga-whit ga-whit” out loud in a steady rhythm, then on the call.",
      listen: [{ clip: "goose-pairs", label: "Real Canada geese calling in pairs, a beat apart" }],
      spec: { kind: "series", maxSec: 8, pitch: [150, 2500], hp: 150, groupGap: 1.2, split: 5,
        score: [["count", 0.8, { range: [4, 20] }], ["pace", 1, { range: [1.6, 10] }], ["length", 0.8, { range: [0.05, 0.28] }], ["pairs", 1.2, {}], ["crisp", 0.6, { max: 0.06 }]] },
      ghost: (function () { var out = [], t = 0; for (var i = 0; i < 5; i++) { out.push({ t: t, d: 0.08, s: 0, v: 1 }); out.push({ t: t + 0.12, d: 0.08, s: 4, v: 1 }); t += 0.36; } return out; })()
    },

    "goose-murmur": {
      species: "goose", name: "Feeding murmur", level: 3, say: "gut-gut",
      what: "The low, busy chatter of geese feeding: short grunts and clucks run together.",
      when: "Geese close in and committed, or on the ground. It says “we're eating, it's safe.”",
      steps: ["Open your hand a little and blow short, low grunts: “gut-gut-gut.”", "Mix in soft clucks. Keep it busy but quiet.", "Run it for several seconds without stopping."],
      mistakes: ["Loud honks: feeding talk is soft.", "Stopping and starting. It should roll along."],
      drill: "Mutter “gut-gut-gut-gut” fast and low, then do it on the call.",
      listen: [{ clip: "goose-murmur", label: "Real Canada geese feeding" }],
      learn: { kind: "series", count: [6, 40], skip: ["pitch", "rhythm"] },
      spec: { kind: "series", maxSec: 10, pitch: [150, 2500], hp: 150, groupGap: 0.8 }
    },

    /* ============================== TURKEY ============================= */

    "turkey-yelp": {
      species: "turkey", section: "Hen calls", name: "Plain yelp", level: 1, say: "kee-yuk",
      what: "A run of four to eight even notes, each rolling from high to low: kee-yuk, kee-yuk, kee-yuk.",
      when: "The all-purpose turkey call: to say “I'm here,” to strike a gobbler, and to bring him the last hundred yards.",
      steps: ["Box call: hold the box still in one hand and draw the lid across the lip in short, even strokes. Slate: draw small ovals with the striker.", "Mouth call: seat it on the roof of your mouth, tongue lightly against it, and say “chirp-chalk” — the “chirp” high, the “chalk” dropping low.", "Every note has to roll over from high to low.", "Four to eight notes at a steady, unhurried beat."],
      mistakes: ["Notes that stay on one pitch — no roll from high to low.", "Machine-gun speed. A hen's yelp has a relaxed beat.", "Uneven spacing that sounds like a person fumbling a call."],
      drill: "Say “kee-yuk” out loud six times to a slow walking beat, then copy it on the call.",
      listen: [{ clip: "turkey-yelps", label: "Real wild turkeys yelping" }],
      spec: { kind: "series", maxSec: 10, pitch: [250, 3500], hp: 250, groupGap: 0.7,
        score: [["count", 1, { range: [4, 9] }], ["pace", 1, { range: [2.2, 5] }], ["rhythm", 1.2, { kind: "even", cv: 0.22 }], ["breakDown", 1.2, { drop: 2 }], ["length", 0.6, { range: [0.08, 0.32] }]] },
      ghost: run(6, 0.32, 0.18, 0, 0.2, function (q) { q.path = [[0, 6], [0.35, 6], [0.5, 0], [1, 0]]; })
    },

    "turkey-tree": {
      species: "turkey", section: "Hen calls", name: "Tree yelp", level: 2, say: "kee-yuk (soft)",
      what: "Soft, muffled yelps from a turkey still on the roost, a few notes at a time.",
      when: "At first light, before birds fly down. Quiet tree yelps say “a hen is roosted here.”",
      steps: ["Box, slate or mouth call — very soft.", "Muffle the sound: cup a hand over the call or turn away.", "A short run of quiet yelps, then wait."],
      mistakes: ["Calling loud from the roost.", "Long runs: tree calling is brief."],
      drill: "Your yelp at a whisper, a few notes.",
      listen: [{ clip: "turkey-tree", label: "Real turkey tree calling" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 10, pitch: [250, 2500], hp: 250, lp: 2200, groupGap: 0.9 }
    },

    "turkey-keekee": {
      species: "turkey", section: "Hen calls", name: "Kee-kee (lost call)", level: 3, say: "kee-kee-kee",
      what: "The high, whistled “kee-kee-kee” of a young turkey that has lost its flock.",
      when: "Fall and winter, especially after a flock has been broken up.",
      steps: ["Mouth call: whistle “kee” notes over the reed, or use a kee-kee whistle.", "Three to six high whistles in a quick run.", "Often finished with a few yelps — the “kee-kee run.”"],
      mistakes: ["Notes too low — it's a whistle.", "Too slow."],
      drill: "Whistle “kee-kee-kee” through your teeth.",
      listen: [{ clip: "turkey-keekee", label: "Real turkeys at the roost: whistled kee notes" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [800, 4500], hp: 600, groupGap: 0.6 }
    },

    "turkey-cluck": {
      species: "turkey", section: "Soft calls", name: "Cluck", level: 1, say: "puk",
      what: "A single short, sharp “puk.” Turkeys cluck to keep in touch.",
      when: "Between yelps, or on its own to a bird that is close. Soft clucks say everything is fine.",
      steps: ["Box call: pop the lid off the lip in one short, sharp stroke.", "Mouth call: say “puk” with a quick burst of air, like a mini-cough.", "One at a time, with a pause between each."],
      mistakes: ["Clucks that drag out into a yelp.", "Too fast. Spaced clucks sound content; rapid ones sound alarmed."],
      drill: "Five clucks, a second or two apart. Sharp start, sharp stop.",
      listen: [{ clip: "turkey-clucks", label: "Real hen clucking" }],
      spec: { kind: "single", maxSec: 10, pitch: [250, 3500], hp: 250,
        score: [["count", 0.5, { range: [2, 8] }], ["length", 1.2, { range: [0.03, 0.13] }], ["crisp", 1, { max: 0.08 }], ["pauses", 1, { range: [0.25, 2.5] }]] },
      ghost: at([0, 0.9, 1.8, 2.7], 0.07, function (q) { q.path = [[0, 3], [1, 0]]; })
    },

    "turkey-purr": {
      species: "turkey", section: "Soft calls", name: "Purr", level: 2, say: "prrrr",
      what: "A soft, rolling “prrrr”: a relaxed, feeding bird.",
      when: "Close work. It calms a gobbler that's hung up out of range.",
      steps: ["Box call: hold the lid lightly and drag it slowly across the lip so it skips and rolls.", "Mouth call: flutter your lips or roll the back of your throat while blowing gently.", "Soft rolls, a second or so each, with pauses."],
      mistakes: ["A smooth note with no roll.", "Too loud: a purr is meant for a bird nearby."],
      drill: "Three soft purrs with a pause between.",
      listen: [{ clip: "turkey-purr", label: "Real turkeys purring" }],
      learn: { kind: "single", extra: [["rolling", 1.2, { min: 0.1 }]] },
      spec: { kind: "single", maxSec: 10, pitch: [250, 3500], hp: 200, split: 0, bridge: 0.06, minNote: 0.15 }
    },

    "turkey-cluckpurr": {
      species: "turkey", section: "Soft calls", name: "Cluck and purr", level: 2, say: "puk… prrrr",
      what: "Soft clucks with rolling purrs between: the sound of content, feeding turkeys.",
      when: "Close work, with a gobbler hung up or a flock feeding toward you.",
      steps: ["A soft cluck.", "A short, rolling purr.", "Mix them loosely and softly for several seconds."],
      mistakes: ["Too loud.", "Forgetting the roll in the purr."],
      drill: "Cluck, purr, cluck-cluck, purr — at half volume.",
      listen: [{ clip: "turkey-cluckpurr", label: "Real turkeys clucking and purring" }],
      learn: { kind: "single", count: [3, 30], skip: ["pauses"] },
      spec: { kind: "single", maxSec: 10, pitch: [250, 3500], hp: 200 }
    },

    "turkey-cutt": {
      species: "turkey", section: "Aggressive", name: "Cutting", level: 3, say: "puk-puk-puka",
      what: "Loud, sharp, uneven clucks — “puk, puk-puka, puk” — an excited, fired-up bird.",
      when: "To strike a gobbler that won't answer yelps, or to fire up one that's gobbling.",
      steps: ["Start from a sharp cluck.", "Throw them out in uneven bursts: two quick, a pause, three quick, one.", "Make them loud. Cutting is excited."],
      mistakes: ["Too even. Cutting is erratic, not a metronome.", "Notes that blur into yelps."],
      drill: "Say “puk, puk-puka, puk, puk-puk” out loud with an uneven rhythm, then copy it.",
      listen: [{ clip: "turkey-cutts", label: "A real agitated turkey: sharp clucks in an uneven run" }],
      spec: { kind: "series", maxSec: 8, pitch: [250, 3500], hp: 250, groupGap: 0.7,
        score: [["count", 0.8, { range: [4, 14] }], ["length", 1, { range: [0.03, 0.13] }], ["rhythm", 1.2, { kind: "erratic", cv: 0.28 }], ["pace", 0.8, { range: [3, 9] }], ["crisp", 0.8, { max: 0.12 }]] },
      ghost: at([0, 0.14, 0.42, 0.53, 0.64, 1.0, 1.12, 1.5], 0.06)
    },

    "turkey-gobble": {
      species: "turkey", section: "Gobbler", name: "Gobble", level: 3, say: "gil-obble-obble",
      what: "The gobbler's rattling, rolling gobble — about a second long.",
      when: "As a locator, or to challenge a tom. Use it with care: a gobble can draw other hunters.",
      steps: ["Use a gobble tube (shaker): shake it hard and fast.", "Or a box call: hold the lid against the box and shake it.", "One rattling burst, about a second long."],
      mistakes: ["Too slow and choppy.", "Gobbling where other hunters may be close. Safety first."],
      drill: "One sharp, rattling second of gobble, then silence.",
      listen: [{ clip: "turkey-gobble", label: "Real gobbler" }],
      learn: { kind: "single", long: true, count: [1, 3], extra: [["rolling", 1, { min: 0.08 }]] },
      spec: { kind: "single", maxSec: 8, pitch: [200, 3500], hp: 200, split: 0, bridge: 0.12 }
    },

    /* =============================== ELK =============================== */

    "elk-location": {
      species: "elk", section: "Bulls", tone: 520, name: "Location bugle", level: 2, say: "aaa-EEEE-uh",
      what: "A clean bull bugle with no grunts after it: a low start, a climb to a high whistle, a drop.",
      when: "To find where bulls are: bugle, then listen hard for answers. Early and late in the day.",
      steps: ["Diaphragm call in your mouth, bugle tube to your lips.", "Start low and growly from your chest.", "Increase tongue pressure to climb, up into a high, clear whistle.", "Hold the top for a second, then let it drop off. No grunts — then listen."],
      mistakes: ["Not climbing high enough: it never reaches the whistle.", "Cracking or wavering at the top."],
      drill: "Hum low and slide up as high as you can, hold it, drop it. That's the shape.",
      listen: [{ clip: "elk-location", label: "Real bull elk bugling" }],
      learn: { kind: "single", long: true, count: [1, 3], extra: [["riseFall", 1.4, { climb: 6, drop: 2 }]] },
      spec: { kind: "single", maxSec: 12, pitch: [90, 3200], hp: 120, split: 0, bridge: 0.3 }
    },

    "elk-bugle": {
      species: "elk", section: "Bulls", tone: 480, name: "Challenge bugle", level: 3, say: "aaa-EEEE-uh, uh-uh-uh",
      what: "A bull's challenge: a bugle that climbs to a high whistle and drops away, then deep grunts.",
      when: "In the rut, on a bull that's answering but won't come. It says “I'm here for your cows.” Use it sparingly.",
      steps: ["Diaphragm call in your mouth, bugle tube to your lips.", "Start low and growly, climb to a high, clear whistle.", "Hold the top for a second or two, then drop off the end.", "Finish with a few deep grunts — “uh-uh-uh” — from your gut."],
      mistakes: ["Not climbing high enough: it never reaches the whistle.", "Ending at the top instead of dropping off.", "Weak, high grunts — they come from the belly."],
      drill: "Hum low, slide up, hold, drop — then three hard grunts.",
      listen: [{ clip: "elk-bugle", label: "Real bull elk: bugle, then grunts" }],
      spec: { kind: "single", maxSec: 12, pitch: [90, 3200], hp: 80, split: 0, bridge: 0.3, groupGap: 1.2,
        score: [["holdLen", 1, { range: [1.2, 4.5] }], ["riseFall", 1.6, { climb: 8, drop: 3 }]] },
      ghost: at([0], 2.8, function (q) { q.path = [[0, 0], [0.25, 4], [0.32, 14], [0.8, 14], [0.92, 6], [1, 2]]; })
    },

    "elk-chuckle": {
      species: "elk", section: "Bulls", tone: 220, name: "Chuckle (glug)", level: 3, say: "uh-uh-uh",
      what: "The bull's deep, rapid grunts — “uh-uh-uh-uh” — often right after a bugle.",
      when: "Close to a bull, after your bugle, to sound like a worked-up herd bull.",
      steps: ["Diaphragm call out, or use a grunt tube.", "Push short bursts of air from your gut and say “uh” deep in your chest.", "A fast run of five to ten grunts."],
      mistakes: ["Too high.", "Too slow: chuckles come fast."],
      drill: "Grunt “uh-uh-uh-uh” from your belly, fast.",
      listen: [{ clip: "elk-chuckle", label: "Real bull elk chuckling (glugs)" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 8, pitch: [80, 1500], hp: 120, groupGap: 0.8 }
    },

    "elk-cow": {
      species: "elk", section: "Cows & calves", tone: 1400, name: "Cow mew", level: 1, say: "eee-uh",
      what: "A cow elk's nasal mew — “eee-uh” — about a second long.",
      when: "The most useful sound in elk hunting: to calm elk, to stop a walking bull, and to pull bulls to you in the rut.",
      steps: ["Diaphragm call on the roof of your mouth, tongue lightly on the latex.", "Start with a little more tongue pressure for “eee,” then ease off toward “uh.”", "Keep it nasal and a little whiny.", "Space your mews out, a few seconds apart."],
      mistakes: ["Squeaky, thin mews from too much tongue pressure — that's a calf.", "Chirping them too short."],
      drill: "Say “eee-uh” out loud with a whine, then three mews on the call, a few seconds apart.",
      listen: [{ clip: "elk-cow-mew", label: "Real cow elk mews (bulls bugle behind)" }],
      learn: { kind: "single", long: true, count: [1, 4] },
      spec: { kind: "single", maxSec: 12, pitch: [400, 3000], hp: 400, split: 9 }
    },

    "elk-calf": {
      species: "elk", section: "Cows & calves", tone: 1100, name: "Calf mew (lost calf)", level: 2, say: "eee-uh (high)",
      what: "A calf's higher, whinier mew that slides down at the end — the lost-calf call.",
      when: "Early season, and to bring cows (and the bulls with them) looking for a calf.",
      steps: ["Diaphragm call with more tongue pressure than a cow mew.", "Higher and thinner, with a whine, sliding down at the end.", "Long mews, spaced out, a few at a time."],
      mistakes: ["Cow-low: calves are higher.", "Short chirps instead of long mews."],
      drill: "Your cow mew, a step higher, longer and whinier.",
      listen: [{ clip: "elk-calf-mew", label: "Real elk calf calling" }],
      learn: { kind: "single", long: true, count: [1, 6], extra: [["breakDown", 1, { drop: 1, label: "Slides down" }]] },
      spec: { kind: "single", maxSec: 12, pitch: [250, 3000], hp: 150, split: 9 }
    },

    /* ============================ WHITETAIL ============================ */

    "deer-fawn": {
      species: "deer", tone: 900, name: "Fawn bawl (distress)", level: 2, say: "maaa!",
      what: "A fawn in distress: a loud, wavering bawl that falls in pitch.",
      when: "Does come to it fast in late spring and summer; predator hunters use it for coyotes too.",
      steps: ["Use a fawn-distress or bleat call, blown hard.", "A loud, desperate “maaa” that cracks and falls.", "A few bawls in a row, then wait."],
      mistakes: ["Too soft.", "One flat note — let it break and fall."],
      drill: "Three loud, falling bawls.",
      listen: [{ clip: "deer-fawn", label: "Real whitetail fawn in distress" }],
      learn: { kind: "single", long: true, count: [1, 4], extra: [["breakDown", 1, { drop: 1, label: "Falls" }]] },
      spec: { kind: "single", maxSec: 10, pitch: [300, 3500], hp: 300, split: 9 }
    },

    "deer-blow": {
      species: "deer", tone: 400, name: "Alarm blow (snort)", level: 1, say: "pfff!",
      what: "The sharp, explosive snort a whitetail blows when something is wrong. Know it when you hear it.",
      when: "Mostly to recognize: a blowing deer has spotted, smelled or heard you. Some hunters blow back to stop a deer or calm it.",
      steps: ["Blow a hard burst of air through your nose, or use a snort call.", "One sharp “pfff,” then another a few seconds later."],
      mistakes: ["Using it to call deer in — it's an alarm, not an invitation."],
      drill: "One sharp blow, wait, another.",
      listen: [{ clip: "deer-blow", label: "Real whitetail (Coues) blowing" }],
      breathy: true,
      learn: { kind: "single", count: [1, 5] },
      spec: { kind: "single", maxSec: 10, pitch: [100, 3000], hp: 120 }
    },

    /* ============================== MOOSE ============================== */

    "moose-cow": {
      species: "moose", tone: 330, name: "Cow call", level: 3, say: "waaaa-uh",
      what: "A cow moose's long, nasal, wavering moan — a few seconds long.",
      when: "The rut, September into October. Bulls come to cow calls, often slowly.",
      steps: ["Cup your hands, or use a birch-bark horn.", "Pinch your nose a little and moan “waaaa” for a few seconds, letting it waver.", "Drop off the end into a lower “uh.”"],
      mistakes: ["Too short.", "Smooth and musical: it's nasal and rough."],
      drill: "A three-second nasal moan, twice.",
      listen: [{ clip: "moose-cow", label: "Real cow moose (U.S. Fish & Wildlife Service)" }],
      learn: { kind: "single", long: true, count: [1, 3] },
      spec: { kind: "single", maxSec: 12, pitch: [200, 2000], hp: 300, split: 12, bridge: 0.25 }
    },

    /* ============================= BOBWHITE ============================ */

    "quail-bobwhite": {
      species: "quail", tone: 1900, name: "Bob-white whistle", level: 1, say: "bob-WHITE",
      what: "The male bobwhite's whistle: a short “bob” and a loud, rising “WHITE!”",
      when: "Spring and summer, to locate males. It's the sound of quail country.",
      steps: ["Whistle with your lips, or use a quail call.", "A short, lower “bob,” then a loud whistle that sweeps up: “WHITE.”", "Repeat every few seconds."],
      mistakes: ["A flat second note: it has to sweep up.", "Rushing the repeats."],
      drill: "Whistle “bob-WHITE” five times, three seconds apart.",
      listen: [{ clip: "quail-bobwhite", label: "Real bobwhite singing" }],
      learn: { kind: "single", count: [2, 12], skip: ["pauses"] },
      spec: { kind: "single", maxSec: 10, pitch: [700, 5000], hp: 600 }
    },

    "quail-covey": {
      species: "quail", tone: 1900, name: "Covey call", level: 2, say: "koi-lee",
      what: "The fall covey call: a ringing “koi-lee,” given at dawn as coveys find each other.",
      when: "Fall and winter mornings, to locate coveys and to gather scattered birds.",
      steps: ["Use a quail call or whistle.", "A two-part whistle: “koi,” then a higher “lee.”", "Space them a second or more apart."],
      mistakes: ["Using the spring “bob-white” in fall.", "Calling too fast."],
      drill: "“Koi-lee” every second and a half, six times.",
      listen: [{ clip: "quail-covey", label: "Real bobwhite covey calls" }],
      learn: { kind: "single", count: [1, 10], skip: ["pauses"] },
      spec: { kind: "single", maxSec: 12, pitch: [700, 5000], hp: 600, bridge: 0.08, split: 0 }
    },

    /* =========================== MOURNING DOVE ========================= */

    "dove-coo": {
      species: "dove", tone: 520, name: "Coo", level: 1, say: "coo-OO-oo-oo-oo",
      what: "The mourning dove's soft cooing song: a rising “coo-OO,” then three or four lower “oo”s.",
      when: "To add realism to a dove spread — more a confidence sound than a way to pull birds in.",
      steps: ["Cup your hands into a hollow and blow across your thumbs (like an owl hoot), or use a dove call.", "A soft “coo,” a rising “OO,” then three falling “oo”s.", "Slow and soft."],
      mistakes: ["Too loud.", "Too fast."],
      drill: "One full song, slowly, three times.",
      listen: [{ clip: "dove-coo", label: "Real mourning dove cooing" }],
      learn: { kind: "series", skip: ["pitch", "rhythm"] },
      spec: { kind: "series", maxSec: 10, pitch: [200, 1500], hp: 200, groupGap: 1.2 }
    },

    /* ============================ PREDATORS ============================ */

    "pred-lone": {
      species: "predator", section: "Coyote", tone: 700, name: "Lone howl", level: 2, say: "owww-ooo",
      what: "A single coyote howl that rises, holds and falls away.",
      when: "To locate coyotes, and in breeding season to pull in a territorial one.",
      steps: ["Howler, or your voice with your hands cupped.", "Start low, slide up smoothly, hold the top.", "Let it fall away at the end."],
      mistakes: ["Too short: a howl is long.", "Choppy pitch instead of a smooth glide."],
      drill: "Hum a siren: low to high, hold, down. Make it last two to three seconds.",
      listen: [{ clip: "coyote-lone", label: "Real coyote howling" }],
      learn: { kind: "single", long: true, count: [1, 4], extra: [["riseFall", 1.2, { climb: 3, drop: 2 }]] },
      spec: { kind: "single", maxSec: 12, pitch: [200, 2500], hp: 250, split: 0, bridge: 0.3 }
    },

    "pred-howl": {
      species: "predator", section: "Coyote", tone: 700, name: "Group howl & yips", level: 3, say: "owww-yip-yip",
      what: "A howl that breaks into a pack's yips and barks — several coyotes at once.",
      when: "To sound like a pack in a coyote's territory. Use it after a lone howl gets no answer.",
      steps: ["Start with a lone howl.", "Break into fast, high yips and short howls, overlapping.", "Keep it ragged and excited for five to ten seconds."],
      mistakes: ["Too tidy: a pack is chaos.", "Running it too long."],
      drill: "A howl, then ten seconds of yips, then silence.",
      listen: [{ clip: "coyote-howl", label: "Real coyotes, Yellowstone" }],
      spec: { kind: "single", maxSec: 12, pitch: [200, 2500], hp: 150, split: 0, bridge: 0.3, groupGap: 1.2,
        score: [["holdLen", 1, { range: [1.5, 8] }], ["riseFall", 0.8, { climb: 2, drop: 2, soft: 2 }]] },
      ghost: at([0], 3.2, function (q) { q.path = [[0, 0], [0.25, 6], [0.7, 7], [1, 1]]; })
    },

    "fox-red": {
      species: "predator", section: "Fox", tone: 900, name: "Red fox bark", level: 2, say: "wow-wow",
      what: "The red fox's hoarse, screaming barks — “wow, wow, wow” — in a run.",
      when: "Winter breeding season: a bark can bring in a territorial fox.",
      steps: ["Your voice or an open-reed predator call.", "Short, hoarse barks with a scream at the start that falls away.", "A run of barks, then wait."],
      mistakes: ["Dog-like woofs.", "Too many in a row."],
      drill: "“Wow-wow-wow” hoarsely, then silence.",
      listen: [{ clip: "fox-red", label: "Real red fox barking" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 12, pitch: [300, 3500], hp: 250, groupGap: 1.5 }
    },

    "fox-gray": {
      species: "predator", section: "Fox", tone: 900, name: "Gray fox bark", level: 3, say: "yap",
      what: "The gray fox's raspy, single yaps, spaced out.",
      when: "Brushy woods in the South and West, where gray foxes live.",
      steps: ["Your voice or a predator call.", "One raspy “yap” at a time.", "A couple of seconds between each."],
      mistakes: ["Running them together.", "Too smooth: it's raspy."],
      drill: "Four yaps, two seconds apart.",
      listen: [{ clip: "fox-gray", label: "Real gray fox" }],
      learn: { kind: "single" },
      spec: { kind: "single", maxSec: 12, pitch: [300, 3500], hp: 250 }
    },

    /* ============================ LOCATORS ============================= */

    "loc-owl": {
      species: "locator", name: "Barred owl", level: 2, say: "who-cooks-for-you",
      what: "“Who cooks for you, who cooks for you-all”: two phrases of hoots, the last note drawn out and falling.",
      when: "At dawn and dusk to make a roosted gobbler shock-gobble — from 100 to 200 yards away, softly at first.",
      steps: ["Cup your hands around your mouth, or use an owl hooter.", "Hoot from your chest: “who cooks for you” — four quick hoots, the third and fourth rising.", "Take a breath, then “who cooks for you-all,” dragging the last “all” out and down.", "Then listen hard."],
      mistakes: ["One long run with no break between phrases.", "Chopping the last note short."],
      drill: "Say the words “who cooks for you, who cooks for you-all” in a deep voice, then hoot the same rhythm.",
      listen: [{ clip: "barred-owl", label: "Real barred owl" }],
      spec: { kind: "series", maxSec: 10, pitch: [150, 1200], hp: 100, groupGap: 1.8, split: 12,
        score: [["count", 1, { range: [7, 11] }], ["phrase", 1.6, {}], ["length", 0.4, { range: [0.1, 1.2] }]] },
      ghost: (function () {
        var t = [0, 0.28, 0.52, 0.72, 1.5, 1.78, 2.02, 2.22, 2.45], d = [0.22, 0.2, 0.16, 0.16, 0.22, 0.2, 0.16, 0.16, 0.7];
        return t.map(function (x, i) { return { t: x, d: d[i], s: [0, 0, 1, 2, 0, 0, 1, 2, 0][i], v: 1, path: i === 8 ? [[0, 1], [0.4, 1], [1, -4]] : null }; });
      })()
    },

    "loc-horned": {
      species: "locator", tone: 420, name: "Great horned owl", level: 2, say: "hoo h'HOO hoo hoo",
      what: "The great horned owl's deep, stuttering hoots: “hoo, h'HOO, hoo, hoo.”",
      when: "Before dawn and at dusk, to make roosted gobblers shock-gobble. Deeper and spookier than a barred owl.",
      steps: ["Cup your hands and hoot from your chest, deep.", "Four to six hoots in the rhythm “hoo, h'HOO, hoo, hoo.”", "Then listen."],
      mistakes: ["Too high: great horned owls are deep.", "Too many hoots."],
      drill: "Say the rhythm, then hoot it.",
      listen: [{ clip: "horned-owl", label: "Real great horned owl" }],
      learn: { kind: "series", skip: ["pitch"] },
      spec: { kind: "series", maxSec: 10, pitch: [150, 1000], hp: 150, groupGap: 1.2, split: 10 }
    },

    "loc-crow": {
      species: "locator", tone: 800, name: "Crow caw", level: 1, say: "caw",
      what: "Loud, harsh caws, three to six in a row, evenly spaced.",
      when: "Mid-morning, when owls are quiet, to make a gobbler sound off.",
      steps: ["Hold the call in your fist and blow hard from your gut.", "Say “caw” — sharp start, harsh tone.", "Three to six caws at an even beat, about two a second, then listen."],
      mistakes: ["Notes too long and smooth: a crow is harsh and clipped.", "Uneven spacing."],
      drill: "Five caws to a steady beat, two a second.",
      listen: [{ clip: "crow-caws", label: "Real American crow" }],
      spec: { kind: "series", maxSec: 8, pitch: [200, 3000], hp: 250, groupGap: 1.0,
        score: [["count", 1, { range: [3, 14] }], ["pace", 1, { range: [1.4, 3.5] }], ["rhythm", 1, { kind: "even", cv: 0.25 }], ["length", 0.8, { range: [0.15, 0.45] }]] },
      ghost: run(5, 0.5, 0.28, 0, 0)
    }
  };

  /* Where every recording came from. All free to use with credit; the
     non-commercial ones (NC) would need replacing before the app is sold. */
  var XC = function (what, by, n, lic, where) {
    var u = { "BY-NC-SA 4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/", "BY-NC-SA 3.0": "https://creativecommons.org/licenses/by-nc-sa/3.0/", "BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/", "BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/", "CC0": "https://creativecommons.org/publicdomain/zero/1.0/" }[lic];
    return { what: what, by: by, ref: "XC" + n, url: "https://xeno-canto.org/" + n, license: lic === "CC0" ? "CC0 (public domain)" : "CC " + lic, licenseUrl: u, where: where };
  };
  var NPS = function (what, ref, page, park) { return { what: what, by: "U.S. National Park Service, " + park, ref: ref, url: page, license: "Public domain", licenseUrl: page, where: park }; };
  var SB = function (what, ref, page, lic, by) {
    var u = { "Public domain": page, "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/", "CC BY-NC 3.0": "https://creativecommons.org/licenses/by-nc/3.0/" }[lic];
    return { what: what, by: by || "SoundBible.com", ref: ref, url: page, license: lic, licenseUrl: u, where: "SoundBible.com" };
  };
  var YELL = "https://www.nps.gov/yell/learn/photosmultimedia/sounds-elk.htm", ROMO = "https://www.nps.gov/romo/learn/photosmultimedia/sounds-wildlife-soundscapes.htm";
  var sounds = {
    "mallard-hen-quacks": XC("A hen mallard quacking", "Barry Edmonston", 692779, "BY-NC-SA 4.0", "Canada, 2021"),
    "mallard-hen-series": XC("A hen mallard's descending series", "Patrik Åberg", 110314, "BY-NC-SA 3.0", "Sweden, 2012"),
    "mallard-hen-lonesome": XC("A hen mallard calling now and then", "Patrik Åberg", 110314, "BY-NC-SA 3.0", "Sweden, 2012"),
    "mallard-feeding": XC("Mallards feeding at the edge of a pond", "Andrew Harrop", 1189375, "BY-NC-SA 4.0", "United Kingdom, 2026"),
    "mallard-drake": XC("A drake mallard's raspy call", "Patrik Åberg", 26967, "BY-NC-SA 3.0", "Sweden, 2007"),
    "blackduck-hen": XC("An American black duck hen's descending call", "Andrew Spencer", 203264, "BY-NC-SA 4.0", "United States, 2014"),
    "mottled-hen": XC("A mottled duck calling", "Paul Marvin", 192343, "BY-NC-SA 4.0", "United States, 2014"),
    "gadwall-calls": XC("Gadwall calling", "Mark Plummer", 979801, "BY-NC-SA 4.0", "United Kingdom, 2024"),
    "pintail-drake": XC("A drake pintail's rolling whistle", "David Darrell-Lambert", 1082420, "BY-NC-SA 4.0", "United Kingdom, 2026"),
    "wigeon-whistles": XC("Drake American wigeon whistling", "Paul Marvin", 384955, "BY-NC-SA 4.0", "United States, 2017"),
    "gwteal-peeps": XC("A drake green-winged teal peeping", "Ray Cooke", 1185027, "BY-NC-SA 4.0", "Canada, 2023"),
    "bwteal-peeps": XC("Drake blue-winged teal peeping", "Paul Marvin", 346077, "BY-NC-SA 4.0", "United States, 2016"),
    "bwteal-hen": XC("A blue-winged teal hen's descending call", "Paul Marvin", 363099, "BY-NC-SA 4.0", "United States, 2017"),
    "woodduck-squeals": XC("A hen wood duck's alarm squeals as a pair flushes", "Ed Pandolfino", 450846, "BY-NC-SA 4.0", "United States, 2018"),
    "scaup-growls": XC("A hen greater scaup calling as a pair flushes", "Andrew Spencer", 142583, "BY-NC-SA 3.0", "United States, 2013"),
    "ringneck-hen": XC("A ring-necked duck hen calling", "Stanislas Wroza", 1013385, "BY-NC-SA 4.0", "Canada, 2025"),
    "redhead-meows": XC("A drake redhead's display calls", "Stanislas Wroza", 1012785, "BY-NC-SA 4.0", "Canada, 2025"),
    "goose-honks": XC("A Canada goose honking", "Richard E. Webster", 816269, "BY-NC-SA 4.0", "United States, 2023"),
    "goose-clucks": XC("Canada geese clucking", "Doug Hynes", 934272, "BY-SA 4.0", "Canada, 2010"),
    "goose-pairs": XC("Canada geese calling in quick pairs", "Michael Hurben", 844837, "BY-NC-SA 4.0", "United States, 2023"),
    "goose-murmur": XC("A feeding flock's soft contact calls", "Thomas Bergman", 598177, "BY-NC-SA 4.0", "Sweden, 2020"),
    "turkey-yelps": XC("Wild turkeys yelping", "Richard E. Webster", 779658, "BY-NC-SA 4.0", "United States, 2022"),
    "turkey-tree": SB("Turkey tree call", "Turkey Tree Call", "https://soundbible.com/1337-Turkey-Tree-Call.html", "CC BY-NC 3.0"),
    "turkey-keekee": XC("Turkeys calling at the roost before fly-down", "Bruce Lagerquist", 586568, "BY-NC-SA 4.0", "United States, 2020"),
    "turkey-clucks": XC("A wild turkey hen with poults, clucking", "Paul Driver", 770958, "BY-NC-SA 4.0", "United States, 2013"),
    "turkey-purr": SB("Turkeys purring", "Turkey Purring", "https://soundbible.com/1314-Turkey-Purring.html", "CC BY-NC 3.0"),
    "turkey-cluckpurr": SB("Turkeys clucking and purring", "Turkey Cluck And Purr", "https://soundbible.com/1330-Turkey-Cluck-And-Purr.html", "CC BY-NC 3.0"),
    "turkey-cutts": XC("An agitated adult turkey: sharp clucks in an uneven run", "Jonathon Jongsma", 320490, "BY-SA 4.0", "United States, 2016"),
    "turkey-gobble": XC("A displaying gobbler", "Sue Riffe", 1003798, "BY-NC-SA 4.0", "United States, 2025"),
    "elk-location": SB("A bull elk bugling", "Elk", "https://soundbible.com/957-Elk.html", "Public domain"),
    "elk-bugle": NPS("A bull elk bugling at Mammoth Hot Springs, then grunting", "Elk Bugle One", YELL, "Yellowstone National Park"),
    "elk-chuckle": NPS("A bull elk's glugs (chuckles)", "Bull Elk glug", ROMO, "Rocky Mountain National Park"),
    "elk-cow-mew": NPS("Cow elk mews, with bulls bugling in the background", "Elk mew", ROMO, "Rocky Mountain National Park"),
    "elk-calf-mew": NPS("An elk calf calling", "Elk Calf", YELL, "Yellowstone National Park"),
    "moose-cow": SB("A cow moose calling, recorded by the U.S. Fish and Wildlife Service in Minnesota", "Moose", "https://soundbible.com/1227-Moose.html", "Public domain", "U.S. Fish and Wildlife Service"),
    "deer-fawn": XC("A whitetail fawn in distress", "Paul Driver", 961772, "BY-NC-SA 4.0", "United States, 2010"),
    "deer-blow": XC("Whitetail (Coues) deer blowing", "Paul Marvin", 975498, "BY-NC-SA 4.0", "United States, 2022"),
    "quail-bobwhite": XC("A northern bobwhite singing", "Bruce Lagerquist", 714443, "BY-NC-SA 4.0", "United States, 2019"),
    "quail-covey": XC("Northern bobwhite covey calls", "John A. Trent", 202972, "BY-NC-SA 4.0", "United States, 2014"),
    "dove-coo": XC("A mourning dove cooing", "Paul Marvin", 807126, "BY-NC-SA 4.0", "United States, 2023"),
    "coyote-lone": XC("A lone coyote howling in answer", "Jeff Stewart", 1189185, "BY-NC-SA 4.0", "Canada, 2026"),
    "coyote-howl": NPS("Coyotes howling along the Gibbon River", "Coyotes Howling", "https://www.nps.gov/yell/learn/photosmultimedia/sounds-coyote.htm", "Yellowstone National Park"),
    "fox-red": XC("A red fox barking", "Lars Edenius", 1105620, "BY-NC-SA 4.0", "Sweden, 2026"),
    "fox-gray": XC("A gray fox barking", "Chris Harrison", 1046109, "BY-NC-SA 4.0", "United States, 2018"),
    "barred-owl": XC("A barred owl's two-phrase call", "Sunny Tseng", 911365, "BY-NC-SA 4.0", "Canada, 2021"),
    "horned-owl": XC("A pair of great horned owls hooting", "Scott Olmstead", 767276, "BY-NC-SA 4.0", "United States, 2022"),
    "crow-caws": XC("An American crow cawing", "Thomas Magarian", 462765, "BY-NC-SA 4.0", "United States, 2018")
  };

  Object.keys(calls).forEach(function (id) {
    var c = calls[id];
    c.id = id;
    if (c.learn) {
      var L = LEARNED[id];
      c.spec = Object.assign({}, c.spec, { score: L ? L.score : [] });
      c.ghost = L ? L.ghost : [];
      c.measured = L ? L.measured : null;
    }
    // what the real animal sounds like — pitch level and tone — on every call,
    // hand-set or learned, so the right rhythm on the wrong sound cannot pass
    if (VOICE[id]) c.spec = Object.assign({}, c.spec, { score: (c.spec.score || []).concat(VOICE[id]) });
    // calls whose real recordings the scorer cannot tell apart from this one's
    c.near = NEAR[id] || [];
  });
  var data = { groups: groups, species: species, calls: calls, sounds: sounds };
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.CALLWILD = data;
})(typeof self !== "undefined" ? self : this);
