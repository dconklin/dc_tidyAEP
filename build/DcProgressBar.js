var DcProgressBar = function(title, helpText, low, high) {

  this.title = title || 'dc_mergeAeps.jsx';
  this.helpText = helpText || '';
  this.desc = helpText + '\r\n ' || '';

  this.val = low || 0;
  this.low = low || 0;
  this.high = high || 100;

  this.w = new Window('palette', this.title);
  if (this.w) {
    this.w.helpText = this.w.add('statictext', undefined, this.helpText, {
      multiline: true
    });
    this.w.pbar = this.w.add('progressbar', undefined, this.low, this.high);
    this.w.description = this.w.add('statictext', undefined, this.desc, {
      multiline: true
    });

    this.w.preferredSize.height = 140;

    this.w.helpText.preferredSize.width =
      this.w.pbar.preferredSize.width =
      this.w.description.preferredSize.width = 350;

    this.w.show();
  }
};

DcProgressBar.prototype.setProgress = function(val) {
  this.val = val;
  if (this.w.pbar.value >= this.high) {
    this.w.close();
  }
  this.w.pbar.value = this.val;
};

DcProgressBar.prototype.setDescription = function(txt) {
  if (txt || txt == '') {
    this.w.description.text = txt;
  }
};
