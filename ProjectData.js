﻿ /** @constructor */
var ProjectData = function() {
  this.projectItems = {
    comps: [],
    footage: [],
    solids: [],
    folders: []
  }
};

/**
 * ProjectData.prototype.run - the 'helper function' which sequentiallty runs the methods of
 * this object.
 *
 * @return {undefined}  None
 */
ProjectData.prototype.run = function() {

  this.filterProject();
  $.writeln(this.projectItems.folders.join('\r\n'));

};


/**
 * ProjectData.prototype.filterProject - filters the project, categorixing items as either
 * solids, footage, comps or folders.
 *
 * @return {undefined}  none.
 */
ProjectData.prototype.filterProject = function() {

  /*
  This function sorts the project items into their respective types.
  Have to loop backwards so things get indexed correctly !!
  */

  for (var i = app.project.numItems; i >= 1; i--) {
    var itm = app.project.item(i);
    if (itm instanceof CompItem) {
      this.projectItems.comps.push(itm); // item is a comp.
    } else if (itm instanceof FolderItem) {
      this.projectItems.folders.push(itm); // item is a folder.
    } else {
      if (itm.mainSource instanceof SolidSource) {
        this.projectItems.solids.push(itm); // item is a solid.
      } else {
        this.projectItems.footage.push(itm); // item is footage.
      }
    }
  }
};

/**
 * ProjectData.prototype.getDepth - gets the depth (number of parent project folders)
 * for any given project item.
 *
 * @param  {ProjectItem}  itm the item to find the depth of.
 * @return {undefined}    none
 */
ProjectData.prototype.getDepth = function(itm) {


  var dpth = 0;
  var calcDepth = function(myItm) {
    try {
      if (myItm.parentFolder.name != "Root") {
        dpth++;
        calcDepth(myItm.parentFolder);
      }
    } catch (e) {
      return;
    }

  };

  if (itm) {
    calcDepth(itm);
  }
  return dpth;
};
