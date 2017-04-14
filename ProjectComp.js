var ProjectComp = function(cmp, dpth) {

  this.comp = cmp;
  this.name = cmp.name;
  this.depth = dpth;
  this.contents = {};
  this.inUse = 1;
  this.contentString = '';

};

ProjectComp.prototype.init = function() {
  this.setContents();
  this.getContentsString();
};

ProjectComp.prototype.setContents = function() {

  var l = {};
  var getProps = function(parentProp) {
    if (parentProp) {
      var prop;
      for (var i = 1; i <= parentProp.numProperties; i++) {

        prop = parentProp.property(i);

        if (prop.propertyType == PropertyType.PROPERTY) {
          // this is a property.
          var propObj = {};
          if (prop.propertyValueType == PropertyValueType.NO_VALUE) {
            propObj[prop.name] = 'NO_VALUE';
            l[parentProp.name].push(propObj);
          } else if (prop.propertyValueType == PropertyValueType.CUSTOM_VALUE) {
            propObj[prop.name] = 'CUSTOM_VALUE';
            l[parentProp.name].push(propObj);
          } else {
            propObj[prop.name] = prop.value.toString();
            l[parentProp.name].push(propObj);
          }
        } else if (prop.propertyType == PropertyType.INDEXED_GROUP || prop.propertyType ==
          PropertyType.NAMED_GROUP) {
          // this is a property group (has sub-properties.)
          // recurse through the sub properties.
          l[prop.name] = [];
          getProps(prop);
        } else {
          // this property is of an unknown type.

        }
      }
    }
  };

  for (var i = 1; i <= this.comp.numLayers; i++) {
    l[this.comp.layer(i).name] = [];
    getProps(this.comp.layer(i));
  }

  this.contents = l;

};

ProjectComp.prototype.getContentsString = function() {
  this.contentsString = JSON.stringify(this.contents);
};
