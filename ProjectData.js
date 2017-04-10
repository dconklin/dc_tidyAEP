var ProjectData = function(){    this.projectItems = {        comps:[],        footage:[],        solids:[],        folders:[]    }    this.folderObjects = [];}ProjectData.prototype.run = function(){
    helper.print("ProjectData.run() called. Starting main logic of script.");

    app.beginUndoGroup("dc_mergeProjectFolders.jsx");
        this.filterProject();
        this.makeFolderObjects();
        this.sortFolderObjects();
        this.mergeFolders();
        this.clearEmptyFolders();
    app.endUndoGroup();
}ProjectData.prototype.filterProject = function(){    /*    This function sorts the project items into their respective types.    */

    helper.print("ProjectData.filterProject() called. Beginning to loop through project.");
    for(var i = 1; i <= app.project.numItems; i++){
        var itm = app.project.item(i);
        helper.print("Looking at project item " + itm.name);
        if(itm instanceof CompItem){
            helper.print(itm.name + " is a Comp.");
            this.projectItems.comps.push(itm);  // item is a comp.        } else if (itm instanceof FolderItem){
            helper.print(itm.name + " is a Folder.");
            this.projectItems.folders.push(itm);  // item is a folder.        } else {            if(itm.mainSource instanceof SolidSource){
                helper.print(itm.name + " is a Solid.");
                this.projectItems.solids.push(itm);  // item is a solid.            } else {
                helper.print(itm.name + " is a piece of footage.");
                this.projectItems.footage.push(itm);  // item is footage.            }        }    }}ProjectData.prototype.getDepth = function (itm) {
    helper.print("Running ProjectData.getDepth() on " + itm.name)
    var dpth = 0;    var calcDepth = function(myItm){        if(myItm.parentFolder.name !== "Root"){            dpth++;            calcDepth(myItem.parentFolder);        }    }    calcDepth(itm);
    helper.print(itm.name + " is at a depth of " + dpth);
    return dpth;};ProjectData.prototype.makeFolderObjects = function(){

    // helper.print("Running ProjectData.makeFolderObjects() on " + this.projectItems.folders.length + " folders stored in projectItems");
    helper.print("Listing folders: 1:" + this.projectItems.folders[0].name);
    // for(var i = 0; i < this.projectItems.folders.length; i++){
    //     var fldr = this.projectItems.folders[i];
    //     helper.print("Adding " + fldr + " to this.folderObjects as a new Folder Object");
    //     this.folderObjects.push(new ProjectFolder(fldr, this.getDepth(fldr)));
    // }
}ProjectData.prototype.sortFolderObjects = function(){

    var folderHolder = this.folderObjects.slice(0);

    helper.print("Starting order: " + folderHolder);
    var newOrder = folderHolder.sort(function(a,b){
        if(a.depth < b.depth){
            return -1;
        }
        if(a.depth > b.depth){
            return 1;
        }
        return 0;
    });
    helper.print("Ending order: " + newOrder);
    this.projectItems.folders = newOrder;
}ProjectData.prototype.mergeFolders = function(){
    helper.print("Running projectFoler.mergeFolders()");

    var folderHolder = this.folderObjects.slice(0);
    var copyContents = function(s,d){        helper.print("Copy contents called. Source:" + s + ", Destination:" + d);
        if(s==d){            helper.print("Attempted copy contents from folder " + s.name + " to itself. Leaving contents unchanged.");            return true;        }        if(d instanceof FolderItem){
            if(s instanceof FolderItem){
                helper.print("Both s and d are Folders. Merging items.");
                for(var i = 1; i <= s.numItems; i++){
                    s.item(i).parentFolder = d;
                }                return true;            } else if (s instanceof FootageItem){
                helper.print("s is a piece of footage. Moving to d.");
                d.parentFolder = s;                return true;            } else {                helper.print(d.name + " is neither a folder or a footage item. Cannot merge into " + s.name);                return true;            }        } else {            helper.print(s.name + " is not a Folder! Cannot copy contents.");            return false;        }    }    for(var i = folderHolder.length-1; i >= 0; i--){        for(var j = 0; j < i-1; j++){ // only check up to index i (since we're going backwards in the i loop and fwds in j loop).            if(folderHolder[i].folder.name == folderHolder[j].name){                copyContents(folderHolder[j], folderHolder[i]);                break;            }        }    }}ProjectData.prototype.clearEmptyFolders = function(){    var fldrs = this.projectItems.folders;    for(var i = fldrs.length-1; i >= 0; i--){        if(fldrs[i].numItems == 0){            fldrs[i].remove();        }    }}