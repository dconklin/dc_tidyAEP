
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
  for (var i = 0; i < this.projectItems.comps.length; i++) {
    var cmp = this.projectItems.comps[i];
    if (cmp) {
      var pc = new ProjectComp(cmp, pd.getDepth(cmp));
      pc.init();
      this.compObjects.push(pc);
    }
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
  for (var i = 0; i < this.compObjects.length; i++) {
    for (var j = this.compObjects.length - 1; j > i; j--) {
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

      }
    }
  }
};

CompMerger.prototype.removeUnusedComps = function() {
  for (var i = this.compObjects.length - 1; i >= 0; i--) {
    var cmp = this.compObjects[i];
    if (!cmp.inUse) {
      cmp.comp.remove();
    }
  }

};
