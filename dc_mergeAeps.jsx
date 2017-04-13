
/*
Goals:
    Script should merge folders in an after effects project.
Criteria for merging:
    1. Folders have same name.
    2. Deep folders get merged with shallow folders.
    3. Hierarchy should be maintained.
Questions:
    1. What if project intnetionally has 2 folders named the
    same name? Does this happen?
Steps:
    1. Collect names of folders.
    2. Collect nested depth of folders
    3. Merge contents of deep folders into shallow folders
    4. Delete empty folders.
*/

(function dc_mergeAeps() {
  //@include json2.js
  //@include ProjectFolder.js
  //@include ProjectComp.js
  //@include ProjectData.js
  //@include FolderMerger.js
  //@include CompMerger.js


  app.beginUndoGroup("dc_mergeAeps.jsx");

  // Make a ProjectData object to handle things like sorting.
  var pd = new ProjectData();
  pd.run();

  // Make a CompMerger object to merge comps.
  var cm = new CompMerger(pd.projectItems);
  cm.run();

  // Make a FolderMerger object to merge the folders.
  var fm = new FolderMerger(pd.projectItems);
  fm.run();

  // Clean up the project.
  cm.removeUnusedComps();
  fm.clearEmptyFolders();

  app.endUndoGroup();
})();
