/**
 * var FolderMerger - Class to handle folder sorting, merging and consolidating.
 *
 * @param  {Object} itms project items (from ProjectData object.)
 */
var FolderMerger = function(itms) {
  this.projectItems = itms;
  this.folderObjects = [];
};


/**
 * FolderMerger.prototype.run - Object which handles function of merging and
 * consolodating folders.
 *
 */
FolderMerger.prototype.run = function() {

  this.clearEmptyFolders();
  this.makeFolderObjects();
  this.sortFolderObjects();
  this.mergeFolders();

};


/**
 * FolderMerger.prototype.makeFolderObjects - Turns project folders into FolderObjects.
 *
 */
FolderMerger.prototype.makeFolderObjects = function() {
  for (var i = 0; i < this.projectItems.folders.length; i++) {
    var fldr = this.projectItems.folders[i];
    if (fldr) {
      this.folderObjects.push(new ProjectFolder(fldr, pd.getDepth(fldr)));
    }
  }
};


/**
 * FolderMerger.prototype.sortFolderObjects - Sorts folder objects inside of this.folderObjects
 * using a custom sorting function (depth of folder.)
 *
 */
FolderMerger.prototype.sortFolderObjects = function() {
  var folderHolder = this.folderObjects.slice(0);

  /**
   * var newOrder - takes the Array folderHolder and sorts it based on
   * its folders' depths.
   *
   * @param  {FolderObject} a     current object
   * @param  {FolderObject} b     object to compare against.

   */
  var newOrder = folderHolder.sort(function(a, b) {
    if (a.depth < b.depth) {
      return -1;
    }
    if (a.depth > b.depth) {
      return 1;
    }
    return 0;
  });

  this.folderObjects = newOrder;

};

/**
 * copyContents - Copies contents from one folder to another.
 *
 * @param  {FolderItem} s Source folder Object
 * @param  {FolderItem} d Destination folder object.
 */
FolderMerger.prototype.copyContents = function(s, d, sd, dd) {
  if (s == d) {
    return true;
  }

  for (var i = s.numItems; i >= 1; i--) {

    var itm = s.item(i);

    if (itm.parentFolder != d) {
      itm.parentFolder = d;
    }

  }
  return true;

};


/**
 * FolderMerger.prototype.mergeFolders - the main logic of the script. When called, compares
 * the folders inside of this.folderObjects and merges the contents to the least-nested.
 *
 */
FolderMerger.prototype.mergeFolders = function() {

  var folderHolder = this.folderObjects.slice(0);

  // i = most nested folder working backwards.
  // j = least nested folder working forewards.
  for (var i = folderHolder.length - 1; i >= 0; i--) {
    for (var j = 0; j < i; j++) { // only check up to index i (since we're going backwards in the i loop and fwds in j loop).
      if (folderHolder[j].name == folderHolder[i].name) {
        this.copyContents(folderHolder[i].folder, folderHolder[j].folder,
          folderHolder[i].depth, folderHolder[j].depth);
        break;
      }
    }
  }

};

/**
 * FolderMerger.prototype.clearEmptyFolders - Cleans empty folders from an AEP.
 *
 */
FolderMerger.prototype.clearEmptyFolders = function() {
  for (var i = app.project.numItems; i >= 1; i--) {
    var itm = app.project.item(i);
    if (itm instanceof FolderItem && itm.numItems == 0) {
      itm.remove();
    }
  }
};
