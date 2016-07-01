var imageStore = new FS.Store.OSS("images", {
  region: Meteor.settings.public.aliyunRegion,
  internal: Meteor.settings.public.aliyunInternal,
  bucket: Meteor.settings.public.aliyunBucket,
  accessKeyId: Meteor.settings.public.aliyunAccessId, 
  secretAccessKey: Meteor.settings.public.aliyunAccessKeySecret,
//  transformWrite: function(fileObj, readStream, writeStream) {
//    gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
//  }
});

var thumbStore = new FS.Store.OSS("thumbs", {
  region: Meteor.settings.public.aliyunRegion,
  internal: Meteor.settings.public.aliyunInternal,
  bucket: Meteor.settings.public.aliyunBucketThumb,
  accessKeyId: Meteor.settings.public.aliyunAccessId, 
  secretAccessKey: Meteor.settings.public.aliyunAccessKeySecret,
  beforeWrite: function(fileObj) {
    fileObj.size(200, {store: 'thumbStore', save: false});
  },
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream, fileObj.name()).resize('1800', '1800').stream().pipe(writeStream)
  }
});

//Schemas = {};

Images = new FS.Collection("Images", {
    stores: [thumbStore, imageStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        },
        onInvalid: function(message) {
            toastr.error(message);
        }
    }
});
//
//Schemas.Images = new SimpleSchema({
//    title: {
//        type: String,
//        max: 60
//    },
//  content: {
//    type: String,
//    autoform: {
//      rows: 5
//    }
//  },
//  createdAt: {
//    type: Date,
//    label: 'Date',
//    autoValue: function () {
//      if (this.isInsert) {
//        return new Date();
//      }
//    }
//  },
//  owner: {
//    type: String,
//    regEx: SimpleSchema.RegEx.Id,
//    autoValue: function () {
//      if (this.isInsert) {
//        return Meteor.userId();
//      }
//    },
//    autoform: {
//      options: function () {
//        _.map(Meteor.users.find().fetch(), function (user) {
//          return {
//            label: user.emails[0].address,
//            value: user._id
//          };
//        });
//      }
//    }
//  }
//});
//
//Images.attachSchema(Schemas.Images);

Images.allow({
    insert: function(userId, doc) { return userId != null; },
//    update: function(userId, image) { return userId === image.userId; },
    update: function(userId, image, fields, modifier) { 
        return ((userId === image.userId) || _.contains(fields, 'downloadCount') || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, image) { return ((userId === image.userId) || Roles.userIsInRole(userId, ['admin'])); },
    download: function() { return true; }
});