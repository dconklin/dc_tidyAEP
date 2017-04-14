
/**
 * CompMerger - Comp Merger class. This class has methods and properties
 * relating to consolidating compositions.
 *
 */
var CompMerger = function(itms) {
  this.projectItems = itms;
  this.compObjects = [];
  this.doRename = true;
};

CompMerger.prototype.run = function() {
  this.makeCompObjects();
  this.consolidateComps();
};

CompMerger.prototype.makeCompObjects = function() {

  var counter = 0;
  var itmCount = this.projectItems.comps.length;
  var pb = new DcProgressBar(scriptData.name,
    'Making Comp Objects (Step 02) - This may take several moments.', 0,
    itmCount);

  for (var i = 0; i < itmCount; i++) {
    counter++;
    var cmp = this.projectItems.comps[i];
    if (cmp) {
      var pc = new ProjectComp(cmp, pd.getDepth(cmp));
      pc.init();
      this.compObjects.push(pc);
    }
    pb.setProgress(counter);
    pb.setDescription('Making CompObject for item ' + pc.name + '. ' + (
      itmCount - counter) + ' comps remaining.');

  }

};

CompMerger.prototype.replaceComp = function(replacee, replacer) {
  for (var x = 0; x < this.projectItems.comps.length; x++) {
    var cmp = this.projectItems.comps[x];
    if (cmp == replacee || cmp == replacer) {
      continue;
    }

    for (var y = 1; y <= cmp.numLayers; y++) {
      if (cmp.layer(y).source == replacee) {
        cmp.layer(y).replaceSource(replacer, true);
      }
    }
  }

};

CompMerger.prototype.consolidateComps = function() {

  var counter = 0;
  var itmCount = this.compObjects.length;
  var pb = new DcProgressBar(scriptData.name,
    'Consolidating Comps (Step 03)', 0,
    itmCount);

  for (var i = 0; i < itmCount; i++) {
    for (var j = itmCount - 1; j > i; j--) {
      counter++;
      var cmp1string = this.compObjects[i].contentsString;
      var cmp2string = this.compObjects[j].contentsString;
      if (cmp1string == cmp2string) {
        if (this.compObjects[i].depth <= this.compObjects[j].depth) {
          this.replaceComp(this.compObjects[i].comp, this.compObjects[j].comp);
          this.compObjects[i].inUse = 0;
        } else {
          this.replaceComp(this.compObjects[j].comp, this.compObjects[i].comp);
          this.compObjects[j].inUse = 0;
        }
        pd.results.consolidatedComps++;
      }
      pb.setProgress(counter);
      pb.setDescription(counter + ' of ' + itmCount + ' comps processed.');

    }
  }
};

CompMerger.prototype.removeUnusedComps = function() {

  var counter = 0;
  var itmCount = this.compObjects.length;
  var pb = new DcProgressBar(scriptData.name,
    'Cleaning Up Consolidated Comps', 0, itmCount);

  for (var i = this.compObjects.length - 1; i >= 0; i--) {
    var cmp = this.compObjects[i];
    if (!cmp.inUse) {
      cmp.comp.remove();
      pd.results.removedItems++;
    }
    pb.setProgress(counter);
    pb.setDescription('Checking for unused comps. ' + (itmCount - counter) +
      ' comps remaining.');
  }

};
