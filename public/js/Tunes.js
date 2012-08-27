(function($) {

  window.User = Backbone.Model.extend({ });

  window.Users = Backbone.Collection.extend({
    model: User,
    url: "/users"
  });

  window.users = new window.Users();


  window.UserView = Backbone.View.extend({
    tagName: "tr",
    className: "user",
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.template = _.template($("#user-template").html());
    },

    render: function() {
      var renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    }
  });

  window.AddUserView = UserView.extend({
    tagName: "div",
    className: "user-add",

    events: {
      'click .submit': 'addToCollection'
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template($("#user-add-template").html());
    },

    addToCollection: function() {
      var $name = $("input#name"),
      $role = $("input#role");
      this.model.set({
        "name": $name.val(),
        "role": $role.val()
      });
      window.users.add(this.model);
      $name.val('');
      $role.val('');
    }
  });



  window.UsersView = Backbone.View.extend({

    classname: 'users',

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template($("#users-template").html());
      this.collection.bind('reset', this.render);
      this.collection.bind('add', this.render);
    },

    render: function() {
      var $users;
      var collection = this.collection;

      $(this.el).html(this.template({}));
      $users = this.$(".users-table");

      this.collection.each(function(user) {
        var view = new UserView({
          model: user,
          collection: collection
        });
        $users.append(view.render().el);
      });
      return this;
    }
  });

  window.UsersJQView = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this, 'render');
      this.collection.bind('reset', this.render);
      this.collection.bind('add', this.render);
    },

    render: function() {
      var $table;
      var collection = this.collection;

      $table = window.usersTable;

      this.collection.each(function(user, i) {
        $table.jqGrid('addRowData', (i + 1), user.toJSON());
      });
    }
  });


  window.UsersDemo = Backbone.Router.extend({
    routes: {
      '': 'home',
      'jqgrid': 'jqgrid'
    },

    initialize: function() {
      this.addUserView = new AddUserView({
        model: new User()
      });
      this.usersView = new UsersView({
        collection: window.users
      });
      this.usersjqView = new UsersJQView({
        collection: window.users
      });
    },

    home: function() {
      var $container = $("#container");
      $container.empty();
      $container.append(this.addUserView.render().el);
      $container.append(this.usersView.render().el);
    },

    jqgrid: function() {
      var $container = $("#container");
      $container.append(this.addUserView.render().el);
      window.usersTable = $("#jqusers").jqGrid({
        datatype: 'local',
        width: '100%',
        colNames: ['Name', 'Role'],
        colModel: [ {name: 'Name', align: 'left'},
                    {name: 'Role', align: 'left'}]
      });
    }

  });

  $(function() {
    window.App = new UsersDemo();
    Backbone.history.start();
  });

})(jQuery);
