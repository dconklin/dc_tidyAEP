var DcProgressBar = function(title, desc, low, high) {

  this.title = title || 'dc_mergeAeps.jsx';
  this.desc = desc || 'Working..';

  this.val = low || 0;
  this.low = low || 0;
  this.high = high || 100;

  this.w = new Window('palette', this.title);
  if (this.w) {
    this.w.pbar = this.w.add('progressbar', undefined, this.low, this.high);
    this.w.description = this.w.add('statictext', undefined, this.desc, {
      multiline: true
    });

    this.w.pbar.preferredSize.width =
      this.w.description.preferredSize.width = 300;

    this.w.show();
  }
};

DcProgressBar.prototype.setProgress = function(val) {
  this.w.pbar.value = val;
  if (this.w.pbar.value >= this.high) {
    // this.w.close();
  }
};

DcProgressBar.prototype.setDescription = function(txt) {
  if (txt || txt == '') {
    this.w.description.text = txt;
  }
};
